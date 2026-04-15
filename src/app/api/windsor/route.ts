import { NextRequest, NextResponse } from 'next/server'
import { transformWindsorData } from '@/lib/windsor'
import { MOCK_TRANSFORMED_DATA } from '@/lib/mock-data'
import type { WindsorAccountData, WindsorRawRow } from '@/types/windsor'
import {
  TIKTOK_AD_ACCOUNTS,
  META_AD_ACCOUNTS,
} from '@/lib/constants'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dateFrom, dateTo, demo, rawTiktok, rawMeta, bypassDns } = body

    // Demo mode
    if (demo || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      return NextResponse.json({ data: MOCK_TRANSFORMED_DATA, source: 'demo' })
    }

    // Bypass DNS mode: browser already fetched raw data, server just transforms
    if (bypassDns && (rawTiktok || rawMeta)) {
      const tiktokAccounts = Object.values(TIKTOK_AD_ACCOUNTS)
      const metaAccounts = Object.values(META_AD_ACCOUNTS)

      const rawTiktokRows = (rawTiktok ?? []) as WindsorRawRow[]
      const rawMetaRows = (rawMeta ?? []) as WindsorRawRow[]

      const tiktokByAccount: Record<string, WindsorRawRow[]> = {}
      for (const row of rawTiktokRows) {
        const id = String(row.account_id ?? '')
        if (!tiktokByAccount[id]) tiktokByAccount[id] = []
        tiktokByAccount[id].push(row)
      }

      const metaByAccount: Record<string, WindsorRawRow[]> = {}
      for (const row of rawMetaRows) {
        const id = String(row.account_id ?? '')
        if (!metaByAccount[id]) metaByAccount[id] = []
        metaByAccount[id].push(row)
      }

      const allData: WindsorAccountData[] = [
        ...tiktokAccounts.map((a) => ({
          accountId: a.id,
          accountName: a.name,
          platform: 'tiktok' as const,
          data: tiktokByAccount[a.id] ?? [],
          error: null,
        })),
        ...metaAccounts.map((a) => ({
          accountId: a.id,
          accountName: a.name,
          platform: 'meta' as const,
          data: metaByAccount[a.id] ?? metaByAccount[a.id.replace('act_', '')] ?? [],
          error: null,
        })),
      ]

      const transformed = transformWindsorData(allData)
      return NextResponse.json({ data: transformed, source: 'windsor' })
    }

    // No API key → demo mode
    const apiKey = process.env.WINDSOR_API_KEY ?? process.env.NEXT_PUBLIC_WINDSOR_API_KEY
    if (!apiKey) {
      return NextResponse.json({ data: MOCK_TRANSFORMED_DATA, source: 'demo', error: 'WINDSOR_API_KEY not configured' })
    }

    if (!dateFrom || !dateTo) {
      return NextResponse.json({ error: 'dateFrom and dateTo required' }, { status: 400 })
    }

    // Server DNS is blocked — tell client to use bypass mode
    return NextResponse.json({ error: 'DNS_BLOCKED', apiKey }, { status: 503 })

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
