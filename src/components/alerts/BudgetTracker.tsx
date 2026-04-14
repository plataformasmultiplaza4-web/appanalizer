'use client'

import { AlertTriangle, CheckCircle } from 'lucide-react'
import type { AccountMetrics } from '@/types/metrics'
import { formatCurrency, getProgressColor } from '@/lib/utils'

interface BudgetTrackerProps {
  accounts: AccountMetrics[]
}

export function BudgetTracker({ accounts }: BudgetTrackerProps) {
  const alerts = accounts.filter((a) => a.budgetPct >= 75).sort((a, b) => b.budgetPct - a.budgetPct)

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
        <AlertTriangle size={14} color="var(--warning)" />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
          Budget Tracker
        </span>
        {alerts.length > 0 && (
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 20,
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {alerts.length} alertas
          </span>
        )}
      </div>

      {/* Rows */}
      <div style={{ padding: '8px 0' }}>
        {accounts.length === 0 ? (
          <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text-3)', fontSize: 12 }}>
            Sin datos de presupuesto
          </div>
        ) : (
          accounts
            .sort((a, b) => b.budgetPct - a.budgetPct)
            .map((account) => (
              <BudgetRow key={account.accountId} account={account} />
            ))
        )}
      </div>
    </div>
  )
}

function BudgetRow({ account }: { account: AccountMetrics }) {
  const color = getProgressColor(account.budgetPct)
  const isAlert = account.budgetPct >= 75

  return (
    <div
      style={{
        padding: '8px 16px',
        borderBottom: '1px solid var(--border-light)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#FAFAFA' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Platform badge */}
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 3,
              fontSize: 9,
              fontWeight: 700,
              background: account.platform === 'tiktok' ? '#000' : '#1877F2',
              color: 'white',
              textTransform: 'uppercase',
            }}
          >
            {account.platform}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
            {account.accountName}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-2)' }}>
            {formatCurrency(account.totalGasto)}
          </span>
          {account.budgetTotal > 0 && (
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              / {formatCurrency(account.budgetTotal)}
            </span>
          )}
          {isAlert ? (
            <AlertTriangle size={14} color={color} />
          ) : (
            <CheckCircle size={14} color="var(--success)" />
          )}
        </div>
      </div>

      {/* Progress bar */}
      {account.budgetPct > 0 && (
        <div>
          <div
            style={{
              width: '100%',
              height: 6,
              background: 'var(--border-light)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(account.budgetPct, 100)}%`,
                height: '100%',
                background: color,
                borderRadius: 3,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 3,
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 600, color }}>
              {account.budgetPct.toFixed(0)}% utilizado
            </span>
            {account.budgetRestante > 0 && (
              <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
                Restante: {formatCurrency(account.budgetRestante)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
