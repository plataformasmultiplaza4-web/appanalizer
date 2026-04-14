import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CPA_OBJETIVOS, DEFAULT_CPA_OBJETIVO, PRODUCT_COLORS, SATURATION_THRESHOLDS } from './constants'
import type { CreativeStatus } from '@/types/metrics'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatter (Peruvian Soles)
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Short currency (e.g. S/. 12.4K)
export function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000) {
    return `S/. ${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `S/. ${(value / 1_000).toFixed(1)}K`
  }
  return `S/. ${value.toFixed(0)}`
}

// Number formatter
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-PE').format(Math.round(value))
}

// Percent formatter
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

// Delta formatter (always shows sign)
export function formatDelta(value: number, isPercent = true): string {
  const sign = value >= 0 ? '+' : ''
  if (isPercent) return `${sign}${value.toFixed(1)}%`
  return `${sign}${value.toFixed(0)}`
}

// ROAS formatter
export function formatRoas(value: number): string {
  return `${value.toFixed(1)}x`
}

// Frequency formatter
export function formatFrequency(value: number): string {
  return value.toFixed(1)
}

// Extract product key from ad name
export function extractProductKey(adName: string): string {
  const lower = adName.toLowerCase()
  const products = [
    'batana', 'tx cream', 'txcream', 'aura', 'magnesium',
    'ptl serum', 'ptlserum', 'ptl', 'kreain', 'dermabee',
    'nova', 'deep collagen', 'deepcollagen',
  ]
  for (const p of products) {
    if (lower.includes(p)) return p.replace(' ', '')
  }
  return 'unknown'
}

// Extract creative code from ad name (e.g. "BATANA NEW 29" → "BATANA-29")
export function extractCode(adName: string): string {
  if (!adName || adName.length > 50) return adName?.slice(0, 20) ?? 'N/A'
  // Try to extract a meaningful short code
  const parts = adName.trim().split(/\s+/)
  if (parts.length >= 2) {
    const last = parts[parts.length - 1]
    const first = parts[0]
    return `${first} ${last}`.toUpperCase().slice(0, 20)
  }
  return adName.toUpperCase().slice(0, 20)
}

// Get CPA objective for a product key
export function getCpaObjective(productKey: string): number {
  return CPA_OBJETIVOS[productKey] ?? DEFAULT_CPA_OBJETIVO
}

// Classify creative status based on CT 1.0 methodology
export function classifyCreativeStatus(params: {
  cpa: number
  cpaObjective: number
  roas: number
  frecuencia: number
  ventas: number
  diasSinMejora?: number
}): CreativeStatus {
  const { cpa, cpaObjective, roas, frecuencia, ventas, diasSinMejora = 0 } = params
  const { min_ventas_winner, frecuencia_critica, frecuencia_alerta, cpa_rise_pct, days_to_confirm, roas_escalar } = SATURATION_THRESHOLDS

  // Not enough data
  if (ventas < min_ventas_winner) return 'MONITOREAR'

  // Immediate pause conditions
  if (frecuencia >= frecuencia_critica) return 'PAUSAR'
  if (cpa > cpaObjective * (1 + cpa_rise_pct * 1.5) && diasSinMejora >= days_to_confirm) return 'PAUSAR'

  // Hook swap conditions
  if (frecuencia >= frecuencia_alerta) return 'HOOK_SWAP'
  if (cpa > cpaObjective * (1 + cpa_rise_pct)) return 'HOOK_SWAP'

  // Winner conditions
  if (cpa <= cpaObjective && roas >= roas_escalar && frecuencia < 2.0) return 'ESCALAR'

  // Default monitor
  return 'MONITOREAR'
}

// Get CPA display color
export function getCpaColor(cpa: number, objective: number): string {
  if (cpa <= objective) return 'var(--success)'
  if (cpa <= objective * 1.2) return 'var(--warning)'
  return 'var(--danger)'
}

// Get ROAS display color
export function getRoasColor(roas: number): string {
  if (roas >= SATURATION_THRESHOLDS.roas_escalar) return 'var(--success)'
  if (roas >= SATURATION_THRESHOLDS.roas_monitorear) return 'var(--warning)'
  return 'var(--danger)'
}

// Get budget progress bar color
export function getProgressColor(pct: number): string {
  if (pct >= 100) return 'var(--danger)'
  if (pct >= 75) return 'var(--warning)'
  return 'var(--success)'
}

// Get frequency color
export function getFrecuenciaColor(frecuencia: number): string {
  if (frecuencia >= SATURATION_THRESHOLDS.frecuencia_critica) return 'var(--danger)'
  if (frecuencia >= SATURATION_THRESHOLDS.frecuencia_alerta) return 'var(--warning)'
  return 'var(--text-1)'
}

// Get product thumbnail color
export function getProductColor(productKey: string): string {
  return PRODUCT_COLORS[productKey] ?? '#6366F1'
}

// Format date range label
export function formatDateRangeLabel(range: string): string {
  const labels: Record<string, string> = {
    '7d': 'Últimos 7 días',
    '14d': 'Últimas 2 semanas',
    '30d': 'Este mes',
    '90d': 'Últimos 3 meses',
  }
  return labels[range] ?? range
}

// Get date range dates from range key
export function getDateRange(range: string): { from: string; to: string } {
  const to = new Date()
  const from = new Date()
  const days = parseInt(range) || 7
  from.setDate(from.getDate() - days)
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  }
}

// Compute delta percentage
export function computeDelta(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}
