export type DateRange = '7d' | '14d' | '30d' | '90d'

export interface DashboardTab {
  id: string
  label: string
}

export interface DashboardFilter {
  accounts: string[]
  products: string[]
  platforms: ('meta' | 'tiktok')[]
}

export interface DashboardState {
  activeTab: string
  dateRange: DateRange
  filters: DashboardFilter
  isAnalyzing: boolean
  selectedKPI: string | null
}

export interface SourceConnection {
  id: string
  name: string
  platform: 'meta' | 'tiktok' | 'google' | 'shopify' | 'instagram' | 'tiktokshop'
  status: 'connected' | 'coming_soon' | 'error' | 'expired'
  accountCount?: number
  lastSync?: string
  errorMessage?: string
}
