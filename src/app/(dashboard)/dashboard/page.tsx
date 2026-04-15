'use client'

import { useState } from 'react'
import { ChevronDown, MoreHorizontal, Plus } from 'lucide-react'
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

// ── Platform filter pills ─────────────────────────────────────────────────

type PlatformFilter = 'all' | 'meta' | 'tiktok'

const PLATFORM_PILLS: { id: PlatformFilter; label: string; icon?: React.ReactNode }[] = [
  { id: 'all', label: 'Todas' },
  {
    id: 'meta',
    label: 'Meta',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1877F2" />
        <path d="M13.5 12.5H15.5L16 9.5H13.5V8C13.5 7.17 13.5 6.5 15 6.5H16V4C15.74 3.97 14.97 3.9 14.14 3.9C11.89 3.9 10.5 5.19 10.5 7.7V9.5H8V12.5H10.5V20H13.5V12.5Z" fill="white" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#000" />
        <path d="M16.6 5.82C15.9 5.07 15.5 4.08 15.5 3H12.45V15.4C12.37 16.71 11.29 17.75 9.97 17.75C8.62 17.75 7.52 16.65 7.52 15.29C7.52 13.67 9.07 12.43 10.68 12.91V9.79C7.34 9.28 4.47 11.87 4.47 15.29C4.47 18.63 7.19 21.3 10.5 21.3C13.84 21.3 16.53 18.6 16.53 15.25V9.02C17.79 9.93 19.32 10.47 21 10.47V7.42C20.06 7.42 17.86 6.85 16.6 5.82Z" fill="white" />
      </svg>
    ),
  },
]

// ── Demo banner ───────────────────────────────────────────────────────────

function DemoBanner({ isExpired }: { isExpired: boolean }) {
  return (
    <div
      style={{
        padding: '6px 20px',
        background: 'linear-gradient(90deg, #E0F7FA 0%, #B2EBF2 100%)',
        borderBottom: '1px solid #80DEEA',
        fontSize: 11,
        color: '#006064',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0,
      }}
    >
      <span>📊</span>
      {isExpired
        ? 'Licencia Windsor expirada — datos demo. Renueva en windsor.ai/pricing y agrega WINDSOR_API_KEY al .env.local'
        : 'Modo demo — datos de ejemplo. Configura WINDSOR_API_KEY en .env.local para datos reales.'}
    </div>
  )
}

// ── Dashboard content header ─────────────────────────────────────────────

function DashboardHeader({
  title,
  platform,
  onPlatformChange,
}: {
  title: string
  platform: PlatformFilter
  onPlatformChange: (p: PlatformFilter) => void
}) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      {/* Title row */}
      <div
        style={{
          padding: '14px 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* Table icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--brand)" strokeWidth="1.8" />
          <path d="M3 9h18M9 9v12" stroke="var(--brand)" strokeWidth="1.8" />
        </svg>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-1)',
            letterSpacing: '-0.3px',
          }}
        >
          {title}
        </h1>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
            display: 'flex',
            padding: 2,
          }}
        >
          <MoreHorizontal size={16} />
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
            display: 'flex',
            padding: 2,
          }}
        >
          <ChevronDown size={16} />
        </button>

        <div style={{ flex: 1 }} />

        {/* Add widget */}
        <button
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            border: '1px solid var(--border)',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-light)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
        >
          <Plus size={14} color="var(--text-3)" />
        </button>
      </div>

      {/* Sub-row: tab + platform pills */}
      <div
        style={{
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 8,
        }}
      >
        {/* Active tab */}
        <div
          style={{
            padding: '6px 0',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--brand)',
            borderBottom: '2px solid var(--brand)',
            marginRight: 4,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Dashboard Principal
        </div>

        <button
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Plus size={12} color="var(--text-3)" />
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Platform filter pills */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {PLATFORM_PILLS.map((pill) => (
            <button
              key={pill.id}
              onClick={() => onPlatformChange(pill.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 6,
                border: `1px solid ${platform === pill.id ? 'var(--brand)' : 'var(--border)'}`,
                background: platform === pill.id ? 'var(--brand-light)' : 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: platform === pill.id ? 600 : 400,
                color: platform === pill.id ? 'var(--brand)' : 'var(--text-2)',
                transition: 'all 0.15s',
                marginBottom: 6,
              }}
            >
              {pill.icon}
              {pill.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>('7d')
  const [platform, setPlatform] = useState<PlatformFilter>('all')

  const { metrics, isLoading, isDemo, isExpired } = useMetrics(dateRange)
  const { summary, isLoading: isAnalyzing, generatedAt, analyze } = useAISummary()

  async function handleAnalyze() {
    if (!metrics?.creatives) return
    await analyze(metrics.creatives, dateRange)
  }

  // Filter creatives by platform
  const filteredCreatives =
    platform === 'all'
      ? (metrics?.creatives ?? [])
      : (metrics?.creatives ?? []).filter((c) => c.platform === platform)

  return (
    <>
      <Topbar
        dateRange={dateRange}
        onDateChange={setDateRange}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
      />

      {isDemo && <DemoBanner isExpired={!!isExpired} />}

      <DashboardHeader
        title="EcomBuild Dashboard"
        platform={platform}
        onPlatformChange={setPlatform}
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
        {/* KPI Grid */}
        <KPIGrid
          kpis={metrics?.kpis ?? null}
          isLoading={isLoading}
          platform={platform}
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
          {/* Left: Creatives Table + Day Bar Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <CreativesTable
              creatives={filteredCreatives}
              isLoading={isLoading}
            />
            <DayBarChart
              data={metrics?.dailyData ?? []}
              isLoading={isLoading}
            />
          </div>

          {/* Right: Ads Panel */}
          <AdsPanel
            creatives={filteredCreatives}
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
