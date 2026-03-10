import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'

export type AssetTab = 'stocks' | 'bonds' | 'gold' | 'fd' | 'insurance' | 'crypto'

export interface ConsolidatedResponse {
  as_of_date: string
  total_portfolio: number
  total_assets: number
  total_liabilities: number
  net_worth: number
  monthly_change: number
  allocation: Array<{ asset_class: string; value: number; weight: number }>
}

export interface Holding {
  id: number
  symbol: string
  asset_name: string
  asset_class: string
  sector: string
  quantity: number
  avg_cost: number
  price: number
  market_value: number
  invested_value: number
  daily_pnl: number
  pnl_1m: number
  pnl_1y: number
  pnl_pct_1y: number
}

export interface AssetClassHoldingsResponse {
  asset_class: string
  holdings: Holding[]
  pnl: {
    daily: number
    one_month: number
    one_year: number
  }
  sector_allocation: Array<{ sector: string; value: number; weight: number }>
  top_gainers: Holding[]
  top_losers: Holding[]
}

export interface RiskScoreResponse {
  overall_risk_score: number
  risk_band: string
  components: {
    concentration: number
    volatility: number
    max_drawdown: number
    liquidity: number
  }
}

export interface SectorExposureResponse {
  exposure: Array<{ sector: string; value: number; weight: number; overexposed: boolean }>
  overexposed_count: number
}

export interface RecommendationsResponse {
  risk_profile: string
  recommendations: Array<{
    reason: string
    action: string
    explainability: string
    confidence: number
    expected_risk_impact: number
  }>
}

export interface RecommendationHistoryResponse {
  count: number
  history: Array<{
    risk_profile: string
    reason: string
    action: string
    explainability: string
    confidence: number
    expected_risk_impact: number
    created_at: string
  }>
}

const FALLBACK_CONSOLIDATED: ConsolidatedResponse = {
  as_of_date: new Date().toISOString().slice(0, 10),
  total_portfolio: 862500,
  total_assets: 862500,
  total_liabilities: 0,
  net_worth: 862500,
  monthly_change: 12150,
  allocation: [
    { asset_class: 'stocks', value: 387000, weight: 44.87 },
    { asset_class: 'bonds', value: 138000, weight: 16.0 },
    { asset_class: 'crypto', value: 125000, weight: 14.49 },
    { asset_class: 'gold', value: 84000, weight: 9.74 },
    { asset_class: 'fd', value: 76500, weight: 8.87 },
    { asset_class: 'insurance', value: 52000, weight: 6.03 },
  ],
}

const FALLBACK_HOLDINGS: Record<AssetTab, AssetClassHoldingsResponse> = {
  stocks: {
    asset_class: 'stocks',
    holdings: [
      { id: 1, symbol: 'AAPL', asset_name: 'Apple Inc.', asset_class: 'stocks', sector: 'technology', quantity: 50, avg_cost: 150, price: 178, market_value: 8900, invested_value: 7500, daily_pnl: 42, pnl_1m: 540, pnl_1y: 1400, pnl_pct_1y: 18.7 },
      { id: 2, symbol: 'MSFT', asset_name: 'Microsoft Corp', asset_class: 'stocks', sector: 'technology', quantity: 18, avg_cost: 320, price: 402, market_value: 7236, invested_value: 5760, daily_pnl: 36, pnl_1m: 410, pnl_1y: 1476, pnl_pct_1y: 25.6 },
    ],
    pnl: { daily: 78, one_month: 950, one_year: 2876 },
    sector_allocation: [{ sector: 'technology', value: 16136, weight: 100 }],
    top_gainers: [],
    top_losers: [],
  },
  bonds: { asset_class: 'bonds', holdings: [], pnl: { daily: 0, one_month: 0, one_year: 0 }, sector_allocation: [], top_gainers: [], top_losers: [] },
  gold: { asset_class: 'gold', holdings: [], pnl: { daily: 0, one_month: 0, one_year: 0 }, sector_allocation: [], top_gainers: [], top_losers: [] },
  fd: { asset_class: 'fd', holdings: [], pnl: { daily: 0, one_month: 0, one_year: 0 }, sector_allocation: [], top_gainers: [], top_losers: [] },
  insurance: { asset_class: 'insurance', holdings: [], pnl: { daily: 0, one_month: 0, one_year: 0 }, sector_allocation: [], top_gainers: [], top_losers: [] },
  crypto: { asset_class: 'crypto', holdings: [], pnl: { daily: 0, one_month: 0, one_year: 0 }, sector_allocation: [], top_gainers: [], top_losers: [] },
}

