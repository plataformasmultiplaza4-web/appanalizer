'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus, Settings2, Filter, RefreshCw, Edit2 } from 'lucide-react'
import type { DateRange } from '@/types/dashboard'

const SOURCE_TABS = [
  { id: 'meta', label: 'Meta', icon: MetaIcon },
  { id: 'google', label: 'Google Ads', icon: GoogleIcon },
  { id: 'all', label: 'Todos', icon: AllIcon },
]

function MetaIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#1877F2" />
      <path d="M13.5 12.5H15.5L16 9.5H13.5V8C13.5 7.17 13.5 6.5 15 6.5H16V4C15.74 3.97 14.97 3.9 14.14 3.9C11.89 3.9 10.5 5.19 10.5 7.7V9.5H8V12.5H10.5V20H13.5V12.5Z" fill="white" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="white" stroke="#E5E7EB" />
      <path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.25 5 12C5 7.9 8.2 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12C2.03 17.05 6.16 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1Z" fill="#4285F4" />
    </svg>
  )
}

function AllIcon() {
  return (
    <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ color: 'white', fontSize: 7, fontWeight: 800, lineHeight: 1 }}>Σ</span>
    </div>
  )
}

interface TopbarProps {
  title?: string
  dateRange?: DateRange
  onDateChange?: (range: DateRange) => void
  onAnalyze?: () => void
  isAnalyzing?: boolean
  activeTab?: string
  onTabChange?: (id: string) => void
}

const DATE_RANGES: { label: string; value: DateRange }[] = [
  { label: 'Últimos 7 días', value: '7d' },
  { label: 'Últimas 2 semanas', value: '14d' },
  { label: 'Este mes', value: '30d' },
  { label: 'Últimos 3 meses', value: '90d' },
]

export function Topbar({
  title = 'Dashboard Principal',
  dateRange = '7d',
  onDateChange,
  onAnalyze,
  isAnalyzing = false,
  activeTab = 'meta',
  onTabChange,
}: TopbarProps) {
  const [showDateMenu, setShowDateMenu] = useState(false)
  const [activeSource, setActiveSource] = useState(activeTab)
  const menuRef = useRef<HTMLDivElement>(null)
  const activeDateLabel = DATE_RANGES.find((r) => r.value === dateRange)?.label ?? 'Últimos 7 días'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowDateMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSourceChange(id: string) {
    setActiveSource(id)
    onTabChange?.(id)
  }

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
          height: 'var(--topbar-h)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 16,
          gap: 8,
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--brand-blue)',
            letterSpacing: '-0.3px',
            whiteSpace: 'nowrap',
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
            padding: 4,
            borderRadius: 4,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)' }}
        >
          <Edit2 size={13} strokeWidth={1.8} />
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
            display: 'flex',
            padding: 4,
            borderRadius: 4,
          }}
        >
          <ChevronDown size={14} color="var(--text-3)" />
        </button>

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
              padding: '5px 11px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'none',
              cursor: 'pointer',
              fontSize: 12,
              color: 'var(--text-2)',
              whiteSpace: 'nowrap',
              fontWeight: 500,
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

        {/* Refresh */}
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          title="Actualizar análisis"
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'none',
            cursor: isAnalyzing ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isAnalyzing ? 'var(--brand)' : 'var(--text-2)',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!isAnalyzing) {
              e.currentTarget.style.borderColor = 'var(--brand)'
              e.currentTarget.style.color = 'var(--brand)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isAnalyzing) {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-2)'
            }
          }}
        >
          <RefreshCw size={13} style={{ animation: isAnalyzing ? 'spin 1s linear infinite' : 'none' }} />
        </button>

        {/* Add widget */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 12px',
            borderRadius: 6,
            border: 'none',
            background: 'var(--brand)',
            color: 'white',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-dark)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand)' }}
        >
          <Plus size={13} strokeWidth={2.5} />
          Agregar widget
        </button>
      </div>

      {/* Source tabs row */}
      <div
        style={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 16,
          gap: 2,
          borderTop: '1px solid var(--border-light)',
        }}
      >
        {SOURCE_TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSource === id
          return (
            <button
              key={id}
              onClick={() => handleSourceChange(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--brand-light)' : 'transparent',
                color: isActive ? 'var(--brand)' : 'var(--text-2)',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--bg-page)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <Icon />
              {label}
            </button>
          )
        })}

        <button
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '1px dashed var(--border)',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 2,
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <Plus size={11} color="var(--text-3)" />
        </button>

        <div style={{ flex: 1 }} />

        {/* Filter button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
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
      </div>
    </div>
  )
}

// Spin keyframe for the refresh button
const spinStyle = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = spinStyle
  document.head.appendChild(style)
}
