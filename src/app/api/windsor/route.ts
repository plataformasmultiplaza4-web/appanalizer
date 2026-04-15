import { NextRequest, NextResponse } from 'next/server'
import {
  fetchAllTikTokAccounts,
  fetchAllMetaAccounts,
  transformWindsorData,
} from '@/lib/windsor'
import { MOCK_TRANSFORMED_DATA } from '@/lib/mock-data'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dateFrom, dateTo, demo, platforms } = body

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

    // Check errors: only fail hard if we got no data at all and have errors
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
