'use client'

import { Info, ArrowUp, ArrowDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

interface KPICardProps {
  label: string
  value: string
  sublabel?: string
  delta?: number
  platform?: 'meta' | 'tiktok' | 'google' | 'all'
  isLoading?: boolean
  valueColor?: 'brand' | 'default' | 'success' | 'warning' | 'danger'
  isSelected?: boolean
  onClick?: () => void
}

function PlatformDot({ platform }: { platform?: string }) {
  const colors: Record<string, string> = {
    meta: '#1877F2',
    google: '#4285F4',
    tiktok: '#010101',
    all: 'var(--brand)',
  }
  const bg = colors[platform ?? 'all'] ?? 'var(--brand)'

  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        opacity: 0.85,
      }}
    >
      {platform === 'meta' && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M13.5 12.5H15.5L16 9.5H13.5V8C13.5 7.17 13.5 6.5 15 6.5H16V4C15.74 3.97 14.97 3.9 14.14 3.9C11.89 3.9 10.5 5.19 10.5 7.7V9.5H8V12.5H10.5V20H13.5V12.5Z" fill="white" />
        </svg>
      )}
      {platform === 'tiktok' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
          <path d="M16.6 5.82C15.9 5.07 15.5 4.08 15.5 3H12.45V15.4C12.37 16.71 11.29 17.75 9.97 17.75C8.62 17.75 7.52 16.65 7.52 15.29C7.52 13.67 9.07 12.43 10.68 12.91V9.79C7.34 9.28 4.47 11.87 4.47 15.29C4.47 18.63 7.19 21.3 10.5 21.3C13.84 21.3 16.53 18.6 16.53 15.25V9.02C17.79 9.93 19.32 10.47 21 10.47V7.42C20.06 7.42 17.86 6.85 16.6 5.82Z" fill="white" />
        </svg>
      )}
      {platform === 'google' && (
        <span style={{ color: 'white', fontSize: 8, fontWeight: 800 }}>G</span>
      )}
      {(platform === 'all' || !platform) && (
        <span style={{ color: 'white', fontSize: 8, fontWeight: 800 }}>Σ</span>
      )}
    </div>
  )
}

export function KPICard({
  label,
  value,
  sublabel,
  delta,
  platform = 'all',
  isLoading = false,
  isSelected = false,
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
          minWidth: 150,
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton height={22} width={22} borderRadius={11} />
          <Skeleton height={10} width={10} borderRadius={5} />
        </div>
        <Skeleton height={11} width="65%" />
        <Skeleton height={24} width="55%" />
        <Skeleton height={10} width="45%" />
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
        boxShadow: isSelected ? '0 0 0 3px rgba(0,190,200,0.10)' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        minWidth: 150,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
      }}
      onMouseEnter={(e) => {
        if (!isSelected && onClick) {
          e.currentTarget.style.borderColor = 'var(--brand-mid)'
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,190,200,0.08)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* Top row: platform icon + info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PlatformDot platform={platform} />
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
            display: 'flex',
            padding: 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Info size={13} strokeWidth={1.5} />
        </button>
      </div>

      {/* Metric name */}
      <span
        style={{
          fontSize: 11,
          color: 'var(--text-2)',
          fontWeight: 500,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </span>

      {/* Value */}
      <div
        className="kpi-value"
        style={{ fontSize: 20 }}
      >
        {value}
      </div>

      {/* Delta + sublabel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
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
              <ArrowUp size={11} strokeWidth={2.5} />
            ) : (
              <ArrowDown size={11} strokeWidth={2.5} />
            )}
            {Math.abs(delta).toFixed(1)}%
          </div>
        )}
        {sublabel && (
          <span
            style={{
              fontSize: 10,
              color: 'var(--text-3)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
