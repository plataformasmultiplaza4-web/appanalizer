'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { KPIGrid } from '@/components/dashboard/KPIGrid'
import { CreativesTable } from '@/components/dashboard/CreativesTable'
import { DayBarChart } from '@/components/dashboard/DayBarChart'
import { AdsPanel } from '@/components/dashboard/AdsPanel'
import { AISummary } from '@/components/dashboard/AISummary'
import { SourcesGrid } from '@/components/alerts/SourcesGrid'
import { useMetrics } from '@/hooks/useMetrics'
import { useAISummary } from '@/hooks/useAISummary'
import type { DateRange } from '@/types/dashboard'

const DEMO_BANNER_STYLE: React.CSSProperties = {
  padding: '6px 16px',
  background: 'linear-gradient(90deg, #EEF2FF 0%, #E0E7FF 100%)',
  borderBottom: '1px solid #C7D2FE',
  fontSize: 11,
  color: '#4338CA',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexShrink: 0,
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>('7d')
  const [activeTab, setActiveTab] = useState('dash1')

  const { metrics, isLoading, isDemo, isExpired } = useMetrics(dateRange)
  const { summary, isLoading: isAnalyzing, generatedAt, analyze } = useAISummary()

  async function handleAnalyze() {
    if (!metrics?.creatives) return
    await analyze(metrics.creatives, dateRange)
  }

  return (
    <>
      <Topbar
        title="Dashboard Principal"
        dateRange={dateRange}
        onDateChange={setDateRange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
      />

      {/* Demo / expired banner */}
      {isDemo && (
        <div style={DEMO_BANNER_STYLE}>
          <span>📊</span>
          {isExpired
            ? 'Licencia Windsor expirada — mostrando datos demo. Renueva en windsor.ai/pricing y agrega WINDSOR_API_KEY al .env.local'
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
        {/* KPI Grid */}
        <KPIGrid
          kpis={metrics?.kpis ?? null}
          isLoading={isLoading}
        />

        {/* Main content grid: Table + Side panel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: 14,
            alignItems: 'start',
          }}
        >
          {/* Left: Creatives Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <CreativesTable
              creatives={metrics?.creatives ?? []}
              isLoading={isLoading}
            />
            <DayBarChart
              data={metrics?.dailyData ?? []}
              isLoading={isLoading}
            />
          </div>

          {/* Right: Ads Panel */}
          <AdsPanel
            creatives={metrics?.creatives ?? []}
            isLoading={isLoading}
          />
        </div>

        {/* AI Summary — full width */}
        <AISummary
          summary={summary}
          isLoading={isAnalyzing}
          onRegenerate={handleAnalyze}
          generatedAt={generatedAt ?? undefined}
        />

        {/* Sources grid */}
        <SourcesGrid />
      </main>
    </>
  )
}
