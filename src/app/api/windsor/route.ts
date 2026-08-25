import { NextRequest, NextResponse } from 'next/server'
import {
  fetchAllTikTokAccounts,
  fetchAllMetaAccounts,
  transformWindsorData,
} from '@/lib/windsor'
import { MOCK_TRANSFORMED_DATA } from '@/lib/mock-data'
import {
  TIKTOK_AD_ACCOUNTS,
  META_AD_ACCOUNTS,
} from '@/lib/constants'
import type { WindsorAccountData } from '@/types/windsor'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dateFrom, dateTo, demo, platforms, bypassDns, rawTiktok, rawMeta } = body

    // Bypass mode: browser fetched raw Windsor data directly, we just transform it
    if (bypassDns && (rawTiktok || rawMeta)) {
      const accountsData: WindsorAccountData[] = []

      if (rawTiktok && Array.isArray(rawTiktok)) {
        const tiktokAccounts = Object.values(TIKTOK_AD_ACCOUNTS)
        const byAccount: Record<string, unknown[]> = {}
        for (const row of rawTiktok) {
          const accId = String((row as Record<string, unknown>).account_id ?? '')
          if (!byAccount[accId]) byAccount[accId] = []
          byAccount[accId].push(row)
        }
        for (const account of tiktokAccounts) {
          accountsData.push({
            accountId: account.id,
            accountName: account.name,
            platform: 'tiktok',
            data: (byAccount[account.id] ?? []) as never,
            error: null,
          })
        }
      }

      if (rawMeta && Array.isArray(rawMeta)) {
        const metaAccounts = Object.values(META_AD_ACCOUNTS)
        const byAccount: Record<string, unknown[]> = {}
        for (const row of rawMeta) {
          const accId = String((row as Record<string, unknown>).account_id ?? '')
          if (!byAccount[accId]) byAccount[accId] = []
          byAccount[accId].push(row)
        }
        for (const account of metaAccounts) {
          accountsData.push({
            accountId: account.id,
            accountName: account.name,
            platform: 'meta',
            data: (byAccount[account.id] ?? []) as never,
            error: null,
          })
        }
      }

      const transformed = transformWindsorData(accountsData)
      return NextResponse.json({ data: transformed, source: 'windsor' })
    }

    // Accept both WINDSOR_API_KEY and NEXT_PUBLIC_WINDSOR_API_KEY
    const apiKey = process.env.WINDSOR_API_KEY ?? process.env.NEXT_PUBLIC_WINDSOR_API_KEY
    if (apiKey && !process.env.WINDSOR_API_KEY) {
      process.env.WINDSOR_API_KEY = apiKey
    }

    // Demo mode: return mock data
    if (demo || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      return NextResponse.json({ data: MOCK_TRANSFORMED_DATA, source: 'demo' })
    }

    // No API key → demo mode
    if (!apiKey) {
      return NextResponse.json({ data: MOCK_TRANSFORMED_DATA, source: 'demo', error: 'WINDSOR_API_KEY not configured' })
    }

    if (!dateFrom || !dateTo) {
      return NextResponse.json({ error: 'dateFrom and dateTo required' }, { status: 400 })
    }

    // Determine which platforms to fetch (default: both)
    const fetchTikTok = !platforms || platforms.includes('tiktok')
    const fetchMeta = !platforms || platforms.includes('meta')

    // Fetch TikTok and Meta in parallel
    const [tiktokData, metaData] = await Promise.all([
      fetchTikTok ? fetchAllTikTokAccounts(dateFrom, dateTo) : Promise.resolve([]),
      fetchMeta ? fetchAllMetaAccounts(dateFrom, dateTo) : Promise.resolve([]),
    ])

    const allAccountsData = [...tiktokData, ...metaData]

    const errors = allAccountsData.filter((a) => a.error).map((a) => a.error)
    const hasData = allAccountsData.some((a) => a.data.length > 0)

    if (!hasData && errors.length > 0) {
      return NextResponse.json(
        {
          error: errors[0],
          hint: errors[0]?.includes('expired')
            ? 'Windsor license expired. Activate at windsor.ai/pricing or enable NEXT_PUBLIC_DEMO_MODE=true'
            : 'Check your WINDSOR_API_KEY environment variable.',
        },
        { status: 402 },
      )
    }

    const transformed = transformWindsorData(allAccountsData)
    return NextResponse.json({ data: transformed, source: 'windsor' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
