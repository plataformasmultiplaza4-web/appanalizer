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
      sublabel: isLoading || !kpis ? '' : formatCurrency(kpis.totalGasto),
      delta: kpis?.gastoDelta,
      platform: 'tiktok' as const,
      valueColor: 'brand' as const,
    },
    {
      id: 'ventas',
      label: 'Ventas Totales',
      value: isLoading || !kpis ? '—' : formatNumber(kpis.totalVentas),
      sublabel: 'pedidos confirmados',
      delta: kpis?.ventasDelta,
      platform: 'tiktok' as const,
      valueColor: 'default' as const,
    },
    {
      id: 'cpa',
      label: 'CPA Promedio',
      value: isLoading || !kpis ? '—' : formatCurrency(kpis.cpaPromedio),
      sublabel: 'costo por venta',
      delta: kpis?.cpaDelta !== undefined ? -(kpis.cpaDelta) : undefined, // invert — lower CPA = better
      platform: 'all' as const,
      valueColor:
        kpis && kpis.cpaPromedio <= 35
          ? ('success' as const)
          : kpis && kpis.cpaPromedio <= 42
            ? ('warning' as const)
            : ('danger' as const),
    },
    {
      id: 'roas',
      label: 'ROAS Promedio',
      value: isLoading || !kpis ? '—' : formatRoas(kpis.roasPromedio),
      sublabel: 'retorno en inversión',
      delta: kpis?.roasDelta,
      platform: 'all' as const,
      valueColor:
        kpis && kpis.roasPromedio >= 2.5
          ? ('success' as const)
          : kpis && kpis.roasPromedio >= 1.5
            ? ('warning' as const)
            : ('danger' as const),
    },
    {
      id: 'ctr',
      label: 'CTR Promedio',
      value: isLoading || !kpis ? '—' : formatPercent(kpis.ctrPromedio),
      sublabel: 'click-through rate',
      platform: 'tiktok' as const,
      valueColor: 'default' as const,
    },
    {
      id: 'frecuencia',
      label: 'Frecuencia',
      value: isLoading || !kpis ? '—' : formatFrequency(kpis.frecuenciaPromedio),
      sublabel: 'promedio por usuario',
      platform: 'tiktok' as const,
      valueColor:
        kpis && kpis.frecuenciaPromedio >= 2.5
          ? ('danger' as const)
          : kpis && kpis.frecuenciaPromedio >= 2.0
            ? ('warning' as const)
            : ('default' as const),
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 10,
        marginBottom: 16,
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
          valueColor={card.valueColor}
          isSelected={selectedKPI === card.id}
          isLoading={isLoading}
          onClick={() => onSelectKPI?.(card.id)}
        />
      ))}
    </div>
  )
}
