'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, RefreshCw } from 'lucide-react'
import type { ChatMessage } from '@/types/metrics'
import type { TransformedData } from '@/types/metrics'

interface ChatInterfaceProps {
  contextData?: TransformedData | null
}

const SUGGESTED_QUESTIONS = [
  '¿Qué creativos debo pausar esta semana?',
  '¿Cuáles son mis winners para escalar?',
  '¿Qué Hook Swaps son urgentes?',
  '¿Cuál es el brief para Ytalo esta semana?',
  'Analiza el CPA de Batana vs el objetivo',
]

export function ChatInterface({ contextData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '¡Hola! Soy tu asistente de EcomBuild Analizer Metrics. Analizo tus datos de TikTok Ads aplicando la metodología CT 1.0. ¿En qué te puedo ayudar hoy?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return

    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
          contextData: contextData
            ? {
                kpis: contextData.kpis,
                creativosTop: contextData.creatives.slice(0, 10),
              }
            : null,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              data.error.includes('ANTHROPIC_API_KEY')
                ? 'Para usar el chat necesitas configurar la variable ANTHROPIC_API_KEY en tu archivo .env.local.'
                : `Error: ${data.error}`,
            timestamp: new Date(),
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.message, timestamp: new Date() },
        ])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error de conexión. Por favor intenta nuevamente.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: 'var(--brand-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={14} color="var(--brand)" />
        </div>
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
            Asistente IA
          </span>
          <span
            style={{
              fontSize: 10,
              color: 'var(--success)',
              marginLeft: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--success)',
                display: 'inline-block',
              }}
            />
            Claude AI
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setMessages([messages[0]])}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'none',
            cursor: 'pointer',
            fontSize: 11,
            color: 'var(--text-3)',
          }}
        >
          <RefreshCw size={10} />
          Nueva conversación
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--brand-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={13} color="var(--brand)" />
            </div>
            <div
              style={{
                background: 'var(--bg-page)',
                border: '1px solid var(--border)',
                borderRadius: '0 10px 10px 10px',
                padding: '10px 14px',
                display: 'flex',
                gap: 4,
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'var(--brand)',
                    animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
          }}
        >
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                padding: '4px 10px',
                borderRadius: 20,
                border: '1px solid var(--border)',
                background: 'none',
                cursor: 'pointer',
                fontSize: 11,
                color: 'var(--text-2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--brand-light)'
                e.currentTarget.style.borderColor = 'var(--brand)'
                e.currentTarget.style.color = 'var(--brand)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-2)'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pregunta sobre tus creativos, CPA, frecuencia..."
          rows={1}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg-page)',
            fontSize: 13,
            color: 'var(--text-1)',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            maxHeight: 100,
            overflowY: 'auto',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--brand)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: 'none',
            background: !input.trim() || isLoading ? 'var(--border)' : 'var(--brand)',
            cursor: !input.trim() || isLoading ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.15s',
          }}
        >
          <Send size={15} color="white" />
        </button>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: isUser
            ? 'linear-gradient(135deg, var(--brand) 0%, var(--brand-mid) 100%)'
            : 'var(--brand-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isUser ? (
          <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>LG</span>
        ) : (
          <Sparkles size={13} color="var(--brand)" />
        )}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: '80%',
          padding: '10px 14px',
          borderRadius: isUser ? '10px 0 10px 10px' : '0 10px 10px 10px',
          background: isUser ? 'var(--brand)' : 'var(--bg-page)',
          border: isUser ? 'none' : '1px solid var(--border)',
          fontSize: 13,
          lineHeight: 1.6,
          color: isUser ? 'white' : 'var(--text-1)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.content}
        {message.timestamp && (
          <div
            style={{
              fontSize: 10,
              color: isUser ? 'rgba(255,255,255,0.6)' : 'var(--text-3)',
              marginTop: 4,
              textAlign: isUser ? 'right' : 'left',
            }}
          >
            {message.timestamp.toLocaleTimeString('es-PE', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </div>
  )
}
