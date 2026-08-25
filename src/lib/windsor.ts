import type { WindsorRawRow, WindsorAccountData } from '@/types/windsor'
import type { Creative, AccountMetrics, KPIData, DayData, TransformedData } from '@/types/metrics'
import {
  extractProductKey,
  extractCode,
  getCpaObjective,
  classifyCreativeStatus,
  getProductColor,
  computeDelta,
} from './utils'
import {
  TIKTOK_AD_ACCOUNTS,
  WINDSOR_TIKTOK_FIELDS,
  META_AD_ACCOUNTS,
  WINDSOR_META_FIELDS,
} from './constants'

const WINDSOR_BASE = 'https://connectors.windsor.ai/all'

// ─── Windsor API Client ────────────────────────────────────────────────────

export async function fetchWindsorData(params: {
  connector: string
  accountIds?: string[]
  dateFrom: string
  dateTo: string
  fields: string[]
}): Promise<{ data: WindsorRawRow[]; error?: string }> {
  const apiKey =
    process.env.WINDSOR_API_KEY ?? process.env.NEXT_PUBLIC_WINDSOR_API_KEY
  if (!apiKey) {
    return { data: [], error: 'WINDSOR_API_KEY not configured' }
  }

  try {
    const allRows: WindsorRawRow[] = []

    // Windsor GET API: fetch per account_id (or once without filter)
    const accountIds = params.accountIds?.length ? params.accountIds : [undefined]

    for (const accountId of accountIds) {
      const url = new URL(WINDSOR_BASE)
      url.searchParams.set('api_key', apiKey)
      url.searchParams.set('date_from', params.dateFrom)
      url.searchParams.set('date_to', params.dateTo)
      url.searchParams.set('fields', params.fields.join(','))
      url.searchParams.set('connector', params.connector)
      if (accountId) url.searchParams.set('account_id', accountId)

      const res = await fetch(url.toString(), {
        method: 'GET',
        next: { revalidate: 300 },
      })

      if (!res.ok) {
        const text = await res.text()
        return { data: [], error: `Windsor API error ${res.status}: ${text}` }
      }

      const json = await res.json()

      // Detect expired license message
      if (json.data?.[0]?.ad_name?.includes('License expired')) {
        return { data: [], error: 'Windsor license expired. Renew at windsor.ai/pricing' }
      }

      const rows: WindsorRawRow[] = json.data ?? []
      // Tag rows with account_id if not already present
      if (accountId) {
        for (const row of rows) {
          if (!row.account_id) (row as Record<string, unknown>).account_id = accountId
        }
      }
      allRows.push(...rows)
    }

    return { data: allRows }
  } catch (err) {
    return { data: [], error: String(err) }
  }
}

export async function fetchAllTikTokAccounts(
  dateFrom: string,
  dateTo: string,
): Promise<WindsorAccountData[]> {
  const accounts = Object.values(TIKTOK_AD_ACCOUNTS)

  const { data, error } = await fetchWindsorData({
    connector: 'tiktok',
    accountIds: accounts.map((a) => a.id),
    dateFrom,
    dateTo,
    fields: WINDSOR_TIKTOK_FIELDS,
  })

  // Group by account_id
  const byAccount: Record<string, WindsorRawRow[]> = {}
  for (const row of data) {
    const accId = String(row.account_id ?? '')
    if (!byAccount[accId]) byAccount[accId] = []
    byAccount[accId].push(row)
  }

  return accounts.map((account) => ({
    accountId: account.id,
    accountName: account.name,
    platform: 'tiktok' as const,
    data: byAccount[account.id] ?? [],
    error: error ?? null,
  }))
}

export async function fetchAllMetaAccounts(
  dateFrom: string,
  dateTo: string,
): Promise<WindsorAccountData[]> {
  const accounts = Object.values(META_AD_ACCOUNTS)

  const { data, error } = await fetchWindsorData({
    connector: 'facebook',
    accountIds: accounts.map((a) => a.id),
    dateFrom,
    dateTo,
    fields: WINDSOR_META_FIELDS,
  })

  // Group by account_id
  const byAccount: Record<string, WindsorRawRow[]> = {}
  for (const row of data) {
    const accId = String(row.account_id ?? '')
    if (!byAccount[accId]) byAccount[accId] = []
    byAccount[accId].push(row)
  }

  return accounts.map((account) => ({
    accountId: account.id,
    accountName: account.name,
    platform: 'meta' as const,
    data: byAccount[account.id] ?? [],
    error: error ?? null,
  }))
}

