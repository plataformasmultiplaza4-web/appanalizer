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
import { transformWindsorData } from '@/lib/windsor'
import type { WindsorAccountData, WindsorRawRow } from '@/types/windsor'

const WINDSOR_BASE = 'https://api.windsor.ai/data'

async function fetchWindsorDirect(params: {
  connector: string
  accountIds: string[]
  dateFrom: string
  dateTo: string
  fields: string[]
  apiKey: string
}): Promise<{ data: WindsorRawRow[]; error?: string }> {
  try {
    const res = await fetch(WINDSOR_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: JSON.stringify({
        connector: params.connector,
        date_from: params.dateFrom,
        date_to: params.dateTo,
        fields: params.fields,
        breakdown: 'ad',
        account_ids: params.accountIds,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return { data: [], error: `Windsor ${res.status}: ${text.slice(0, 100)}` }
    }

    const json = await res.json()

    if (json.data?.[0]?.ad_name?.includes('License expired')) {
      return { data: [], error: 'Windsor license expired' }
    }

    return { data: json.data ?? [] }
  } catch (err) {
    return { data: [], error: String(err) }
  }
}

async function fetchAllMetrics(dateRange: DateRange): Promise<{
  data: TransformedData
  source: 'windsor' | 'demo'
  error?: string
}> {
  const apiKey = process.env.NEXT_PUBLIC_WINDSOR_API_KEY
  const { from, to } = getDateRange(dateRange)

  // No API key — return demo
  if (!apiKey) {
    return { data: MOCK_TRANSFORMED_DATA, source: 'demo', error: 'WINDSOR_API_KEY not configured' }
  }

  const tiktokAccounts = Object.values(TIKTOK_AD_ACCOUNTS)
  const metaAccounts = Object.values(META_AD_ACCOUNTS)

  const [tiktokResult, metaResult] = await Promise.all([
    fetchWindsorDirect({
      connector: 'tiktok',
      accountIds: tiktokAccounts.map((a) => a.id),
      dateFrom: from,
      dateTo: to,
      fields: WINDSOR_TIKTOK_FIELDS,
      apiKey,
    }),
    fetchWindsorDirect({
      connector: 'facebook',
      accountIds: metaAccounts.map((a) => a.id),
      dateFrom: from,
      dateTo: to,
      fields: WINDSOR_META_FIELDS,
      apiKey,
    }),
  ])

  const byTiktokAccount: Record<string, WindsorRawRow[]> = {}
  for (const row of tiktokResult.data) {
    const id = String(row.account_id ?? '')
    if (!byTiktokAccount[id]) byTiktokAccount[id] = []
    byTiktokAccount[id].push(row)
  }

  const byMetaAccount: Record<string, WindsorRawRow[]> = {}
  for (const row of metaResult.data) {
    const id = String(row.account_id ?? '')
    if (!byMetaAccount[id]) byMetaAccount[id] = []
    byMetaAccount[id].push(row)
  }

  const allAccountsData: WindsorAccountData[] = [
    ...tiktokAccounts.map((a) => ({
      accountId: a.id,
      accountName: a.name,
      platform: 'tiktok' as const,
      data: byTiktokAccount[a.id] ?? [],
      error: tiktokResult.error ?? null,
    })),
    ...metaAccounts.map((a) => ({
      accountId: a.id,
      accountName: a.name,
      platform: 'meta' as const,
      data: byMetaAccount[a.id] ?? [],
      error: metaResult.error ?? null,
    })),
  ]

  const hasData = allAccountsData.some((a) => a.data.length > 0)
  const error = tiktokResult.error ?? metaResult.error ?? undefined

  if (!hasData) {
    return { data: MOCK_TRANSFORMED_DATA, source: 'demo', error }
  }

  const transformed = transformWindsorData(allAccountsData)
  return { data: transformed, source: 'windsor' }
}

export function useMetrics(dateRange: DateRange = '7d') {
  const { data, error, isLoading } = useSWR(
    ['metrics', dateRange],
    () => fetchAllMetrics(dateRange),
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
      onErrorRetry: (_err, _key, _config, revalidate, { retryCount }) => {
        if (retryCount >= 2) return
        setTimeout(() => revalidate({ retryCount }), 5000)
      },
    },
  )

  const metricsData: TransformedData = data?.data ?? MOCK_TRANSFORMED_DATA
  const isDemo = data?.source === 'demo' && !isLoading
  const isExpired = data?.error?.includes('expired') || data?.error?.includes('license')

  return {
    metrics: metricsData,
    isLoading,
    isDemo,
    isExpired: !!isExpired,
    error: error ?? null,
    refetch: async () => {},
  }
}
