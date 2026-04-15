import { NextRequest, NextResponse } from 'next/server'
import { transformWindsorData } from '@/lib/windsor'
import { MOCK_TRANSFORMED_DATA } from '@/lib/mock-data'
import type { WindsorAccountData, WindsorRawRow } from '@/types/windsor'
import { TIKTOK_AD_ACCOUNTS, META_AD_ACCOUNTS } from '@/lib/constants'

const WINDSOR_MCP = 'https://mcp.windsor.ai'

async function fetchViaWindsorMCP(
  apiKey: string,
  connector: string,
  accountIds: string[],
  dateFrom: string,
  dateTo: string,
  fields: string[],
): Promise<WindsorRawRow[]> {
  try {
    const res = await fetch(`${WINDSOR_MCP}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        connector,
        accounts: accountIds,
        date_from: dateFrom,
        date_to: dateTo,
        fields,
        breakdown: 'ad',
      }),
      cache: 'no-store',
    })

    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? json.rows ?? []
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dateFrom, dateTo, demo } = body

    if (demo || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      return NextResponse.json({ data: MOCK_TRANSFORMED_DATA, source: 'demo' })
    }

    const apiKey = process.env.WINDSOR_API_KEY ?? process.env.NEXT_PUBLIC_WINDSOR_API_KEY
    if (!apiKey || !dateFrom || !dateTo) {
      return NextResponse.json({ data: MOCK_TRANSFORMED_DATA, source: 'demo', error: 'No API key' })
    }

    const tiktokAccounts = Object.values(TIKTOK_AD_ACCOUNTS)
    const metaAccounts = Object.values(META_AD_ACCOUNTS)

    const fields = ['ad_name', 'spend', 'impressions', 'clicks', 'ctr',
      'cpm', 'cpc', 'frequency', 'purchase', 'purchase_value',
      'cost_per_purchase', 'purchase_roas', 'reach']

    const [tiktokRows, metaRows] = await Promise.all([
      fetchViaWindsorMCP(apiKey, 'tiktok', tiktokAccounts.map(a => a.id), dateFrom, dateTo, fields),
      fetchViaWindsorMCP(apiKey, 'facebook', metaAccounts.map(a => a.id), dateFrom, dateTo,
        [...fields, 'video_play_actions']),
    ])

    const tiktokByAccount: Record<string, WindsorRawRow[]> = {}
    for (const row of tiktokRows) {
      const id = String(row.account_id ?? '')
      if (!tiktokByAccount[id]) tiktokByAccount[id] = []
      tiktokByAccount[id].push(row)
    }

    const metaByAccount: Record<string, WindsorRawRow[]> = {}
    for (const row of metaRows) {
      const id = String(row.account_id ?? '')
      if (!metaByAccount[id]) metaByAccount[id] = []
      metaByAccount[id].push(row)
    }

    const allData: WindsorAccountData[] = [
      ...tiktokAccounts.map(a => ({
        accountId: a.id, accountName: a.name, platform: 'tiktok' as const,
        data: tiktokByAccount[a.id] ?? [], error: null,
      })),
      ...metaAccounts.map(a => ({
        accountId: a.id, accountName: a.name, platform: 'meta' as const,
        data: metaByAccount[a.id] ?? metaByAccount[a.id.replace('act_', '')] ?? [], error: null,
      })),
    ]

    const hasData = allData.some(a => a.data.length > 0)
    if (!hasData) {
      return NextResponse.json({ data: MOCK_TRANSFORMED_DATA, source: 'demo', error: 'No data from Windsor MCP' })
    }

    const transformed = transformWindsorData(allData)
    return NextResponse.json({ data: transformed, source: 'windsor' })

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
