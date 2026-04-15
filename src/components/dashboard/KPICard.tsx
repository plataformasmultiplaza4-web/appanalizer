'use client'

import { MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

interface KPICardProps {
  label: string
  value: string
  sublabel?: string
  delta?: number            // percentage change
  platform?: 'meta' | 'tiktok' | 'all'
  isSelected?: boolean
  isLoading?: boolean
  valueColor?: 'brand' | 'default' | 'success' | 'warning' | 'danger'
  onClick?: () => void
}

function PlatformIcon({ platform }: { platform?: string }) {
  if (platform === 'meta') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1877F2" />
        <path
          d="M13.5 12.5H15.5L16 9.5H13.5V8C13.5 7.17 13.5 6.5 15 6.5H16V4C15.74 3.97 14.97 3.9 14.14 3.9C11.89 3.9 10.5 5.19 10.5 7.7V9.5H8V12.5H10.5V20H13.5V12.5Z"
          fill="white"
        />
      </svg>
    )
  }
  if (platform === 'tiktok') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#000000" />
        <path
          d="M16.6 5.82C15.9 5.07 15.5 4.08 15.5 3H12.45V15.4C12.37 16.71 11.29 17.75 9.97 17.75C8.62 17.75 7.52 16.65 7.52 15.29C7.52 13.67 9.07 12.43 10.68 12.91V9.79C7.34 9.28 4.47 11.87 4.47 15.29C4.47 18.63 7.19 21.3 10.5 21.3C13.84 21.3 16.53 18.6 16.53 15.25V9.02C17.79 9.93 19.32 10.47 21 10.47V7.42C20.06 7.42 17.86 6.85 16.6 5.82Z"
          fill="white"
        />
      </svg>
    )
  }
  // All / default
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        background: 'var(--brand)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ color: 'white', fontSize: 8, fontWeight: 700 }}>Σ</span>
    </div>
  )
}

const VALUE_COLORS: Record<string, string> = {
  brand: 'var(--brand)',
  default: 'var(--text-1)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
}

export function KPICard({
  label,
  value,
  sublabel,
  delta,
  platform = 'all',
  isSelected = false,
  isLoading = false,
  valueColor = 'default',
  onClick,
}: KPICardProps) {
  const isPositive = delta !== undefined && delta >= 0
  const hasDelta = delta !== undefined

  if (isLoading) {
    return (
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <Skeleton height={12} width="60%" />
        <Skeleton height={26} width="70%" />
        <Skeleton height={10} width="40%" />
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isSelected ? 'var(--brand)' : 'var(--border)'}`,
        borderRadius: 10,
        padding: '12px 14px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: isSelected ? '0 0 0 3px rgba(0,188,212,0.10)' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isSelected && onClick) {
          e.currentTarget.style.borderColor = 'rgba(0,188,212,0.40)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border)'
        }
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <PlatformIcon platform={platform} />
          <span
            style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, lineHeight: 1 }}
          >
            {label}
          </span>
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: 4,
            color: 'var(--text-3)',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Value */}
      <div
        className="kpi-value"
        style={{ color: VALUE_COLORS[valueColor] ?? VALUE_COLORS.default }}
      >
        {value}
      </div>

      {/* Sub-label + delta */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 6,
        }}
      >
        {sublabel && (
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{sublabel}</span>
        )}
        {hasDelta && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontSize: 11,
              fontWeight: 600,
              color: isPositive ? 'var(--success)' : 'var(--danger)',
            }}
          >
            {isPositive ? (
              <TrendingUp size={11} />
            ) : (
              <TrendingDown size={11} />
            )}
            {isPositive ? '+' : ''}
            {delta.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  )
}
