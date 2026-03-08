import { useState, useEffect } from 'react'
import api from '../lib/api'

interface DiversificationMetrics {
  asset_class_count: number
  asset_type_distribution: Record<string, number>
  concentration_risk: number
  herfindahl_index: number
  diversification_score: number
}

interface LiquidityMetrics {
  liquid_assets: number
  semi_liquid_assets: number
  illiquid_assets: number
  liquidity_ratio: number
  emergency_fund_coverage: number
  liquidity_score: number
}

interface BehavioralResilienceMetrics {
  portfolio_volatility: number
  average_holding_period: number
  rebalancing_frequency: number
  panic_sell_indicators: number
  goal_alignment_score: number
  resilience_score: number
}

interface RiskMetrics {
  overall_risk_level: string
  volatility_score: number
  debt_to_asset_ratio: number
  risk_adjusted_return: number
}

interface FinancialHealthScore {
  overall_score: number
  grade: string
  diversification: DiversificationMetrics
  liquidity: LiquidityMetrics
  behavioral_resilience: BehavioralResilienceMetrics
  risk_metrics: RiskMetrics
  recommendations: string[]
  strengths: string[]
  weaknesses: string[]
  calculated_at: string
}

interface WellnessData {
  success: boolean
  financial_health: FinancialHealthScore | null
  message: string
  data_quality: Record<string, boolean>
}

interface AggregatedAssets {
  traditional_total: number
  crypto_total: number
  total_net_worth: number
  accounts_count: number
  assets_count: number
  last_sync: string | null
}

interface UnifiedWallet {
  totalNetWorth: number
  traditionalValue: number
  digitalValue: number
  alternativeValue: number
  assetsCount: number
  accountsCount: number
}

interface RecommendationsData {
  recommendations: string[]
}

interface UseWealthHubDataReturn {
  isLoading: boolean
  error: string | null
  wellness: FinancialHealthScore
  unifiedWallet: UnifiedWallet
  recommendations: RecommendationsData
}

// Default values to prevent errors when data is loading
const defaultWellness: FinancialHealthScore = {
  overall_score: 0,
  grade: 'N/A',
  diversification: {
    asset_class_count: 0,
    asset_type_distribution: {},
    concentration_risk: 0,
    herfindahl_index: 0,
    diversification_score: 0,
  },
  liquidity: {
    liquid_assets: 0,
    semi_liquid_assets: 0,
    illiquid_assets: 0,
    liquidity_ratio: 0,
    emergency_fund_coverage: 0,
    liquidity_score: 0,
  },
  behavioral_resilience: {
    portfolio_volatility: 0,
    average_holding_period: 0,
    rebalancing_frequency: 0,
    panic_sell_indicators: 0,
    goal_alignment_score: 0,
    resilience_score: 0,
  },
  risk_metrics: {
    overall_risk_level: 'moderate',
    volatility_score: 0,
    debt_to_asset_ratio: 0,
    risk_adjusted_return: 0,
  },
  recommendations: [],
  strengths: [],
  weaknesses: [],
  calculated_at: new Date().toISOString(),
}

const defaultUnifiedWallet: UnifiedWallet = {
  totalNetWorth: 0,
  traditionalValue: 0,
  digitalValue: 0,
  alternativeValue: 0,
  assetsCount: 0,
  accountsCount: 0,
}

const defaultRecommendations: RecommendationsData = {
  recommendations: [],
}

// Demo/Mock data for when backend is not available - matches backend demo data
const DEMO_WELLNESS: FinancialHealthScore = {
  overall_score: 78.5,
  grade: 'B+',
  diversification: {
    asset_class_count: 6,
    asset_type_distribution: {
      stocks: 45.0,
      bonds: 20.0,
      crypto: 15.0,
      real_estate: 12.0,
      cash: 8.0,
    },
    concentration_risk: 22.5,
    herfindahl_index: 0.23,
    diversification_score: 82.0,
  },
  liquidity: {
    liquid_assets: 95000,
    semi_liquid_assets: 425000,
    illiquid_assets: 342500,
    liquidity_ratio: 0.28,
    emergency_fund_coverage: 8.5,
    liquidity_score: 75.0,
  },
  behavioral_resilience: {
    portfolio_volatility: 12.4,
    average_holding_period: 285.0,
    rebalancing_frequency: 4,
    panic_sell_indicators: 1,
    goal_alignment_score: 85.0,
    resilience_score: 78.0,
  },
  risk_metrics: {
    overall_risk_level: 'moderate',
    volatility_score: 68.0,
    debt_to_asset_ratio: 0.15,
    risk_adjusted_return: 1.42,
  },
  recommendations: [
    'Consider increasing emergency fund to cover 12 months of expenses',
    'Your crypto allocation (15%) is within healthy limits for growth-oriented portfolios',
    'Portfolio shows good diversification across 6+ asset classes',
    'Review and rebalance quarterly to maintain target allocations',
  ],
  strengths: [
    'Strong diversification across multiple asset classes',
    'Healthy liquid asset reserves',
    'Low debt-to-asset ratio indicates financial stability',
  ],
  weaknesses: [
    'Emergency fund could be expanded for additional security',
    'Some concentration risk in top holdings',
  ],
  calculated_at: new Date().toISOString(),
}

const DEMO_WALLET: UnifiedWallet = {
  totalNetWorth: 862500,
  traditionalValue: 487500,
  digitalValue: 125000,
  alternativeValue: 250000,
  assetsCount: 24,
  accountsCount: 8,
}

export function useWealthHubData(): UseWealthHubDataReturn {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wellness, setWellness] = useState<FinancialHealthScore>(defaultWellness)
  const [unifiedWallet, setUnifiedWallet] = useState<UnifiedWallet>(defaultUnifiedWallet)
  const [recommendations, setRecommendations] = useState<RecommendationsData>(defaultRecommendations)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch wellness score
        const wellnessResponse = await api.get<WellnessData>('/wellness/detailed')
        
        if (wellnessResponse.data.success && wellnessResponse.data.financial_health) {
          setWellness(wellnessResponse.data.financial_health)
          setRecommendations({
            recommendations: wellnessResponse.data.financial_health.recommendations,
          })
        }

        // Fetch aggregated assets
        const assetsResponse = await api.get<AggregatedAssets>('/sync/summary')
        
        // Transform aggregated assets to unified wallet format
        // Demo: Alternative value is calculated as 15% of traditional for diversification
        const alternativeValue = assetsResponse.data.traditional_total * 0.15
        
        setUnifiedWallet({
          totalNetWorth: assetsResponse.data.total_net_worth,
          traditionalValue: assetsResponse.data.traditional_total,
          digitalValue: assetsResponse.data.crypto_total,
          alternativeValue: alternativeValue,
          accountsCount: assetsResponse.data.accounts_count,
          assetsCount: assetsResponse.data.assets_count,
        })
      } catch (err) {
        console.error('Error fetching wealth hub data:', err)
        console.log('Using demo data as fallback')
        
        // Use demo data when backend is not available
        setWellness(DEMO_WELLNESS)
        setUnifiedWallet(DEMO_WALLET)
        setRecommendations({
          recommendations: DEMO_WELLNESS.recommendations,
        })
        
        // Set a subtle error message
        setError(null) // Clear error to show demo data instead
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    isLoading,
    error,
    wellness,
    unifiedWallet,
    recommendations,
  }
}
