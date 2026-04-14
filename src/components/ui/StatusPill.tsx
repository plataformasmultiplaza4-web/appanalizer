import type { CreativeStatus } from '@/types/metrics'

const STATUS_CONFIG: Record<
  CreativeStatus,
  { bg: string; color: string; label: string; dot: string }
> = {
  ESCALAR: { bg: '#D1FAE5', color: '#065F46', label: 'ESCALAR', dot: '#10B981' },
  MONITOREAR: { bg: '#FEF3C7', color: '#92400E', label: 'MONITOREAR', dot: '#F59E0B' },
  HOOK_SWAP: { bg: '#FEF3C7', color: '#92400E', label: 'HOOK SWAP', dot: '#F59E0B' },
  PAUSAR: { bg: '#FEE2E2', color: '#991B1B', label: 'PAUSAR', dot: '#EF4444' },
}

interface StatusPillProps {
  status: CreativeStatus
  size?: 'sm' | 'md'
}

export function StatusPill({ status, size = 'sm' }: StatusPillProps) {
  const config = STATUS_CONFIG[status]
  const fontSize = size === 'sm' ? 10 : 11
  const padding = size === 'sm' ? '2px 7px' : '3px 9px'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding,
        borderRadius: 20,
        background: config.bg,
        color: config.color,
        fontSize,
        fontWeight: 600,
        letterSpacing: '0.3px',
        whiteSpace: 'nowrap',
        lineHeight: 1.5,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: config.dot,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  )
}
