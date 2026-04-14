'use client'

import { Topbar } from '@/components/layout/Topbar'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { useMetrics } from '@/hooks/useMetrics'

export default function ChatPage() {
  const { metrics } = useMetrics('7d')

  return (
    <>
      <Topbar title="Chat con IA" />
      <main
        style={{
          flex: 1,
          overflow: 'hidden',
          padding: '16px 20px',
          background: 'var(--bg-page)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 860,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <ChatInterface contextData={metrics} />
      </main>
    </>
  )
}
