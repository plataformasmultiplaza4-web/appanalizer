// Meta Ads Accounts (ready for when Facebook connector is configured in Windsor)
export const META_AD_ACCOUNTS = {
  batana: { id: 'act_1052690562464770', name: 'Batana', cuenta: 4, platform: 'meta' as const },
  txcream: { id: 'act_396896536150037', name: 'TX Cream', cuenta: 2, platform: 'meta' as const },
  ct: { id: 'act_1228692581744330', name: 'CT/Andromeda', cuenta: 8, platform: 'meta' as const },
  magnesium: { id: 'act_208998058902872', name: 'Magnesium', cuenta: 5, platform: 'meta' as const },
  cuenta6: { id: 'act_424317810627325', name: 'Cuenta 6', cuenta: 6, platform: 'meta' as const },
  ciara: { id: 'act_1386420186043993', name: 'CIARA', cuenta: 10, platform: 'meta' as const },
} as const

// TikTok Accounts (currently connected in Windsor)
export const TIKTOK_AD_ACCOUNTS = {
  beauty001: { id: '7516620843737464849', name: 'BEAUTY 0001', platform: 'tiktok' as const },
  beauty002: { id: '7543688366240727057', name: 'BEAUTY 002', platform: 'tiktok' as const },
  beauty003: { id: '7543689203469811729', name: 'BEAUTY 003', platform: 'tiktok' as const },
  webstore01: { id: '7516621966565064721', name: 'WEB STORE 01', platform: 'tiktok' as const },
  webstore02: { id: '7516621199892299784', name: 'WEB STORE 02', platform: 'tiktok' as const },
  webstore03: { id: '7555146360773754897', name: 'WEB STORE 03', platform: 'tiktok' as const },
  webstore04: { id: '7555146426158825473', name: 'WEB STORE 04', platform: 'tiktok' as const },
} as const

// CPA objectives per product (in Peruvian Soles)
export const CPA_OBJETIVOS: Record<string, number> = {
  batana: 35,
  txcream: 35,
  'tx cream': 35,
  aura: 30,
  magnesium: 28,
  ptl: 40,
  kreain: 35,
  dermabee: 38,
  nova: 32,
  deepcollagen: 36,
  'deep collagen': 36,
  ptlserum: 38,
  'ptl serum': 38,
}

export const DEFAULT_CPA_OBJETIVO = 35

// Saturation thresholds per CT 1.0 methodology
export const SATURATION_THRESHOLDS = {
  frecuencia_alerta: 2.5,
  frecuencia_critica: 3.0,
  ctr_drop_pct: 0.20,    // 20% drop = burned hook
  cpa_rise_pct: 0.20,    // 20% rise = review landing
  min_ventas_winner: 5,  // min purchases to classify
  days_to_confirm: 7,    // days without improvement = pause
  roas_escalar: 2.5,
  roas_monitorear: 1.5,
}

// Windsor fields for Meta Ads
export const WINDSOR_META_FIELDS = [
  'campaign_name', 'adset_name', 'ad_name',
  'spend', 'impressions', 'clicks', 'ctr',
  'cpm', 'cpc', 'frequency',
  'purchase', 'purchase_value',
  'cost_per_purchase', 'purchase_roas',
  'reach', 'video_play_actions',
]

// Windsor fields for TikTok
export const WINDSOR_TIKTOK_FIELDS = [
  'campaign_name', 'adset_name', 'ad_name',
  'spend', 'impressions', 'clicks', 'ctr',
  'cpm', 'cpc', 'frequency',
  'purchase', 'purchase_value',
  'cost_per_purchase', 'purchase_roas',
  'reach',
]

// Product colors for thumbnails
export const PRODUCT_COLORS: Record<string, string> = {
  batana: '#7C3AED',
  txcream: '#0EA5E9',
  'tx cream': '#0EA5E9',
  aura: '#EC4899',
  magnesium: '#10B981',
  ptl: '#F59E0B',
  kreain: '#EF4444',
  dermabee: '#F97316',
  nova: '#6366F1',
  deepcollagen: '#8B5CF6',
  'deep collagen': '#8B5CF6',
  ptlserum: '#14B8A6',
  'ptl serum': '#14B8A6',
}

// Product display names
export const PRODUCT_NAMES: Record<string, string> = {
  batana: 'Batana',
  txcream: 'TX Cream',
  aura: 'Aura',
  magnesium: 'Magnesium',
  ptl: 'PTL',
  kreain: 'Kreain',
  dermabee: 'Dermabee',
  nova: 'Nova',
  deepcollagen: 'Deep Collagen',
  ptlserum: 'PTL Serum',
}

// Editors assignment
export const EDITORES = {
  ytalo: { name: 'Ytalo', productos_f1: ['txcream', 'deepcollagen'] },
  manuel: { name: 'Manuel', productos_f1: ['kreain', 'aura', 'magnesium', 'ptl'] },
  cesar: { name: 'César', productos_f2: ['dermabee', 'txcream', 'deepcollagen'], max_videos: 7 },
}
