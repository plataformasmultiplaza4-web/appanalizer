'use client'

import type { SourceConnection } from '@/types/dashboard'

const SOURCES: SourceConnection[] = [
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    platform: 'tiktok',
    status: 'connected',
    accountCount: 7,
    lastSync: 'Hace 5 min',
  },
  {
    id: 'meta',
    name: 'Meta Ads',
    platform: 'meta',
    status: 'connected',
    accountCount: 6,
    lastSync: 'Hace 5 min',
  },
  {
    id: 'google',
    name: 'Google Ads',
    platform: 'google',
    status: 'coming_soon',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    platform: 'shopify',
    status: 'coming_soon',
  },
  {
    id: 'instagram',
    name: 'Instagram Org.',
    platform: 'instagram',
    status: 'connected',
    accountCount: 1,
    lastSync: 'Hace 1 hora',
  },
  {
    id: 'tiktokshop',
    name: 'TikTok Shop',
    platform: 'tiktokshop',
    status: 'coming_soon',
  },
]

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  tiktok: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#000" />
      <path d="M16.6 5.82C15.9 5.07 15.5 4.08 15.5 3H12.45V15.4C12.37 16.71 11.29 17.75 9.97 17.75C8.62 17.75 7.52 16.65 7.52 15.29C7.52 13.67 9.07 12.43 10.68 12.91V9.79C7.34 9.28 4.47 11.87 4.47 15.29C4.47 18.63 7.19 21.3 10.5 21.3C13.84 21.3 16.53 18.6 16.53 15.25V9.02C17.79 9.93 19.32 10.47 21 10.47V7.42C20.06 7.42 17.86 6.85 16.6 5.82Z" fill="white" />
    </svg>
  ),
  meta: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path d="M13.5 12.5H15.5L16 9.5H13.5V8C13.5 7.17 13.5 6.5 15 6.5H16V4C15.74 3.97 14.97 3.9 14.14 3.9C11.89 3.9 10.5 5.19 10.5 7.7V9.5H8V12.5H10.5V20H13.5V12.5Z" fill="white" />
    </svg>
  ),
  google: (
    <div style={{ width: 20, height: 20, borderRadius: 6, background: '#fff', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#4285F4' }}>G</div>
  ),
  shopify: (
    <div style={{ width: 20, height: 20, borderRadius: 6, background: '#95BF47', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white' }}>S</div>
  ),
  instagram: (
    <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>📷</div>
  ),
  tiktokshop: (
    <div style={{ width: 20, height: 20, borderRadius: 6, background: '#FF0050', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white' }}>TS</div>
  ),
}

function StatusBadge({ status }: { status: SourceConnection['status'] }) {
  if (status === 'connected') {
    return (
      <span style={{ padding: '2px 7px', borderRadius: 20, background: 'var(--success-bg)', color: 'var(--success-text)', fontSize: 10, fontWeight: 600 }}>
        Conectado
      </span>
    )
  }
  if (status === 'expired') {
    return (
      <span style={{ padding: '2px 7px', borderRadius: 20, background: 'var(--danger-bg)', color: 'var(--danger-text)', fontSize: 10, fontWeight: 600 }}>
        Vencido
      </span>
    )
  }
  return (
    <span style={{ padding: '2px 7px', borderRadius: 20, background: 'var(--border-light)', color: 'var(--text-3)', fontSize: 10, fontWeight: 600 }}>
      Próximamente
    </span>
  )
}

export function SourcesGrid() {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
          Fuentes de Datos
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 8 }}>
          {SOURCES.filter((s) => s.status === 'connected').length} conectadas
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          padding: '12px',
          gap: '10px',
        }}
      >
        {SOURCES.map((source) => (
          <div
            key={source.id}
            style={{
              border: `1px solid ${source.status === 'connected' ? 'var(--border)' : 'var(--border-light)'}`,
              borderRadius: 8,
              padding: '10px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              opacity: source.status === 'coming_soon' ? 0.65 : 1,
              cursor: source.status === 'connected' ? 'pointer' : 'default',
            }}
          >
            {PLATFORM_ICONS[source.platform]}
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-1)', textAlign: 'center' }}>
              {source.name}
            </span>
            <StatusBadge status={source.status} />
            {source.accountCount && (
              <span style={{ fontSize: 9, color: 'var(--text-3)' }}>
                {source.accountCount} cuentas
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
