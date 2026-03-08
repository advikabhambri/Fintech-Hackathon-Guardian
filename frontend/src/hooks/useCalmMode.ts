import { useEffect, useCallback } from 'react'
import { useCalmModeStore } from '../store/calmModeStore'
import { useWealthHubData } from './useWealthHubData'

export interface VolatilityData {
  level: number // 0-100
  trend: 'increasing' | 'stable' | 'decreasing'
  marketCondition: 'calm' | 'normal' | 'volatile' | 'extreme'
}

export const useCalmMode = () => {
  const {
    isEnabled,
    recentActions,
    activeAlerts,
    portfolioRisk,
    settings,
    addTradingAction,
    addAlert,
    dismissAlert,
    updatePortfolioRisk,
    analyzeEmotionalState,
    shouldBlockAction,
    toggleCalmMode,
    updateSettings,
  } = useCalmModeStore()

  const { wellness } = useWealthHubData()

  // Calculate real-time volatility from portfolio
  const calculateVolatility = useCallback((): VolatilityData => {
    // Use wellness data if available
    const volatilityScore = wellness?.risk_metrics?.volatility_score || 0

    let level = volatilityScore
    let marketCondition: VolatilityData['marketCondition'] = 'normal'

    if (level < 20) marketCondition = 'calm'
    else if (level < 50) marketCondition = 'normal'
    else if (level < 75) marketCondition = 'volatile'
    else marketCondition = 'extreme'

    // Simple trend detection based on recent actions
    const recentBuys = recentActions.filter(
      (a) => a.type === 'buy' && Date.now() - a.timestamp < 3600000
    ).length
    const trend = recentBuys > 5 ? 'increasing' : recentBuys > 2 ? 'stable' : 'decreasing'

    return { level, trend, marketCondition }
  }, [wellness, recentActions])

  // Monitor portfolio risk in real-time
  useEffect(() => {
    if (!isEnabled || !wellness) return

    const riskScore = Math.round(
      (wellness.risk_metrics?.volatility_score || 0) * 0.4 +
      (100 - (wellness.diversification?.diversification_score || 70)) * 0.3 +
      (100 - (wellness.liquidity?.liquidity_score || 70)) * 0.3
    )

    const volatilityLevel = 
      riskScore < 30 ? 'low' :
      riskScore < 60 ? 'medium' :
      riskScore < 80 ? 'high' : 'extreme'

    updatePortfolioRisk({
      overallRisk: riskScore,
      volatilityLevel,
      diversificationScore: wellness.diversification?.diversification_score || 70,
    })
  }, [wellness, isEnabled, updatePortfolioRisk])

  // Monitor for volatility spikes
  useEffect(() => {
    if (!isEnabled) return

    const volatility = calculateVolatility()
    
    if (volatility.level > settings.volatilityAlertLevel && volatility.marketCondition === 'extreme') {
      addAlert({
        type: 'volatility',
        severity: 'critical',
        message: `🛡️ Volatility Shield: Market volatility at ${volatility.level}%. High-risk trading environment detected.`,
      })
    } else if (volatility.level > settings.volatilityAlertLevel) {
      addAlert({
        type: 'volatility',
        severity: 'medium',
        message: `⚠️ Volatility Alert: Market conditions are ${volatility.marketCondition}. Exercise extra caution.`,
      })
    }
  }, [calculateVolatility, settings.volatilityAlertLevel, isEnabled, addAlert])

  // Reality check timer
  const checkTradingTiming = useCallback(() => {
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay()
    
    // Check if trading during off-hours
    if (hour < 9 || hour > 16) {
      return {
        isOptimal: false,
        message: '🕐 Timing Check: Trading outside market hours. Are you trading on emotion?',
      }
    }

    // Check if trading on weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        isOptimal: false,
        message: '📅 Weekend Trading: Markets are closed. Consider reviewing your strategy during the week.',
      }
    }

    // Check if too many recent actions
    const recentActions24h = recentActions.filter(
      (a) => Date.now() - a.timestamp < 86400000
    ).length

    if (recentActions24h > 10) {
      return {
        isOptimal: false,
        message: `📊 Activity Alert: ${recentActions24h} trades in 24 hours. High activity may indicate emotional trading.`,
      }
    }

    return { isOptimal: true, message: '' }
  }, [recentActions])

  // Execute trade with calm mode checks
  const executeTrade = useCallback(
    async (
      tradeData: { type: 'buy' | 'sell' | 'trade'; asset: string; amount: number },
      onProceed: () => Promise<void>
    ) => {
      if (!isEnabled) {
        await onProceed()
        return { success: true }
      }

      // Check if action should be blocked
      const blockCheck = shouldBlockAction(tradeData.type)
      
      if (blockCheck.blocked) {
        addAlert({
          type: 'impulse',
          severity: 'critical',
          message: blockCheck.reason || 'Trade blocked by Calm Mode',
        })
        return { success: false, blocked: true, reason: blockCheck.reason }
      }

      // Check timing
      const timingCheck = checkTradingTiming()
      if (!timingCheck.isOptimal && settings.showRealityChecks) {
        addAlert({
          type: 'timing',
          severity: 'medium',
          message: timingCheck.message,
        })
      }

      // Add warning if reason exists but not blocked
      if (blockCheck.reason) {
        addAlert({
          type: 'risk',
          severity: 'medium',
          message: blockCheck.reason,
        })
      }

      // Record the action
      addTradingAction(tradeData)

      // Execute the actual trade
      await onProceed()

      return { success: true, blocked: false }
    },
    [
      isEnabled,
      shouldBlockAction,
      checkTradingTiming,
      settings.showRealityChecks,
      addAlert,
      addTradingAction,
    ]
  )

  // Get active, non-dismissed alerts
  const getActiveAlerts = useCallback(() => {
    return activeAlerts.filter((alert) => !alert.dismissed)
  }, [activeAlerts])

  // Get emotional state analysis
  const getEmotionalAnalysis = useCallback(() => {
    const state = analyzeEmotionalState()
    const recentCount = recentActions.filter(
      (a) => Date.now() - a.timestamp < 3600000
    ).length

    return {
      state,
      recentTradeCount: recentCount,
      color: 
        state === 'calm' ? 'green' :
        state === 'cautious' ? 'yellow' :
        state === 'emotional' ? 'orange' : 'red',
      recommendation:
        state === 'calm' ? 'You\'re trading rationally. Good job!' :
        state === 'cautious' ? 'Stay mindful of your decisions.' :
        state === 'emotional' ? 'Take a break. Review your strategy.' :
        'Stop trading now. Come back tomorrow.',
    }
  }, [analyzeEmotionalState, recentActions])

  return {
    // State
    isEnabled,
    portfolioRisk,
    settings,
    
    // Computed
    volatility: calculateVolatility(),
    emotionalAnalysis: getEmotionalAnalysis(),
    activeAlerts: getActiveAlerts(),
    
    // Actions
    executeTrade,
    dismissAlert,
    toggleCalmMode,
    updateSettings,
    checkTradingTiming,
  }
}
