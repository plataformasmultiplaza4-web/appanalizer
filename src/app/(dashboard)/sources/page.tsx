'use client'

import { Topbar } from '@/components/layout/Topbar'
import { SourcesGrid } from '@/components/alerts/SourcesGrid'

export default function SourcesPage() {
  return (
    <>
      <Topbar />
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px 20px',
          background: 'var(--bg-page)',
        }}
      >
        <SourcesGrid />

        {/* Windsor license info */}
        <div
          style={{
            marginTop: 14,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '16px 20px',
          }}
        >
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-1)' }}>
            Estado de Windsor.ai
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 8 }}>
            EcomBuild Analytics usa Windsor.ai como conector de datos. Tus cuentas de TikTok Ads
            están conectadas (BEAUTY 0001-003, WEB STORE 01-04). Para activar datos reales:
          </p>
          <ol
            style={{
              fontSize: 12,
              color: 'var(--text-2)',
              lineHeight: 2,
              paddingLeft: 18,
            }}
          >
            <li>Renueva o activa tu licencia en windsor.ai/pricing</li>
            <li>
              Copia tu API key del panel de Windsor y agrégala a{' '}
              <code
                className="mono"
                style={{ background: 'var(--bg-page)', padding: '1px 5px', borderRadius: 3 }}
              >
                .env.local
              </code>{' '}
              como{' '}
              <code
                className="mono"
                style={{ background: 'var(--bg-page)', padding: '1px 5px', borderRadius: 3 }}
              >
                WINDSOR_API_KEY=...
              </code>
            </li>
            <li>Para Meta Ads, conecta la cuenta Facebook en el panel de Windsor</li>
            <li>Reinicia el servidor de desarrollo</li>
          </ol>
        </div>
      </main>
    </>
  )
}
