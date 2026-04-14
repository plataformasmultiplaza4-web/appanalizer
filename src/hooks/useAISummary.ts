'use client'

import { useState, useCallback } from 'react'
import type { AISummaryData, Creative } from '@/types/metrics'
import type { DateRange } from '@/types/dashboard'
import { getDateRange } from '@/lib/utils'
import { MOCK_AI_SUMMARY } from '@/lib/mock-data'

interface AISummaryResult {
  summary: AISummaryData | null
  isLoading: boolean
  error: string | null
  generatedAt: Date | null
  analyze: (creatives: Creative[], dateRange: DateRange) => Promise<void>
  reset: () => void
}

export function useAISummary(): AISummaryResult {
  const [summary, setSummary] = useState<AISummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null)

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  const analyze = useCallback(
    async (creatives: Creative[], dateRange: DateRange) => {
      setIsLoading(true)
      setError(null)

      try {
        const { from, to } = getDateRange(dateRange)

        const res = await fetch('/api/ai-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metricsData: creatives.slice(0, 20), // top 20 creatives
            dateRange: { from, to },
            demo: isDemoMode,
          }),
        })

        const data = await res.json()

        if (data.error) {
          // Fallback to mock if Claude not configured
          if (data.error.includes('ANTHROPIC_API_KEY')) {
            setSummary(MOCK_AI_SUMMARY)
            setGeneratedAt(new Date())
            return
          }
          throw new Error(data.error)
        }

        setSummary(data.summary)
        setGeneratedAt(new Date())
      } catch (err) {
        setError(String(err))
        // Fallback to demo on error
        setSummary(MOCK_AI_SUMMARY)
        setGeneratedAt(new Date())
      } finally {
        setIsLoading(false)
      }
    },
    [isDemoMode],
  )

  const reset = useCallback(() => {
    setSummary(null)
    setError(null)
    setGeneratedAt(null)
  }, [])

  return { summary, isLoading, error, generatedAt, analyze, reset }
}
