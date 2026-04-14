'use client'

import { useState } from 'react'
import { MoreHorizontal, GripVertical } from 'lucide-react'
import type { Creative } from '@/types/metrics'
import { StatusPill } from '@/components/ui/StatusPill'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  formatCurrency,
  formatRoas,
  formatFrequency,
  formatDelta,
  getCpaColor,
  getRoasColor,
  getFrecuenciaColor,
  formatNumber,
} from '@/lib/utils'

interface CreativesTableProps {
  creatives: Creative[]
  isLoading?: boolean
}

type SortKey = 'ventas' | 'cpa' | 'roas' | 'gasto' | 'frecuencia' | 'budgetPct'

function TableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  align = 'left',
}: {
  label: string
  sortKey?: SortKey
  currentSort?: SortKey
  onSort?: (key: SortKey) => void
  align?: 'left' | 'right' | 'center'
}) {
  const isActive = sortKey && currentSort === sortKey
  return (
    <th
      onClick={sortKey ? () => onSort?.(sortKey) : undefined}
      style={{
        padding: '8px 10px',
        textAlign: align,
        fontSize: 11,
        fontWeight: 600,
        color: isActive ? 'var(--brand)' : 'var(--text-3)',
        background: 'var(--bg-page)',
        borderBottom: '1px solid var(--border)',
        cursor: sortKey ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {label}
    </th>
  )
}

function PlatformBadge({ platform }: { platform: 'meta' | 'tiktok' | 'instagram' }) {
  if (platform === 'tiktok') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <rect width="24" height="24" rx="4" fill="#000000" />
        <path
          d="M16.6 5.82C15.9 5.07 15.5 4.08 15.5 3H12.45V15.4C12.37 16.71 11.29 17.75 9.97 17.75C8.62 17.75 7.52 16.65 7.52 15.29C7.52 13.67 9.07 12.43 10.68 12.91V9.79C7.34 9.28 4.47 11.87 4.47 15.29C4.47 18.63 7.19 21.3 10.5 21.3C13.84 21.3 16.53 18.6 16.53 15.25V9.02C17.79 9.93 19.32 10.47 21 10.47V7.42C20.06 7.42 17.86 6.85 16.6 5.82Z"
          fill="white"
        />
      </svg>
    )
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect width="24" height="24" rx="4" fill="#1877F2" />
      <path
        d="M13.5 12.5H15.5L16 9.5H13.5V8C13.5 7.17 13.5 6.5 15 6.5H16V4C15.74 3.97 14.97 3.9 14.14 3.9C11.89 3.9 10.5 5.19 10.5 7.7V9.5H8V12.5H10.5V20H13.5V12.5Z"
        fill="white"
      />
    </svg>
  )
}

