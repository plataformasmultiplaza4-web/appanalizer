interface SkeletonProps {
  width?: number | string
  height?: number | string
  borderRadius?: number
  className?: string
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 4,
}: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        display: 'block',
      }}
    />
  )
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <Skeleton height={14} width="40%" />
      <Skeleton height={28} width="60%" />
      <Skeleton height={10} width="30%" />
      {rows > 1 &&
        Array.from({ length: rows - 1 }).map((_, i) => (
          <Skeleton key={i} height={12} width={`${70 - i * 10}%`} />
        ))}
    </div>
  )
}
