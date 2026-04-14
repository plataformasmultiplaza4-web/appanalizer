'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus, Download, Sparkles, Filter } from 'lucide-react'
import type { DateRange } from '@/types/dashboard'

interface Tab {
  id: string
  label: string
}

interface TopbarProps {
  title?: string
  tabs?: Tab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  dateRange?: DateRange
  onDateChange?: (range: DateRange) => void
  onAnalyze?: () => void
  isAnalyzing?: boolean
}

const DATE_RANGES: { label: string; value: DateRange }[] = [
  { label: 'Últimos 7 días', value: '7d' },
  { label: 'Últimas 2 semanas', value: '14d' },
  { label: 'Este mes', value: '30d' },
  { label: 'Últimos 3 meses', value: '90d' },
]

export function Topbar({
  title = 'Dashboard Principal',
  tabs = [
    { id: 'dash1', label: 'Dashboard 1' },
    { id: 'dash2', label: 'Dashboard 2' },
  ],
  activeTab = 'dash1',
  onTabChange,
  dateRange = '7d',
  onDateChange,
  onAnalyze,
  isAnalyzing = false,
}: TopbarProps) {
  const [showDateMenu, setShowDateMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const activeDateLabel = DATE_RANGES.find((r) => r.value === dateRange)?.label ?? 'Últimos 7 días'

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowDateMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header
      style={{
        height: 'var(--topbar-h)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        gap: 6,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Dashboard title */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 6px',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-1)',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
        <ChevronDown size={13} color="var(--text-3)" />
      </button>

      {/* Divider */}
      <div
        style={{ width: 1, height: 18, background: 'var(--border)', flexShrink: 0 }}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: activeTab === tab.id ? 600 : 400,
              background: activeTab === tab.id ? 'var(--brand-light)' : 'transparent',
              color: activeTab === tab.id ? 'var(--brand)' : 'var(--text-2)',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
        <button
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Plus size={13} color="var(--text-3)" />
        </button>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Date range picker */}
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setShowDateMenu(!showDateMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 20,
            border: '1px solid var(--border)',
            background: 'none',
            cursor: 'pointer',
            fontSize: 12,
            color: 'var(--text-2)',
            whiteSpace: 'nowrap',
          }}
        >
          {activeDateLabel}
          <ChevronDown size={11} color="var(--text-3)" />
        </button>

        {showDateMenu && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              zIndex: 100,
              minWidth: 170,
            }}
          >
            {DATE_RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  onDateChange?.(r.value)
                  setShowDateMenu(false)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 14px',
                  textAlign: 'left',
                  background: r.value === dateRange ? 'var(--brand-light)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: r.value === dateRange ? 'var(--brand)' : 'var(--text-1)',
                  fontWeight: r.value === dateRange ? 600 : 400,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 10px',
          borderRadius: 6,
          border: '1px solid var(--border)',
          background: 'none',
          cursor: 'pointer',
          fontSize: 12,
          color: 'var(--text-2)',
          whiteSpace: 'nowrap',
        }}
      >
        <Filter size={12} />
        Filtros
      </button>

      {/* Export */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 10px',
          borderRadius: 6,
          border: '1px solid var(--border)',
          background: 'none',
          cursor: 'pointer',
          fontSize: 12,
          color: 'var(--text-2)',
          whiteSpace: 'nowrap',
        }}
      >
        <Download size={12} />
        Exportar
      </button>

      {/* Analyze with AI */}
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 14px',
          borderRadius: 6,
          border: 'none',
          background: isAnalyzing ? 'var(--brand-mid)' : 'var(--brand)',
          cursor: isAnalyzing ? 'default' : 'pointer',
          fontSize: 12,
          fontWeight: 600,
          color: 'white',
          whiteSpace: 'nowrap',
          transition: 'background 0.15s',
        }}
      >
        <Sparkles size={12} />
        {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
      </button>
    </header>
  )
}
