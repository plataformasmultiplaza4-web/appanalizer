'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { KPIGrid } from '@/components/dashboard/KPIGrid'
import { CreativesTable } from '@/components/dashboard/CreativesTable'
import { DayBarChart } from '@/components/dashboard/DayBarChart'
import { AdsPanel } from '@/components/dashboard/AdsPanel'
import { AISummary } from '@/components/dashboard/AISummary'
import { useMetrics } from '@/hooks/useMetrics'
import { useAISummary } from '@/hooks/useAISummary'
import type { DateRange } from '@/types/dashboard'

const DEMO_BANNER_STYLE: React.CSSProperties = {
  padding: '6px 20px',
  background: 'linear-gradient(90deg, var(--brand-light) 0%, #d0f4f6 100%)',
  borderBottom: '1px solid rgba(0,190,200,0.2)',
  fontSize: 11,
  color: 'var(--brand-dark)',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexShrink: 0,
  fontWeight: 500,
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [activeSource, setActiveSource] = useState('meta')

  const { metrics, isLoading, isDemo, isExpired } = useMetrics(dateRange)
  const { summary, isLoading: isAnalyzing, generatedAt, analyze } = useAISummary()

  async function handleAnalyze() {
    if (!metrics?.creatives) return
    await analyze(metrics.creatives, dateRange)
  }

  return (
    <>
      <Topbar
        title="Demo Lead Generation"
        dateRange={dateRange}
        onDateChange={setDateRange}
        activeTab={activeSource}
        onTabChange={setActiveSource}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
      />

      {/* Demo / expired banner */}
      {isDemo && (
        <div style={DEMO_BANNER_STYLE}>
          <span>📊</span>
          {isExpired
            ? 'Licencia Windsor expirada — mostrando datos demo. Configura WINDSOR_API_KEY en .env.local para datos reales.'
            : 'Modo demo activo — datos de ejemplo. Configura WINDSOR_API_KEY en .env.local para datos reales.'}
        </div>
      )}

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
        {/* KPI strip */}
        <KPIGrid
          kpis={metrics?.kpis ?? null}
          isLoading={isLoading}
        />

        {/* Conversions chart */}
        <DayBarChart
          data={metrics?.dailyData ?? []}
          isLoading={isLoading}
        />

        {/* Main content grid: Table + Side panel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 290px',
            gap: 14,
            alignItems: 'start',
          }}
        >
          <CreativesTable
            creatives={metrics?.creatives ?? []}
            isLoading={isLoading}
          />
          <AdsPanel
            creatives={metrics?.creatives ?? []}
            isLoading={isLoading}
          />
        </div>

        {/* AI Summary */}
        <AISummary
          summary={summary}
          isLoading={isAnalyzing}
          onRegenerate={handleAnalyze}
          generatedAt={generatedAt ?? undefined}
        />
      </main>
    </>
  )
}