// ─── Data Transformation ───────────────────────────────────────────────────

export function transformWindsorData(
  accountsData: WindsorAccountData[],
): TransformedData {
  const creatives: Creative[] = []
  const accountMetrics: AccountMetrics[] = []

  for (const accountData of accountsData) {
    const { accountId, accountName, platform, data } = accountData

    let accountGasto = 0
    let accountVentas = 0
    let accountRevenue = 0

    for (const row of data) {
      const spend = Number(row.spend) || 0
      const purchase = Number(row.purchase) || 0
      const purchaseValue = Number(row.purchase_value) || purchase * 35 // fallback estimate
      const cpa = purchase > 0 ? spend / purchase : 0
      const roas = spend > 0 ? purchaseValue / spend : 0
      const frecuencia = Number(row.frequency) || 0
      const ctr = Number(row.ctr) || 0
      const impressions = Number(row.impressions) || 0
      const clicks = Number(row.clicks) || 0
      const cpm = Number(row.cpm) || 0
      const cpc = Number(row.cpc) || 0
      const reach = Number(row.reach) || 0

      const adName = String(row.ad_name ?? '')
      const productKey = extractProductKey(adName)
      const cpaObjective = getCpaObjective(productKey)

      const status = classifyCreativeStatus({
        cpa,
        cpaObjective,
        roas,
        frecuencia,
        ventas: purchase,
      })

      accountGasto += spend
      accountVentas += purchase
      accountRevenue += purchaseValue

      creatives.push({
        id: `${accountId}-${adName}`,
        code: extractCode(adName),
        adName,
        product: productKey.charAt(0).toUpperCase() + productKey.slice(1),
        productKey,
        platform,
        accountId,
        accountName,
        ventas: purchase,
        ventasDelta: 0,
        cpa,
        cpaObjective,
        roas,
        gasto: spend,
        gastoDelta: 0,
        revenue: purchaseValue,
        budgetPct: 0,
        frecuencia,
        impressions,
        clicks,
        ctr,
        cpm,
        cpc,
        reach,
        status,
        thumbnailColor: getProductColor(productKey),
      })
    }

    accountMetrics.push({
      accountId,
      accountName,
      platform,
      gastoMeta: platform === 'meta' ? accountGasto : 0,
      gastoTiktok: platform === 'tiktok' ? accountGasto : 0,
      totalGasto: accountGasto,
      budgetTotal: 0,
      budgetPct: 0,
      budgetRestante: 0,
      ventas: accountVentas,
      cpa: accountVentas > 0 ? accountGasto / accountVentas : 0,
      roas: accountGasto > 0 ? accountRevenue / accountGasto : 0,
      status: 'Activo',
    })
  }

  // Sort by ventas descending
  creatives.sort((a, b) => b.ventas - a.ventas)

  // Compute aggregate KPIs
  const totalGasto = creatives.reduce((s, c) => s + c.gasto, 0)
  const totalVentas = creatives.reduce((s, c) => s + c.ventas, 0)
  const totalRevenue = creatives.reduce((s, c) => s + c.revenue, 0)
  const cpaPromedio = totalVentas > 0 ? totalGasto / totalVentas : 0
  const roasPromedio = totalGasto > 0 ? totalRevenue / totalGasto : 0
  const ctrPromedio =
    creatives.length > 0
      ? creatives.reduce((s, c) => s + c.ctr, 0) / creatives.length
      : 0
  const frecuenciaPromedio =
    creatives.length > 0
      ? creatives.reduce((s, c) => s + c.frecuencia, 0) / creatives.length
      : 0

  return {
    creatives,
    accounts: accountMetrics,
    kpis: {
      totalGasto,
      totalVentas,
      cpaPromedio,
      roasPromedio,
      ctrPromedio,
      frecuenciaPromedio,
    },
    dailyData: [],
  }
}

// Re-export computeDelta for use in hooks
export { computeDelta }
