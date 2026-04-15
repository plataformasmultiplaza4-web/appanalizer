'use client'

import useSWR from 'swr'
import type { TransformedData } from '@/types/metrics'
import type { DateRange } from '@/types/dashboard'
import { getDateRange } from '@/lib/utils'
import { MOCK_TRANSFORMED_DATA } from '@/lib/mock-data'

const WINDSOR_API_KEY = process.env.NEXT_PUBLIC_WINDSOR_API_KEY ?? ''
const WINDSOR_BASE = 'https://api.windsor.ai/data'

interface WindsorAPIResponse {
  data: TransformedData
  source: 'windsor' | 'demo'
  error?: string
}

async function fetchWindsorDirect(
  connector: string,
  accountIds: string[],
  dateFrom: string,
  dateTo: string,
  fields: string[],
): Promise<unknown[]> {
  const url = new URL(WINDSOR_BASE)
  url.searchParams.set('api_key', WINDSOR_API_KEY)
  url.searchParams.set('connector', connector)
  url.searchParams.set('date_from', dateFrom)
  url.searchParams.set('date_to', dateTo)
  url.searchParams.set('fields', fields.join(','))
  url.searchParams.set('breakdown', 'ad')
  if (accountIds.length) url.searchParams.set('account_ids', accountIds.join(','))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Windsor ${res.status}`)
  const json = await res.json()
  return json.data ?? []
}

async function fetchMetrics(dateRange: DateRange): Promise<WindsorAPIResponse> {
  if (!WINDSOR_API_KEY) {
    return { data: MOCK_TRANSFORMED_DATA, source: 'demo', error: 'No API key' }
  }

  const { from, to } = getDateRange(dateRange)

  const fields = ['campaign_name','adset_name','ad_name','spend','impressions',
    'clicks','ctr','cpm','cpc','frequency','purchase','purchase_value',
    'cost_per_purchase','purchase_roas','reach']

  const [tiktokData, metaData] = await Promise.allSettled([
    fetchWindsorDirect('tiktok',
      ['7516620843737464849','7543688366240727057','7543689203469811729',
       '7516621966565064721','7516621199892299784','7555146360773754897','7555146426158825473'],
      from, to, fields),
    fetchWindsorDirect('facebook',
      ['act_1052690562464770','act_396896536150037','act_1228692581744330',
       'act_208998058902872','act_424317810627325','act_1386420186043993'],
      from, to, [...fields, 'video_play_actions']),
  ])

  const rawTiktok = tiktokData.status === 'fulfilled' ? tiktokData.value : []
  const rawMeta = metaData.status === 'fulfilled' ? metaData.value : []

  const res = await fetch('/api/windsor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dateFrom: from, dateTo: to, rawTiktok, rawMeta, bypassDns: true }),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function useMetrics(dateRange: DateRange = '7d') {
  const { data, error, isLoading } = useSWR<WindsorAPIResponse>(
    ['metrics', dateRange],
    () => fetchMetrics(dateRange),
    { refreshInterval: 5 * 60 * 1000, revalidateOnFocus: false },
  )

  return {
    metrics: data?.data ?? MOCK_TRANSFORMED_DATA,
    isLoading,
    isDemo: (data?.source === 'demo' || !!error) && !isLoading,
    isExpired: false,
    error: error ?? null,
    refetch: async () => {},
  }
}
