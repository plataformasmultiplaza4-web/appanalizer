'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import { MoreHorizontal } from 'lucide-react'
import type { DayData } from '@/types/metrics'
import { Skeleton } from '@/components/ui/Skeleton'

interface DayBarChartProps {
  data: DayData[]
  isLoading?: boolean
  dateRangeLabel?: string
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ fontWeight: 600, color: 'var(--brand-blue)', marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ color: 'var(--text-2)' }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function DayBarChart({
  data,
  isLoading = false,
  dateRangeLabel,
}: DayBarChartProps) {
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Skeleton height={14} width="40%" />
          <Skeleton height={14} width="20%" />
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 140 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} width={28} height={30 + Math.random() * 90} borderRadius={4} />
          ))}
        </div>
      </div>
    )
  }

  const rangeLabel = dateRangeLabel ?? (data.length > 0 ? `${data[0]?.day} — ${data[data.length - 1]?.day}` : '')

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
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            Conversiones por mes
          </span>
          {rangeLabel && (
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{rangeLabel}</span>
          )}
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
          <MoreHorizontal size={15} />
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border-light)" strokeDasharray="0" />
          <XAxis
            dataKey="dayShort"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-3)' }}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-3)' }}
            width={30}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-3)' }}
            width={36}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            formatter={(value) => <span style={{ color: 'var(--text-2)', fontSize: 11 }}>{value}</span>}
          />
          <Bar
            yAxisId="left"
            dataKey="ventas"
            name="Ventas"
            fill="#C7D2F8"
            radius={[3, 3, 0, 0]}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="ventas"
            name="Conversiones"
            stroke="#4A6CF7"
            strokeWidth={2}
            dot={false}
            legendType="none"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="gasto"
            name="Gasto ($)"
            stroke="#7C3AED"
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 2"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
