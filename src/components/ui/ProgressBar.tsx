import { getProgressColor } from '@/lib/utils'

interface ProgressBarProps {
  value: number        // 0-100+
  width?: number       // px
  height?: number      // px
  showLabel?: boolean
}

export function ProgressBar({
  value,
  width = 60,
  height = 5,
  showLabel = false,
}: ProgressBarProps) {
  const color = getProgressColor(value)
  const clampedWidth = Math.min(value, 100)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          width,
          height,
          background: 'var(--border-light)',
          borderRadius: height,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: `${clampedWidth}%`,
            height: '100%',
            background: color,
            borderRadius: height,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: 11,
            color,
            fontWeight: 600,
            minWidth: 32,
          }}
        >
          {value.toFixed(0)}%
        </span>
      )}
    </div>
  )
}
