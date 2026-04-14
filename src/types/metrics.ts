export type Platform = 'meta' | 'tiktok' | 'instagram'

export type CreativeStatus = 'ESCALAR' | 'MONITOREAR' | 'HOOK_SWAP' | 'PAUSAR'

export interface Creative {
  id: string
  code: string
  adName: string
  product: string
  productKey: string
  platform: Platform
  accountId: string
  accountName: string
  // Performance
  ventas: number
  ventasDelta: number       // % change vs previous period
  cpa: number
  cpaObjective: number
  roas: number
  gasto: number
  gastoDelta: number        // % change
  revenue: number
  // Budget
  budgetPct: number         // % of account budget used
  // Engagement
  frecuencia: number
  impressions: number
  clicks: number
  ctr: number
  cpm: number
  cpc: number
  reach: number
  // Classification
  status: CreativeStatus
  // Visual
  thumbnailColor: string
}

export interface AccountMetrics {
  accountId: string
  accountName: string
  cuenta?: number
  platform: Platform
  gastoMeta: number
  gastoTiktok: number
  totalGasto: number
  budgetTotal: number
  budgetPct: number
  budgetRestante: number
  ventas: number
  cpa: number
  roas: number
  status: 'Activo' | 'Pausado' | 'Alerta'
}

export interface KPIData {
  totalGasto: number
  totalVentas: number
  cpaPromedio: number
  roasPromedio: number
  ctrPromedio: number
  frecuenciaPromedio: number
  // Deltas vs previous period
  gastoDelta?: number
  ventasDelta?: number
  cpaDelta?: number
  roasDelta?: number
}

export interface DayData {
  day: string        // Full name: Lunes
  dayShort: string   // Short: Lun
  ventas: number
  gasto: number
  date: string
}

export interface TransformedData {
  creatives: Creative[]
  accounts: AccountMetrics[]
  kpis: KPIData
  dailyData: DayData[]
}

export interface AISummaryData {
  resumen_ejecutivo: string
  kpis: {
    total_spend: number
    total_ventas: number
    cpa_promedio: number
    roas_promedio: number
    mejor_cpa: { codigo: string; cpa: number; producto: string }
    peor_cpa: { codigo: string; cpa: number; producto: string }
  }
  winners_escalar: Array<{
    codigo: string
    producto: string
    ventas: number
    cpa: number
    roas: number
    frecuencia: number
    accion: string
    razon: string
  }>
  monitorear: Array<{
    codigo: string
    producto: string
    ventas: number
    cpa: number
    frecuencia: number
    alerta: string
    accion: string
  }>
  hook_swaps_urgentes: Array<{
    codigo: string
    producto: string
    frecuencia: number
    editor_asignado: string
    angulo_sugerido: string
    tipo: 'V1' | 'V2' | 'V3'
  }>
  pausar: Array<{
    codigo: string
    producto: string
    cpa: number
    frecuencia: number
    dias_sin_mejora: number
    razon: string
    redirigir_a: string
  }>
  acciones_hoy: Array<{
    prioridad: 'alta' | 'media' | 'baja'
    tipo: 'escalar' | 'pausar' | 'producir' | 'monitorear'
    accion: string
    responsable: string
  }>
  brief_editores: {
    ytalo: string
    manuel: string
    cesar: string
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}