export function CreativesTable({ creatives, isLoading = false }: CreativesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('ventas')
  const [metricView, setMetricView] = useState<'ventas' | 'gasto' | 'cpa'>('ventas')

  const sorted = [...creatives].sort((a, b) => {
    const aVal = a[sortKey] ?? 0
    const bVal = b[sortKey] ?? 0
    // CPA: sort ascending (lower = better)
    if (sortKey === 'cpa') return (aVal as number) - (bVal as number)
    return (bVal as number) - (aVal as number)
  })

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
        {/* Header skeleton */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <Skeleton height={14} width={120} />
          <div style={{ flex: 1 }} />
          <Skeleton height={26} width={180} borderRadius={20} />
        </div>
        {/* Rows skeleton */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <Skeleton height={10} width={100} />
            <Skeleton height={10} width={60} />
            <Skeleton height={10} width={50} />
            <Skeleton height={10} width={50} />
            <Skeleton height={16} width={70} borderRadius={20} />
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
      {/* Card header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#000000" />
          <path
            d="M16.6 5.82C15.9 5.07 15.5 4.08 15.5 3H12.45V15.4C12.37 16.71 11.29 17.75 9.97 17.75C8.62 17.75 7.52 16.65 7.52 15.29C7.52 13.67 9.07 12.43 10.68 12.91V9.79C7.34 9.28 4.47 11.87 4.47 15.29C4.47 18.63 7.19 21.3 10.5 21.3C13.84 21.3 16.53 18.6 16.53 15.25V9.02C17.79 9.93 19.32 10.47 21 10.47V7.42C20.06 7.42 17.86 6.85 16.6 5.82Z"
            fill="white"
          />
        </svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
          Creativos Activos
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>— últimos 7 días</span>
        <div style={{ flex: 1 }} />

        {/* Metric toggle */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-page)',
            borderRadius: 20,
            padding: 2,
            gap: 1,
          }}
        >
          {(['ventas', 'gasto', 'cpa'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetricView(m)}
              style={{
                padding: '3px 10px',
                borderRadius: 18,
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                background: metricView === m ? 'white' : 'transparent',
                color: metricView === m ? 'var(--brand)' : 'var(--text-3)',
                boxShadow: metricView === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                textTransform: 'capitalize',
              }}
            >
              {m === 'cpa' ? 'CPA' : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
            display: 'flex',
            padding: '2px 4px',
          }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <TableHeader label="" />
              <TableHeader label="Código" />
              <TableHeader label="Producto" />
              <TableHeader label="Ventas" sortKey="ventas" currentSort={sortKey} onSort={setSortKey} align="right" />
              <TableHeader label="CPA" sortKey="cpa" currentSort={sortKey} onSort={setSortKey} align="right" />
              <TableHeader label="ROAS" sortKey="roas" currentSort={sortKey} onSort={setSortKey} align="right" />
              <TableHeader label="Gasto" sortKey="gasto" currentSort={sortKey} onSort={setSortKey} align="right" />
              <TableHeader label="% Budget" sortKey="budgetPct" currentSort={sortKey} onSort={setSortKey} align="right" />
              <TableHeader label="Frec." sortKey="frecuencia" currentSort={sortKey} onSort={setSortKey} align="right" />
              <TableHeader label="Estado" align="center" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((creative, idx) => (
              <CreativeRow
                key={creative.id}
                creative={creative}
                isLast={idx === sorted.length - 1}
                metricView={metricView}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CreativeRow({
  creative,
  isLast,
  metricView,
}: {
  creative: Creative
  isLast: boolean
  metricView: 'ventas' | 'gasto' | 'cpa'
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#FAFAFA' : 'transparent',
        borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
        transition: 'background 0.1s',
      }}
    >
      {/* Drag handle */}
      <td style={{ padding: '9px 6px 9px 10px', width: 24 }}>
        <GripVertical size={13} color="var(--text-3)" style={{ cursor: 'grab' }} />
      </td>

      {/* Code */}
      <td style={{ padding: '9px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <PlatformBadge platform={creative.platform} />
          <span
            className="mono"
            style={{
              color: 'var(--text-1)',
              letterSpacing: '0.3px',
            }}
          >
            {creative.code}
          </span>
        </div>
      </td>

      {/* Product */}
      <td style={{ padding: '9px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: creative.thumbnailColor,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: 'var(--text-1)', whiteSpace: 'nowrap' }}>
            {creative.product}
          </span>
        </div>
      </td>

      {/* Ventas */}
      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
            {formatNumber(creative.ventas)}
          </span>
          {creative.ventasDelta !== 0 && (
            <div
              style={{
                fontSize: 10,
                color: creative.ventasDelta >= 0 ? 'var(--success)' : 'var(--danger)',
                fontWeight: 600,
              }}
            >
              {formatDelta(creative.ventasDelta)}
            </div>
          )}
        </div>
      </td>

      {/* CPA */}
      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: getCpaColor(creative.cpa, creative.cpaObjective),
          }}
        >
          {creative.cpa > 0 ? formatCurrency(creative.cpa) : '—'}
        </span>
      </td>

      {/* ROAS */}
      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: getRoasColor(creative.roas),
          }}
        >
          {creative.roas > 0 ? formatRoas(creative.roas) : '—'}
        </span>
      </td>

      {/* Gasto */}
      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
        <div>
          <span style={{ fontSize: 12, color: 'var(--text-1)' }}>
            {formatCurrency(creative.gasto)}
          </span>
          {creative.gastoDelta !== 0 && (
            <div
              style={{
                fontSize: 10,
                color: creative.gastoDelta >= 0 ? 'var(--success)' : 'var(--danger)',
                fontWeight: 600,
              }}
            >
              {formatDelta(creative.gastoDelta)}
            </div>
          )}
        </div>
      </td>

      {/* % Budget */}
      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 11, color: 'var(--text-2)', minWidth: 28, textAlign: 'right' }}>
            {creative.budgetPct > 0 ? `${creative.budgetPct.toFixed(0)}%` : '—'}
          </span>
          {creative.budgetPct > 0 && (
            <ProgressBar value={creative.budgetPct} width={52} height={4} />
          )}
        </div>
      </td>

      {/* Frecuencia */}
      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: creative.frecuencia >= 2.0 ? 600 : 400,
            color: getFrecuenciaColor(creative.frecuencia),
          }}
        >
          {formatFrequency(creative.frecuencia)}
        </span>
      </td>

      {/* Status */}
      <td style={{ padding: '9px 10px', textAlign: 'center' }}>
        <StatusPill status={creative.status} />
      </td>
    </tr>
  )
}
