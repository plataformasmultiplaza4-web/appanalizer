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

async function fetchMetrics(
  dateRange: DateRange,
  demo: boolean,
): Promise<WindsorAPIResponse> {
  const { from, to } = getDateRange(dateRange)

  const res = await fetch('/api/windsor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dateFrom: from, dateTo: to, demo }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? `HTTP ${res.status}`)
  }

  return res.json()
}

export function useMetrics(dateRange: DateRange = '7d') {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  const { data, error, isLoading, mutate } = useSWR<WindsorAPIResponse>(
    ['metrics', dateRange],
    () => fetchMetrics(dateRange, isDemoMode),
    {
      refreshInterval: 5 * 60 * 1000, // 5 min
      revalidateOnFocus: false,
      onErrorRetry: (err, _key, _config, revalidate, { retryCount }) => {
        // Don't retry on 402 (license expired)
        if (err.message?.includes('license')) return
        if (retryCount >= 2) return
        setTimeout(() => revalidate({ retryCount }), 5000)
      },
    },
  )

  // Fallback to demo data on error (Windsor not configured / expired)
  const metricsData: TransformedData = data?.data ?? (error ? MOCK_TRANSFORMED_DATA : MOCK_TRANSFORMED_DATA)
  const isDemo = data?.source === 'demo' || !!error
  const isExpired = error?.message?.includes('license') || error?.message?.includes('expired')

  return {
    metrics: metricsData,
    isLoading,
    isDemo,
    isExpired,
    error: error ?? null,
    refetch: mutate,
  }
}
