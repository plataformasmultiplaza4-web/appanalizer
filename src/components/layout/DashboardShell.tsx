'use client'

import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import type { DateRange } from '@/types/dashboard'

interface DashboardShellProps {
  children: React.ReactNode
  title?: string
  dateRange?: DateRange
  onDateChange?: (range: DateRange) => void
  onAnalyze?: () => void
  isAnalyzing?: boolean
}

export function DashboardShell({
  children,
  title,
  dateRange,
  onDateChange,
  onAnalyze,
  isAnalyzing,
}: DashboardShellProps) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div
        style={{
          marginLeft: 'var(--sidebar-w)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <Topbar
          title={title}
          dateRange={dateRange}
          onDateChange={onDateChange}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing}
        />
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px 20px',
            background: 'var(--bg-page)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
