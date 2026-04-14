export interface WindsorRawRow {
  ad_name?: string | null
  campaign_name?: string | null
  adset_name?: string | null
  spend?: number | null
  impressions?: number | null
  clicks?: number | null
  ctr?: number | null
  cpm?: number | null
  cpc?: number | null
  frequency?: number | null
  purchase?: number | null
  purchase_value?: number | null
  cost_per_purchase?: number | null
  purchase_roas?: number | null
  reach?: number | null
  video_play_actions?: number | null
  date?: string | null
  account_id?: string | null
  [key: string]: unknown
}

export interface WindsorRequest {
  connector: 'facebook' | 'tiktok' | 'instagram'
  account_id?: string
  account_ids?: string[]
  date_from: string
  date_to: string
  fields: string[]
  breakdown?: 'campaign' | 'adset' | 'ad' | 'day'
}

export interface WindsorResponse {
  data: WindsorRawRow[]
  status?: string
  error?: string
}

export interface WindsorAccountData {
  accountId: string
  accountName: string
  platform: 'meta' | 'tiktok' | 'instagram'
  data: WindsorRawRow[]
  error?: string | null
}
