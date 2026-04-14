'use client'

import type { Creative } from '@/types/metrics'
import { StatusPill } from '@/components/ui/StatusPill'
import { formatFrequency, getFrecuenciaColor, formatCurrency } from '@/lib/utils'
import { SATURATION_THRESHOLDS } from '@/lib/constants'

interface FrequencyAlertsProps {
  creatives: Creative[]
}

export function FrequencyAlerts({ creatives }: FrequencyAlertsProps) {
  const atRisk = creatives
    .filter((c) => c.frecuencia >= SATURATION_THRESHOLDS.frecuencia_alerta)
    .sort((a, b) => b.frecuencia - a.frecuencia)

  const critical = atRisk.filter((c) => c.frecuencia >= SATURATION_THRESHOLDS.frecuencia_critica)
  const warning = atRisk.filter(
    (c) =>
      c.frecuencia >= SATURATION_THRESHOLDS.frecuencia_alerta &&
      c.frecuencia < SATURATION_THRESHOLDS.frecuencia_critica,
  )

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
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{ fontSize: 16, lineHeight: 1 }}
          role="img"
          aria-label="frecuencia"
        >
          🔥
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
          Alertas de Saturación
        </span>
        {critical.length > 0 && (
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 20,
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {critical.length} crítico{critical.length > 1 ? 's' : ''}
          </span>
        )}
        {warning.length > 0 && (
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 20,
              background: 'var(--warning-bg)',
              color: 'var(--warning-text)',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {warning.length} alerta{warning.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {atRisk.length === 0 ? (
        <div
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            color: 'var(--success)',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ✓ Ningún creativo en zona de saturación
        </div>
      ) : (
        <div>
          {atRisk.map((creative, idx) => (
            <FrequencyRow
              key={creative.id}
              creative={creative}
              isLast={idx === atRisk.length - 1}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
          <span style={{ color: 'var(--warning)', fontWeight: 600 }}>
            ≥ {SATURATION_THRESHOLDS.frecuencia_alerta}
          </span>{' '}
          Hook Swap
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
          <span style={{ color: 'var(--danger)', fontWeight: 600 }}>
            ≥ {SATURATION_THRESHOLDS.frecuencia_critica}
          </span>{' '}
          Pausar inmediato
        </span>
      </div>
    </div>
  )
}

function FrequencyRow({ creative, isLast }: { creative: Creative; isLast: boolean }) {
  const isCritical = creative.frecuencia >= SATURATION_THRESHOLDS.frecuencia_critica
  const color = getFrecuenciaColor(creative.frecuencia)
  const barWidth = Math.min((creative.frecuencia / SATURATION_THRESHOLDS.frecuencia_critica) * 100, 100)

  return (
    <div
      style={{
        padding: '10px 16px',
        borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
        background: isCritical ? 'rgba(239,68,68,0.02)' : 'transparent',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = isCritical ? 'rgba(239,68,68,0.04)' : '#FAFAFA' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = isCritical ? 'rgba(239,68,68,0.02)' : 'transparent' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className="mono"
            style={{ color: 'var(--text-1)', fontWeight: isCritical ? 700 : 400 }}
          >
            {creative.code}
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{creative.product}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{ fontSize: 13, fontWeight: 700, color }}
          >
            {formatFrequency(creative.frecuencia)}x
          </span>
          <StatusPill status={creative.status} />
        </div>
      </div>

      {/* Frequency bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 6,
            background: 'var(--border-light)',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${barWidth}%`,
              height: '100%',
              background: color,
              borderRadius: 3,
            }}
          />
          {/* Threshold markers */}
          <div
            style={{
              position: 'absolute',
              left: `${(SATURATION_THRESHOLDS.frecuencia_alerta / SATURATION_THRESHOLDS.frecuencia_critica) * 100}%`,
              top: 0,
              width: 1,
              height: '100%',
              background: 'var(--warning)',
              opacity: 0.7,
            }}
          />
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
          CPA {creative.cpa > 0 ? formatCurrency(creative.cpa) : '—'}
        </span>
      </div>

      {isCritical && (
        <p style={{ fontSize: 10, color: 'var(--danger)', marginTop: 4, fontWeight: 600 }}>
          ⚠ Pausar inmediatamente — frecuencia crítica
        </p>
      )}
    </div>
  )
}
