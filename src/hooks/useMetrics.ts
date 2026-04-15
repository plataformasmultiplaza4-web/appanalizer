'use client'

import useSWR from 'swr'
import type { TransformedData } from '@/types/metrics'
import type { DateRange } from '@/types/dashboard'
import { getDateRange } from '@/lib/utils'
import { MOCK_TRANSFORMED_DATA } from '@/lib/mock-data'

interface WindsorAPIResponse {
  data: TransformedData
  source: 'windsor' | 'demo'
  error?: string
  hint?: string
}

async function fetchMetrics(dateRange: DateRange): Promise<WindsorAPIResponse> {
  const { from, to } = getDateRange(dateRange)

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
  const isExpired = error?.message?.includes('license') || error?.message?.includes('expired') || data?.error?.includes('expired')

  return {
    metrics: metricsData,
    isLoading,
    isDemo,
    isExpired: !!isExpired,
    error: error ?? null,
    refetch: async () => {},
  }
}
