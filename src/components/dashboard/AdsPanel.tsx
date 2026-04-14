'use client'

import { MoreHorizontal } from 'lucide-react'
import type { Creative } from '@/types/metrics'
import { StatusPill } from '@/components/ui/StatusPill'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency, formatFrequency, formatRoas } from '@/lib/utils'

interface AdsPanelProps {
  creatives: Creative[]
  isLoading?: boolean
}

export function AdsPanel({ creatives, isLoading = false }: AdsPanelProps) {
  const top = creatives.slice(0, 8)
  const maxVentas = Math.max(...top.map((c) => c.ventas), 1)

  if (isLoading) {
    return (
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
          <Skeleton height={13} width={120} />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <Skeleton width={46} height={46} borderRadius={7} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton height={10} width="70%" />
              <Skeleton height={9} width="50%" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#000000" />
          <path
            d="M16.6 5.82C15.9 5.07 15.5 4.08 15.5 3H12.45V15.4C12.37 16.71 11.29 17.75 9.97 17.75C8.62 17.75 7.52 16.65 7.52 15.29C7.52 13.67 9.07 12.43 10.68 12.91V9.79C7.34 9.28 4.47 11.87 4.47 15.29C4.47 18.63 7.19 21.3 10.5 21.3C13.84 21.3 16.53 18.6 16.53 15.25V9.02C17.79 9.93 19.32 10.47 21 10.47V7.42C20.06 7.42 17.86 6.85 16.6 5.82Z"
            fill="white"
          />
        </svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
          Top Creativos
        </span>
        <div style={{ flex: 1 }} />
        {/* Toggles */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-page)',
            borderRadius: 20,
            padding: 2,
          }}
        >
          {['Ventas', 'Gasto'].map((m) => (
            <span
              key={m}
              style={{
                padding: '2px 8px',
                borderRadius: 18,
                fontSize: 10,
                fontWeight: 600,
                background: m === 'Ventas' ? 'white' : 'transparent',
                color: m === 'Ventas' ? 'var(--brand)' : 'var(--text-3)',
                cursor: 'pointer',
                boxShadow: m === 'Ventas' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {m}
            </span>
          ))}
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
            display: 'flex',
          }}
        >
          <MoreHorizontal size={13} />
        </button>
      </div>

      {/* Items */}
      {top.map((creative, idx) => (
        <AdItem
          key={creative.id}
          creative={creative}
          isLast={idx === top.length - 1}
          maxVentas={maxVentas}
        />
      ))}

      {creatives.length === 0 && (
        <div
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            color: 'var(--text-3)',
            fontSize: 12,
          }}
        >
          Sin datos disponibles
        </div>
      )}
    </div>
  )
}

function AdItem({
  creative,
  isLast,
  maxVentas,
}: {
  creative: Creative
  isLast: boolean
  maxVentas: number
}) {
  const barHeight = Math.max((creative.ventas / maxVentas) * 80, 6)

  return (
    <div
      style={{
        padding: '10px 14px',
        borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#FAFAFA'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 7,
          background: `linear-gradient(135deg, ${creative.thumbnailColor}CC 0%, ${creative.thumbnailColor} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          padding: 3,
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 8,
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '0.3px',
            lineHeight: 1.3,
          }}
        >
          {creative.code.split(' ').slice(0, 2).join('\n')}
        </span>
      </div>

      {/* Meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="mono"
          style={{
            color: 'var(--text-1)',
            marginBottom: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {creative.code}
        </div>
        <div
          style={{
            fontSize: 10,
            color: 'var(--text-3)',
            marginBottom: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {creative.product} · {creative.accountName}
        </div>
        {/* Metrics row */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, color: 'var(--text-2)' }}>
            <strong style={{ color: 'var(--text-1)' }}>{creative.ventas}</strong> ventas
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-2)' }}>
            CPA{' '}
            <strong style={{ color: creative.cpa <= creative.cpaObjective ? 'var(--success)' : 'var(--danger)' }}>
              {creative.cpa > 0 ? formatCurrency(creative.cpa) : '—'}
            </strong>
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-2)' }}>
            Frec. <strong>{formatFrequency(creative.frecuencia)}</strong>
          </span>
        </div>
      </div>

      {/* Status */}
      <StatusPill status={creative.status} size="sm" />

      {/* Vertical bar proportional to ventas */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 3,
          height: barHeight,
          background: creative.thumbnailColor,
          borderRadius: '3px 0 0 3px',
          opacity: 0.7,
        }}
      />
    </div>
  )
}
