'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { MoreHorizontal } from 'lucide-react'
import type { DayData } from '@/types/metrics'
import { Skeleton } from '@/components/ui/Skeleton'

interface DayBarChartProps {
  data: DayData[]
  metric?: 'ventas' | 'gasto'
  isLoading?: boolean
}

interface TooltipPayload {
  name: string
  value: number
  payload: DayData
}

function CustomTooltip({
  active,
  payload,
  metric,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  metric: 'ventas' | 'gasto'
}) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
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
      <div style={{ fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>
        {d.day}
      </div>
      <div style={{ color: 'var(--text-2)' }}>
        {metric === 'ventas'
          ? `${d.ventas} ventas`
          : `S/. ${d.gasto.toFixed(0)} gasto`}
      </div>
    </div>
  )
}

export function DayBarChart({
  data,
  metric = 'ventas',
  isLoading = false,
}: DayBarChartProps) {
  // Highlight the day with highest value
  const maxValue = Math.max(...data.map((d) => (metric === 'ventas' ? d.ventas : d.gasto)))
  const todayIndex = data.length - 1

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
        <Skeleton height={14} width="40%" />
        <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              width={28}
              height={20 + Math.random() * 60}
              borderRadius={4}
            />
          ))}
        </div>
      </div>
    )
  }

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
        <span
          style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}
        >
          {metric === 'ventas' ? 'Ventas por día' : 'Gasto por día'}
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-page)',
              borderRadius: 6,
              padding: 2,
              gap: 2,
            }}
          >
            {['ventas', 'gasto'].map((m) => (
              <span
                key={m}
                style={{
                  padding: '2px 8px',
                  borderRadius: 5,
                  fontSize: 10,
                  fontWeight: 600,
                  background: metric === m ? 'white' : 'transparent',
                  color: metric === m ? 'var(--brand)' : 'var(--text-3)',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  boxShadow: metric === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
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
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis
            dataKey="dayShort"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: 'var(--text-3)' }}
          />
          <YAxis hide />
          <Tooltip
            content={<CustomTooltip metric={metric} />}
            cursor={false}
          />
          <Bar dataKey={metric} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => {
              const isHighlight =
                (metric === 'ventas' ? entry.ventas : entry.gasto) === maxValue
              const isToday = index === todayIndex
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    isHighlight || isToday
                      ? 'var(--brand)'
                      : 'var(--brand-light)'
                  }
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 8,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: 'var(--brand)',
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
          {metric === 'ventas' ? 'Ventas totales' : 'Gasto total'} — últimos 7 días
        </span>
      </div>
    </div>
  )
}
