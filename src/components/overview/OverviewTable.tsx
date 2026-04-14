'use client'

import type { AccountMetrics } from '@/types/metrics'
import { StatusPill } from '@/components/ui/StatusPill'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency, formatRoas, getCpaColor, getRoasColor, getProgressColor } from '@/lib/utils'

interface OverviewTableProps {
  accounts: AccountMetrics[]
  isLoading?: boolean
}

function AccountStatusBadge({ status }: { status: AccountMetrics['status'] }) {
  const cfg = {
    Activo: { bg: '#D1FAE5', color: '#065F46' },
    Pausado: { bg: '#F3F4F6', color: '#6B7280' },
    Alerta: { bg: '#FEE2E2', color: '#991B1B' },
  }[status]

  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 20,
        background: cfg.bg,
        color: cfg.color,
        fontSize: 10,
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  )
}

export function OverviewTable({ accounts, isLoading = false }: OverviewTableProps) {
  if (isLoading) {
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
          <Skeleton height={13} width={160} />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 16 }}
          >
            <Skeleton height={10} width={120} />
            <Skeleton height={10} width={80} />
            <Skeleton height={10} width={80} />
            <Skeleton height={10} width={60} />
          </div>
        ))}
      </div>
    )
  }

  const totalGasto = accounts.reduce((s, a) => s + a.totalGasto, 0)
  const totalVentas = accounts.reduce((s, a) => s + a.ventas, 0)
  const totalCpa = totalVentas > 0 ? totalGasto / totalVentas : 0

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect width="9" height="9" x="2" y="2" rx="2" fill="#6366F1" />
          <rect width="9" height="9" x="13" y="2" rx="2" fill="#818CF8" />
          <rect width="9" height="9" x="2" y="13" rx="2" fill="#818CF8" />
          <rect width="9" height="9" x="13" y="13" rx="2" fill="#6366F1" />
        </svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
          Resumen por Cuenta
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          {accounts.length} cuentas activas
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {[
                'Cuenta',
                'Plataforma',
                'Gasto Meta',
                'Gasto TikTok',
                'Total Gasto',
                '% Budget',
                'Restante',
                'Ventas',
                'CPA',
                'ROAS',
                'Estado',
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '8px 10px',
                    textAlign: h === 'Cuenta' || h === 'Plataforma' ? 'left' : 'right',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-3)',
                    background: 'var(--bg-page)',
                    borderBottom: '1px solid var(--border)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, idx) => (
              <AccountRow
                key={account.accountId}
                account={account}
                isLast={idx === accounts.length - 1}
              />
            ))}
            {/* Totals row */}
            <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--bg-page)' }}>
              <td colSpan={4} style={{ padding: '9px 10px', fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>
                TOTAL
              </td>
              <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: 'var(--brand)' }}>
                {formatCurrency(totalGasto)}
              </td>
              <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 11 }}>—</td>
              <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 11 }}>—</td>
              <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 700 }}>
                {totalVentas}
              </td>
              <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: getCpaColor(totalCpa, 35) }}>
                {formatCurrency(totalCpa)}
              </td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AccountRow({
  account,
  isLast,
}: {
  account: AccountMetrics
  isLast: boolean
}) {
  const DEFAULT_CPA_OBJ = 35

  return (
    <tr
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#FAFAFA' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      {/* Cuenta */}
      <td style={{ padding: '9px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap' }}>
        {account.accountName}
      </td>

      {/* Plataforma */}
      <td style={{ padding: '9px 10px' }}>
        <span
          style={{
            padding: '2px 7px',
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
            background: account.platform === 'tiktok' ? '#000' : '#1877F2',
            color: 'white',
          }}
        >
          {account.platform === 'tiktok' ? 'TikTok' : 'Meta'}
        </span>
      </td>

      {/* Gasto Meta */}
      <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, color: 'var(--text-3)' }}>
        {account.gastoMeta > 0 ? formatCurrency(account.gastoMeta) : '—'}
      </td>

      {/* Gasto TikTok */}
      <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, color: 'var(--text-2)' }}>
        {account.gastoTiktok > 0 ? formatCurrency(account.gastoTiktok) : '—'}
      </td>

      {/* Total Gasto */}
      <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--brand)' }}>
        {formatCurrency(account.totalGasto)}
      </td>

      {/* % Budget */}
      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
        {account.budgetPct > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
            <span style={{ fontSize: 11, color: getProgressColor(account.budgetPct), fontWeight: 600 }}>
              {account.budgetPct.toFixed(0)}%
            </span>
            <ProgressBar value={account.budgetPct} width={48} height={4} />
          </div>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>—</span>
        )}
      </td>

      {/* Restante */}
      <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 11, color: 'var(--text-2)' }}>
        {account.budgetRestante > 0 ? formatCurrency(account.budgetRestante) : '—'}
      </td>

      {/* Ventas */}
      <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
        {account.ventas}
      </td>

      {/* CPA */}
      <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 600 }}>
        <span style={{ color: getCpaColor(account.cpa, DEFAULT_CPA_OBJ) }}>
          {account.cpa > 0 ? formatCurrency(account.cpa) : '—'}
        </span>
      </td>

      {/* ROAS */}
      <td style={{ padding: '9px 10px', textAlign: 'right', fontSize: 12, fontWeight: 600 }}>
        <span style={{ color: getRoasColor(account.roas) }}>
          {account.roas > 0 ? formatRoas(account.roas) : '—'}
        </span>
      </td>

      {/* Estado */}
      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
        <AccountStatusBadge status={account.status} />
      </td>
    </tr>
  )
}
