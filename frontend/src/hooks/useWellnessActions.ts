import { useEffect, useMemo, useState } from 'react'

interface WellnessScoreResponse {
  success: boolean
  financial_health?: {
    liquidity?: {
      liquidity_ratio?: number
    }
  }
}

interface WellnessActionsState {
  liquidityRatio: number | null
  isLoading: boolean
  error: string | null
}

const LIQUIDITY_THRESHOLD = 0.2

export function useWellnessActions() {
  const [state, setState] = useState<WellnessActionsState>({
    liquidityRatio: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    const fetchWellnessScore = async () => {
      try {
        const apiUrl = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://localhost:8000'
        const token = localStorage.getItem('token')

        const response = await fetch(`${apiUrl}/api/wellness-score/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch wellness score (${response.status})`)
        }

        const payload: WellnessScoreResponse = await response.json()
        const liquidityRatio = payload.financial_health?.liquidity?.liquidity_ratio

        setState({
          liquidityRatio: typeof liquidityRatio === 'number' ? liquidityRatio : null,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        setState({
          liquidityRatio: null,
          isLoading: false,
          error: 'Unable to fetch wellness score',
        })
      }
    }

    fetchWellnessScore()

    return () => {
      controller.abort()
    }
  }, [])

  const shouldShowProactiveAction = useMemo(() => {
    return state.liquidityRatio !== null && state.liquidityRatio < LIQUIDITY_THRESHOLD
  }, [state.liquidityRatio])

  return {
    ...state,
    shouldShowProactiveAction,
    proactiveAction: {
      title: 'Proactive Action',
      recommendation: 'Liquidity is below 20%. Rebalance from private assets to cash to improve flexibility and emergency readiness.',
    },
  }
}
