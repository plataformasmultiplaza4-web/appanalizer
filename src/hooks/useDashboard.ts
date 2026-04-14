'use client'

import { create } from 'zustand'
import type { DateRange, DashboardState } from '@/types/dashboard'

interface DashboardStore extends DashboardState {
  setActiveTab: (tab: string) => void
  setDateRange: (range: DateRange) => void
  setSelectedKPI: (kpi: string | null) => void
  setIsAnalyzing: (v: boolean) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  activeTab: 'dash1',
  dateRange: '7d',
  filters: {
    accounts: [],
    products: [],
    platforms: ['tiktok'],
  },
  isAnalyzing: false,
  selectedKPI: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setDateRange: (range) => set({ dateRange: range }),
  setSelectedKPI: (kpi) => set({ selectedKPI: kpi }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
}))
