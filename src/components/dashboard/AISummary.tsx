'use client'

import { MoreHorizontal, Sparkles, TrendingUp, Pause, Film, Eye, RefreshCw, AlertTriangle } from 'lucide-react'
import type { AISummaryData } from '@/types/metrics'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/lib/utils'

interface AISummaryProps {
  summary: AISummaryData | null
  isLoading?: boolean
  onRegenerate?: () => void
  generatedAt?: Date
}

type ActionType = 'escalar' | 'pausar' | 'producir' | 'monitorear'
type Priority = 'alta' | 'media' | 'baja'

const ACTION_ICONS: Record<ActionType, { icon: React.ElementType; color: string; bg: string }> = {
  escalar: { icon: TrendingUp, color: 'var(--success-text)', bg: 'var(--success-bg)' },
  pausar: { icon: Pause, color: 'var(--danger-text)', bg: 'var(--danger-bg)' },
  producir: { icon: Film, color: 'var(--warning-text)', bg: 'var(--warning-bg)' },
  monitorear: { icon: Eye, color: '#4B5563', bg: '#F3F4F6' },
}

const PRIORITY_COLORS: Record<Priority, string> = {
  alta: 'var(--danger)',
  media: 'var(--warning)',
  baja: 'var(--success)',
}

export function AISummary({
  summary,
  isLoading = false,
  onRegenerate,
  generatedAt,
}: AISummaryProps) {
  if (isLoading) {
    return (
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
          <Skeleton width={22} height={22} borderRadius={6} />
          <Skeleton height={13} width={120} />
          <Skeleton height={20} width={80} borderRadius={20} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height={12} />
          <Skeleton height={12} width="90%" />
          <Skeleton height={12} width="70%" />
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div
        style={{
          background: 'var(--surface)',
          border: '1px dashed var(--border)',
          borderRadius: 10,
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--brand-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={20} color="var(--brand)" />
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', textAlign: 'center' }}>
          Análisis con Claude AI
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', maxWidth: 340 }}>
          Haz clic en{' '}
          <strong style={{ color: 'var(--brand)' }}>Analizar con IA</strong> para que Claude
          revise tus creativos y genere acciones concretas para hoy.
        </p>
      </div>
    )
  }

  const dateStr = generatedAt
    ? generatedAt.toLocaleString('es-PE', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Hoy'

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '14px 16px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: 'var(--brand-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Sparkles size={13} color="var(--brand)" />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>
          Key Insights
        </span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 20,
            background: 'var(--brand-light)',
            color: 'var(--brand)',
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          Claude AI
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Generado: {dateStr}</span>
        <div style={{ flex: 1 }} />
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 10px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'none',
              cursor: 'pointer',
              fontSize: 11,
              color: 'var(--text-2)',
            }}
          >
            <RefreshCw size={11} />
            Regenerar
          </button>
        )}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
            display: 'flex',
          }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* KPI row */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          marginBottom: 12,
          padding: '10px 12px',
          background: 'var(--bg-page)',
          borderRadius: 8,
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Gasto', value: formatCurrency(summary.kpis.total_spend) },
          { label: 'Ventas', value: `${summary.kpis.total_ventas}` },
          { label: 'CPA Prom.', value: formatCurrency(summary.kpis.cpa_promedio) },
          { label: 'ROAS Prom.', value: `${summary.kpis.roas_promedio.toFixed(1)}x` },
          { label: 'Mejor CPA', value: `${summary.kpis.mejor_cpa.codigo} (${formatCurrency(summary.kpis.mejor_cpa.cpa)})` },
          { label: 'Peor CPA', value: `${summary.kpis.peor_cpa.codigo} (${formatCurrency(summary.kpis.peor_cpa.cpa)})` },
        ].map((item) => (
          <div key={item.label}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Resumen ejecutivo */}
      <p
        style={{
          fontSize: 12,
          color: '#374151',
          lineHeight: 1.65,
          marginBottom: 12,
        }}
      >
        {summary.resumen_ejecutivo}
      </p>

      {/* Winners */}
      {summary.winners_escalar.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--success-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 6,
            }}
          >
            Winners — Escalar
          </div>
          {summary.winners_escalar.map((w) => (
            <div
              key={w.codigo}
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: 5,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--brand)',
                  marginTop: 5,
                  flexShrink: 0,
                }}
              />
              <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                <strong className="mono" style={{ color: 'var(--text-1)' }}>
                  {w.codigo}
                </strong>{' '}
                ({w.producto}) — CPA{' '}
                <strong style={{ color: 'var(--success)' }}>
                  {formatCurrency(w.cpa)}
                </strong>
                , ROAS {w.roas.toFixed(1)}x, Frec. {w.frecuencia.toFixed(1)} →{' '}
                <em style={{ color: 'var(--text-2)' }}>{w.accion}</em>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Hook swaps urgentes */}
      {summary.hook_swaps_urgentes.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--warning-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 6,
            }}
          >
            <AlertTriangle size={11} />
            Hook Swaps Urgentes
          </div>
          {summary.hook_swaps_urgentes.map((hs) => (
            <div
              key={hs.codigo}
              style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--warning)',
                  marginTop: 5,
                  flexShrink: 0,
                }}
              />
              <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                <strong className="mono">{hs.codigo}</strong> (Frec. {hs.frecuencia.toFixed(1)}){' '}
                — F2 {hs.tipo} para{' '}
                <strong style={{ color: 'var(--brand)' }}>{hs.editor_asignado}</strong>:{' '}
                {hs.angulo_sugerido}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Acciones para hoy */}
      {summary.acciones_hoy.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 6,
            }}
          >
            Acciones para hoy
          </div>
          {summary.acciones_hoy.map((action, idx) => {
            const config = ACTION_ICONS[action.tipo] ?? ACTION_ICONS.monitorear
            const Icon = config.icon
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '7px 10px',
                  background: 'var(--bg-page)',
                  borderRadius: 7,
                  marginBottom: 4,
                }}
              >
                {/* Priority indicator */}
                <div
                  style={{
                    width: 3,
                    height: 20,
                    borderRadius: 3,
                    background: PRIORITY_COLORS[action.prioridad] ?? 'var(--text-3)',
                    flexShrink: 0,
                  }}
                />
                {/* Icon */}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    background: config.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={12} color={config.color} />
                </div>
                {/* Text */}
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--text-1)',
                    flex: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {action.accion}
                </span>
                {/* Responsable */}
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--brand)',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {action.responsable}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Brief editores */}
      {(summary.brief_editores.ytalo || summary.brief_editores.manuel || summary.brief_editores.cesar) && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 6,
            }}
          >
            Brief Editores
          </div>
          {[
            { name: 'Ytalo', text: summary.brief_editores.ytalo },
            { name: 'Manuel', text: summary.brief_editores.manuel },
            { name: 'César', text: summary.brief_editores.cesar },
          ]
            .filter((e) => e.text)
            .map((editor) => (
              <div
                key={editor.name}
                style={{
                  padding: '8px 10px',
                  background: 'var(--brand-light)',
                  borderRadius: 7,
                  marginBottom: 4,
                  borderLeft: '3px solid var(--brand)',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--brand)',
                    marginRight: 6,
                  }}
                >
                  {editor.name}:
                </span>
                <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>
                  {editor.text}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
