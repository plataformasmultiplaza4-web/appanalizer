'use client'

import useSWR from 'swr'
import type { TransformedData } from '@/types/metrics'
import type { DateRange } from '@/types/dashboard'
import { getDateRange } from '@/lib/utils'
import { MOCK_TRANSFORMED_DATA } from '@/lib/mock-data'
import {
  TIKTOK_AD_ACCOUNTS,
  META_AD_ACCOUNTS,
  WINDSOR_TIKTOK_FIELDS,
  WINDSOR_META_FIELDS,
} from '@/lib/constants'

const WINDSOR_BASE = 'https://api.windsor.ai/data'

interface WindsorAPIResponse {
  data: TransformedData
  source: 'windsor' | 'demo'
  error?: string
}

async function fetchWindsorDirect(
  connector: 'tiktok' | 'facebook',
  accountIds: string[],
  fields: string[],
  dateFrom: string,
  dateTo: string,
): Promise<unknown[]> {
  const apiKey = process.env.NEXT_PUBLIC_WINDSOR_API_KEY
  if (!apiKey) return []

  const params = new URLSearchParams({
    api_key: apiKey,
    connector,
    date_from: dateFrom,
    date_to: dateTo,
    fields: fields.join(','),
    breakdown: 'ad',
    account_ids: accountIds.join(','),
  })

  const res = await fetch(`${WINDSOR_BASE}?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) return []
  const json = await res.json()
  return json.data ?? []
}

async function fetchMetrics(dateRange: DateRange): Promise<WindsorAPIResponse> {
  const { from, to } = getDateRange(dateRange)

  const apiKey = process.env.NEXT_PUBLIC_WINDSOR_API_KEY

  // If API key is available, call Windsor directly from browser (bypasses server DNS issues)
  if (apiKey) {
    try {
      const tiktokIds = Object.values(TIKTOK_AD_ACCOUNTS).map((a) => a.id)
      const metaIds = Object.values(META_AD_ACCOUNTS).map((a) => a.id)

      const [rawTiktok, rawMeta] = await Promise.all([
        fetchWindsorDirect('tiktok', tiktokIds, WINDSOR_TIKTOK_FIELDS, from, to),
        fetchWindsorDirect('facebook', metaIds, WINDSOR_META_FIELDS, from, to),
      ])

      // Send raw data to server for transformation
      const res = await fetch('/api/windsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawTiktok, rawMeta, bypassDns: true }),
      })

      if (res.ok) {
        return res.json()
      }
    } catch {
      // Fall through to demo
    }
  }

  // Fallback: let server try to call Windsor (may fail if DNS blocked)
  const res = await fetch('/api/windsor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dateFrom: from, dateTo: to }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }

  return res.json()
}

export function useMetrics(dateRange: DateRange = '7d') {
  const { data, error, isLoading } = useSWR<WindsorAPIResponse>(
    ['metrics', dateRange],
    () => fetchMetrics(dateRange),
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
      onErrorRetry: (err, _key, _config, revalidate, { retryCount }) => {
        if (err.message?.includes('license')) return
        if (retryCount >= 2) return
        setTimeout(() => revalidate({ retryCount }), 5000)
      },
    },
  )

  const metricsData: TransformedData = data?.data ?? MOCK_TRANSFORMED_DATA
  const isDemo = (data?.source === 'demo' || !!error) && !isLoading
  const isExpired =
    error?.message?.includes('license') ||
    error?.message?.includes('expired') ||
    data?.error?.includes('expired')

  return {
    metrics: metricsData,
    isLoading,
    isDemo,
    isExpired: !!isExpired,
    error: error ?? null,
    refetch: async () => {},
  }
}
