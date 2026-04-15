'use client'

import { KPICard } from './KPICard'
import type { KPIData } from '@/types/metrics'
import {
  formatCurrencyShort,
  formatNumber,
  formatCurrency,
  formatRoas,
  formatPercent,
  formatFrequency,
} from '@/lib/utils'

interface KPIGridProps {
  kpis: KPIData | null
  isLoading?: boolean
  selectedKPI?: string
  onSelectKPI?: (id: string) => void
}

export function KPIGrid({
  kpis,
  isLoading = false,
  selectedKPI,
  onSelectKPI,
}: KPIGridProps) {
  const cards = [
    {
      id: 'gasto',
      label: 'Gasto Total',
      value: isLoading || !kpis ? '—' : formatCurrencyShort(kpis.totalGasto),
      sublabel: 'Este mes',
      delta: kpis?.gastoDelta,
      platform: 'tiktok' as const,
    },
    {
      id: 'ventas',
      label: 'Ventas Totales',
      value: isLoading || !kpis ? '—' : formatNumber(kpis.totalVentas),
      sublabel: 'Este mes',
      delta: kpis?.ventasDelta,
      platform: 'meta' as const,
    },
    {
      id: 'cpa',
      label: 'CPA Promedio',
      value: isLoading || !kpis ? '—' : formatCurrency(kpis.cpaPromedio),
      sublabel: 'Costo por venta',
      delta: kpis?.cpaDelta !== undefined ? -(kpis.cpaDelta) : undefined,
      platform: 'all' as const,
    },
    {
      id: 'roas',
      label: 'ROAS Promedio',
      value: isLoading || !kpis ? '—' : formatRoas(kpis.roasPromedio),
      sublabel: 'Retorno inversión',
      delta: kpis?.roasDelta,
      platform: 'all' as const,
    },
    {
      id: 'ctr',
      label: 'CTR Promedio',
      value: isLoading || !kpis ? '—' : formatPercent(kpis.ctrPromedio),
      sublabel: 'Click-through rate',
      platform: 'tiktok' as const,
    },
    {
      id: 'frecuencia',
      label: 'Frecuencia',
      value: isLoading || !kpis ? '—' : formatFrequency(kpis.frecuenciaPromedio),
      sublabel: 'Por usuario',
      platform: 'tiktok' as const,
    },
  ]

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '12px 16px',
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'var(--brand-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 9, color: 'var(--brand)', fontWeight: 700 }}>i</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
          KPIs Principales
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--brand)',
            background: 'var(--brand-light)',
            padding: '2px 8px',
            borderRadius: 10,
            marginLeft: 4,
          }}
        >
          Este mes
        </span>
      </div>

      {/* Horizontal scrollable strip */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {cards.map((card) => (
          <KPICard
            key={card.id}
            label={card.label}
            value={card.value}
            sublabel={card.sublabel}
            delta={card.delta}
            platform={card.platform}
            isSelected={selectedKPI === card.id}
            isLoading={isLoading}
            onClick={() => onSelectKPI?.(card.id)}
          />
        ))}
      </div>
    </div>
  )
}
