'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { OverviewTable } from '@/components/overview/OverviewTable'
import { useMetrics } from '@/hooks/useMetrics'
import type { DateRange } from '@/types/dashboard'

export default function OverviewPage() {
  const [dateRange, setDateRange] = useState<DateRange>('7d')
  const { metrics, isLoading } = useMetrics(dateRange)

  return (
    <>
      <Topbar
        title="Overview — Todas las Cuentas"
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
        <OverviewTable
          accounts={metrics?.accounts ?? []}
          isLoading={isLoading}
        />
      </main>
    </>
  )
}
