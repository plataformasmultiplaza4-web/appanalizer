import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CHAT_SYSTEM = `Eres el asistente de análisis de EcomBuild Analytics para Ecom Build Academy. Tienes acceso a los datos de TikTok Ads y Meta Ads del usuario vía Windsor.ai.

Respondes en español, de forma directa y accionable. Conoces la metodología CT 1.0, el método 5-3-1, los umbrales de CPA por producto, y las señales de saturación creativa.

Productos activos: Batana (CPA obj S/35), TX Cream (S/35), Aura (S/30), Magnesium (S/28), PTL (S/40), Kreain (S/35), Dermabee (S/38), Nova (S/32), Deep Collagen (S/36), PTL Serum (S/38).

Editores: Ytalo (F1: TX Cream, Deep Collagen), Manuel (F1: Kreain, Aura, Magnesium, PTL), César (F2 part-time).

Cuando el usuario pregunta sobre creativos específicos, siempre menciona: frecuencia actual, CPA vs objetivo, y la acción recomendada según la metodología.

Cuando sugieres Hook Swaps, especifica: tipo (V1/V2/V3), qué cambiar, qué mantener igual, y editor asignado.`

export async function POST(req: NextRequest) {
  try {
    const { messages, contextData } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 503 },
      )
    }

    const systemWithContext = contextData
      ? `${CHAT_SYSTEM}\n\nCONTEXTO ACTUAL (datos de esta semana):\n${JSON.stringify(contextData, null, 2)}`
      : CHAT_SYSTEM

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemWithContext,
      messages,
    })

    const content = response.content[0]
    return NextResponse.json({
      message: content.type === 'text' ? content.text : '',
      usage: response.usage,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