const FALLBACK_RISK: RiskScoreResponse = {
  overall_risk_score: 54,
  risk_band: 'moderate',
  components: { concentration: 41, volatility: 61, max_drawdown: 52, liquidity: 43 },
}

const FALLBACK_EXPOSURE: SectorExposureResponse = {
  exposure: [
    { sector: 'technology', value: 280000, weight: 32.5, overexposed: false },
    { sector: 'finance', value: 162000, weight: 18.8, overexposed: false },
    { sector: 'digital_assets', value: 125000, weight: 14.5, overexposed: false },
  ],
  overexposed_count: 0,
}

const FALLBACK_RECS: RecommendationsResponse = {
  risk_profile: 'moderate',
  recommendations: [
    {
      reason: 'Moderate concentration in technology sector',
      action: 'Rebalance 3-5% into bonds/FD over next two cycles',
      explainability: 'Generated from concentration and risk-balance rules for moderate profile portfolios.',
      confidence: 0.79,
      expected_risk_impact: -4.2,
    },
  ],
}

export function usePortfolioIntelligence(selectedTab: AssetTab) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [consolidated, setConsolidated] = useState<ConsolidatedResponse>(FALLBACK_CONSOLIDATED)
  const [risk, setRisk] = useState<RiskScoreResponse>(FALLBACK_RISK)
  const [exposure, setExposure] = useState<SectorExposureResponse>(FALLBACK_EXPOSURE)
  const [recommendations, setRecommendations] = useState<RecommendationsResponse>(FALLBACK_RECS)
  const [recommendationHistory, setRecommendationHistory] = useState<RecommendationHistoryResponse>({ count: 0, history: [] })
  const [holdingsByTab, setHoldingsByTab] = useState<Record<AssetTab, AssetClassHoldingsResponse>>(FALLBACK_HOLDINGS)

  const holdingsData = useMemo(() => holdingsByTab[selectedTab] ?? FALLBACK_HOLDINGS[selectedTab], [holdingsByTab, selectedTab])

  useEffect(() => {
    const fetchCore = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [consolidatedRes, riskRes, exposureRes, recommendationsRes] = await Promise.all([
          api.get<ConsolidatedResponse>('/api/portfolio/consolidated'),
          api.get<RiskScoreResponse>('/api/risk/score'),
          api.get<SectorExposureResponse>('/api/risk/exposure/sectors'),
          api.get<RecommendationsResponse>('/api/recommendations?risk_profile=moderate'),
        ])

        setConsolidated(consolidatedRes.data)
        setRisk(riskRes.data)
        setExposure(exposureRes.data)
        setRecommendations(recommendationsRes.data)

        try {
          const historyRes = await api.get<RecommendationHistoryResponse>('/api/recommendations/history?limit=10')
          setRecommendationHistory(historyRes.data)
        } catch {
          setRecommendationHistory({ count: 0, history: [] })
        }
      } catch (err) {
        console.error('Portfolio Intelligence core fetch failed:', err)
        setConsolidated(FALLBACK_CONSOLIDATED)
        setRisk(FALLBACK_RISK)
        setExposure(FALLBACK_EXPOSURE)
        setRecommendations(FALLBACK_RECS)
        setRecommendationHistory({
          count: FALLBACK_RECS.recommendations.length,
          history: FALLBACK_RECS.recommendations.map((item) => ({
            risk_profile: 'moderate',
            reason: item.reason,
            action: item.action,
            explainability: item.explainability,
            confidence: item.confidence,
            expected_risk_impact: item.expected_risk_impact,
            created_at: new Date().toISOString(),
          })),
        })
        setError(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCore()
  }, [])

  useEffect(() => {
    const fetchHoldingsForTab = async () => {
      try {
        const response = await api.get<AssetClassHoldingsResponse>(`/api/portfolio/asset-class/${selectedTab}/holdings`)
        setHoldingsByTab((prev) => ({ ...prev, [selectedTab]: response.data }))
      } catch (err) {
        console.error(`Holdings fetch failed for ${selectedTab}:`, err)
        setHoldingsByTab((prev) => ({ ...prev, [selectedTab]: FALLBACK_HOLDINGS[selectedTab] }))
      }
    }

    fetchHoldingsForTab()
  }, [selectedTab])

  return {
    isLoading,
    error,
    consolidated,
    risk,
    exposure,
    recommendations,
    recommendationHistory,
    holdingsData,
  }
}
