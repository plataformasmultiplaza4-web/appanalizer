import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT_PM, buildUserPrompt } from '@/lib/prompts/pm-diagnostico'
import { MOCK_AI_SUMMARY } from '@/lib/mock-data'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { metricsData, dateRange, demo } = await req.json()

    // Demo mode: return mock summary
    if (demo || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      return NextResponse.json({ summary: MOCK_AI_SUMMARY, source: 'demo' })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 503 },
      )
    }

    if (!metricsData || !dateRange) {
      return NextResponse.json(
        { error: 'metricsData and dateRange required' },
        { status: 400 },
      )
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT_PM,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(metricsData, dateRange),
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Extract JSON — Claude may add backticks or extra text
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Claude response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json({ summary: parsed, usage: message.usage, source: 'claude' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
