'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { BudgetTracker } from '@/components/alerts/BudgetTracker'
import { FrequencyAlerts } from '@/components/alerts/FrequencyAlerts'
import { useMetrics } from '@/hooks/useMetrics'
import type { DateRange } from '@/types/dashboard'

export default function AlertsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('7d')
  const { metrics, isLoading } = useMetrics(dateRange)

  const creatives = metrics?.creatives ?? []
  const accounts = metrics?.accounts ?? []

  // Summary counts
  const criticalCount = creatives.filter((c) => c.frecuencia >= 3.0).length
  const pausarCount = creatives.filter((c) => c.status === 'PAUSAR').length
  const hookSwapCount = creatives.filter((c) => c.status === 'HOOK_SWAP').length

  return (
    <>
      <Topbar
        title="Alertas y Saturación"
        dateRange={dateRange}
        onDateChange={setDateRange}
      />
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px 20px',
          background: 'var(--bg-page)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Summary pills */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Frecuencia crítica', count: criticalCount, color: 'var(--danger)' },
            { label: 'Pausar urgente', count: pausarCount, color: 'var(--danger)' },
            { label: 'Hook Swaps necesarios', count: hookSwapCount, color: 'var(--warning)' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: item.count > 0 ? item.color : 'var(--success)',
                }}
              >
                {item.count}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
            alignItems: 'start',
          }}
        >
          <BudgetTracker accounts={accounts} />
          <FrequencyAlerts creatives={creatives} />
        </div>
      </main>
    </>
  )
}
