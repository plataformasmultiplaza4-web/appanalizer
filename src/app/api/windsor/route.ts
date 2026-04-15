import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { transformWindsorData } from '@/lib/windsor'
import { MOCK_TRANSFORMED_DATA } from '@/lib/mock-data'
import type { WindsorAccountData, WindsorRawRow } from '@/types/windsor'
import { TIKTOK_AD_ACCOUNTS, META_AD_ACCOUNTS } from '@/lib/constants'

const client = new Anthropic()

const WINDSOR_MCP_URL = 'https://mcp.windsor.ai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dateFrom, dateTo, demo } = body

    if (demo || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      return NextResponse.json({ data: MOCK_TRANSFORMED_DATA, source: 'demo' })
    }

    if (!dateFrom || !dateTo) {
      return NextResponse.json({ data: MOCK_TRANSFORMED_DATA, source: 'demo' })
    }

    const tiktokAccountIds = Object.values(TIKTOK_AD_ACCOUNTS).map(a => a.id)
    const metaAccountIds = Object.values(META_AD_ACCOUNTS).map(a => a.id)

    const fields = ['ad_name', 'account_id', 'spend', 'impressions', 'clicks',
      'ctr', 'cpm', 'frequency', 'purchase', 'purchase_value',
      'cost_per_purchase', 'reach']

    // Fetch TikTok data via Windsor MCP
    const tiktokResponse = await client.beta.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 8000,
      mcp_servers: [{ type: 'url', url: WINDSOR_MCP_URL, name: 'windsor' }],
      messages: [{
        role: 'user',
        content: `Use windsor get_data tool with these exact params and return ONLY the raw JSON array of results, no explanation:
connector: "tiktok"
accounts: ${JSON.stringify(tiktokAccountIds)}
date_from: "${dateFrom}"
date_to: "${dateTo}"
fields: ${JSON.stringify(fields)}
Return only the JSON array.`
      }],
      betas: ['mcp-client-2025-04-04'],
    })

    // Fetch Meta data via Windsor MCP
    const metaResponse = await client.beta.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 8000,
      mcp_servers: [{ type: 'url', url: WINDSOR_MCP_URL, name: 'windsor' }],
      messages: [{
        role: 'user',
        content: `Use windsor get_data tool with these exact params and return ONLY the raw JSON array of results, no explanation:
connector: "facebook"
accounts: ${JSON.stringify(metaAccountIds)}
date_from: "${dateFrom}"
date_to: "${dateTo}"
fields: ${JSON.stringify([...fields, 'video_play_actions'])}
Return only the JSON array.`
      }],
      betas: ['mcp-client-2025-04-04'],
    })

    // Parse responses
    const parseTool = (response: Anthropic.Message): WindsorRawRow[] => {
      try {
        const text = response.content
          .filter(b => b.type === 'text')
          .map(b => (b as {type: 'text', text: string}).text)
          .join('')
        const match = text.match(/\[[\s\S]*\]/)
        if (!match) return []
        return JSON.parse(match[0])
      } catch { return [] }
    }

    const tiktokRows = parseTool(tiktokResponse)
    const metaRows = parseTool(metaResponse)

    const tiktokAccounts = Object.values(TIKTOK_AD_ACCOUNTS)
    const metaAccounts = Object.values(META_AD_ACCOUNTS)

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
      return NextResponse.json({ data: MOCK_TRANSFORMED_DATA, source: 'demo', error: 'No data' })
    }

    const transformed = transformWindsorData(allData)
    return NextResponse.json({ data: transformed, source: 'windsor' })

  } catch (err) {
    console.error('Windsor route error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
