'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Bell, Plus, UserCircle2, Sparkles } from 'lucide-react'
import type { DateRange } from '@/types/dashboard'

interface TopbarProps {
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

/** Returns a formatted date-range string like "Mar 15 2026 – Abr 13 2026" */
function formatDateLabel(range: DateRange): string {
  const today = new Date()
  const days = range === '7d' ? 7 : range === '14d' ? 14 : range === '30d' ? 30 : 90
  const from = new Date(today)
  from.setDate(today.getDate() - days + 1)

  const fmt = (d: Date) =>
    d.toLocaleDateString('es-PE', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(from)} — ${fmt(today)}`
}

export function Topbar({
  dateRange = '7d',
  onDateChange,
  onAnalyze,
  isAnalyzing = false,
}: TopbarProps) {
  const [showDateMenu, setShowDateMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
        gap: 12,
      }}
    >
      {/* ── Left: App logo + name ─────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <div
          style={{
            width: 26,
            height: 26,
            background: 'var(--brand)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 6px rgba(0,188,212,0.35)',
          }}
        >
          <span style={{ color: 'white', fontWeight: 800, fontSize: 12, letterSpacing: '-0.5px' }}>
            E
          </span>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text-1)',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.2px',
          }}
        >
          EcomBuild Analytics
        </span>
      </div>

      {/* ── Center: Teal CTA pill ──────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 20px',
            borderRadius: 24,
            border: 'none',
            background: isAnalyzing ? 'var(--brand-mid)' : 'var(--brand)',
            cursor: isAnalyzing ? 'default' : 'pointer',
            fontSize: 12,
            fontWeight: 600,
            color: 'white',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,188,212,0.30)',
            transition: 'background 0.15s, box-shadow 0.15s',
            letterSpacing: '0.1px',
          }}
          onMouseEnter={(e) => {
            if (!isAnalyzing) {
              e.currentTarget.style.background = 'var(--brand-dark)'
              e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,188,212,0.40)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isAnalyzing) {
              e.currentTarget.style.background = 'var(--brand)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,188,212,0.30)'
            }
          }}
        >
          <Sparkles size={12} />
          {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
        </button>
      </div>

      {/* ── Right: date range, bell, add account, avatar ──────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

        {/* Date range pill */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDateMenu(!showDateMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'none',
              cursor: 'pointer',
              fontSize: 11,
              color: 'var(--text-2)',
              whiteSpace: 'nowrap',
            }}
          >
            {formatDateLabel(dateRange)}
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
                minWidth: 190,
              }}
            >
              {DATE_RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => { onDateChange?.(r.value); setShowDateMenu(false) }}
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

        {/* Bell */}
        <button
          title="Notificaciones"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-light)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
        >
          <Bell size={15} color="var(--text-2)" strokeWidth={1.8} />
        </button>

        {/* + Add account */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 12px',
            borderRadius: 8,
            border: '1.5px solid var(--brand)',
            background: 'none',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--brand)',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-light)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
        >
          <Plus size={12} strokeWidth={2.5} />
          Agregar cuenta
        </button>

        {/* Avatar dropdown */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 8px 4px 4px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'none',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-light)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00BCD4 0%, #26C6DA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ color: 'white', fontWeight: 700, fontSize: 8 }}>LG</span>
          </div>
          <span>LG</span>
          <ChevronDown size={11} color="var(--text-3)" />
        </button>
      </div>
    </header>
  )
}
