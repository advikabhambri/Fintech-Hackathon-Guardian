import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TradingAction {
  id: string
  type: 'buy' | 'sell' | 'trade'
  asset: string
  amount: number
  timestamp: number
  emotionalScore?: number
}

export interface RiskAlert {
  id: string
  type: 'impulse' | 'volatility' | 'risk' | 'timing'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: number
  dismissed: boolean
}

export interface PortfolioRisk {
  overallRisk: number // 0-100
  volatilityLevel: 'low' | 'medium' | 'high' | 'extreme'
  diversificationScore: number // 0-100
  emotionalTradingIndicator: number // 0-100
}

interface CalmModeState {
  isEnabled: boolean
  recentActions: TradingAction[]
  activeAlerts: RiskAlert[]
  portfolioRisk: PortfolioRisk
  settings: {
    impulseThreshold: number // seconds between trades
    volatilityAlertLevel: number // 0-100
    riskToleranceLevel: number // 0-100
    showRealityChecks: boolean
  }
  
  // Actions
  toggleCalmMode: () => void
  setEnabled: (enabled: boolean) => void
  addTradingAction: (action: Omit<TradingAction, 'id' | 'timestamp'>) => void
  addAlert: (alert: Omit<RiskAlert, 'id' | 'timestamp' | 'dismissed'>) => void
  dismissAlert: (alertId: string) => void
  updatePortfolioRisk: (risk: Partial<PortfolioRisk>) => void
  updateSettings: (settings: Partial<CalmModeState['settings']>) => void
  analyzeEmotionalState: () => 'calm' | 'cautious' | 'emotional' | 'panicked'
  shouldBlockAction: (actionType: string) => { blocked: boolean; reason?: string }
}

export const useCalmModeStore = create<CalmModeState>()(
  persist(
    (set, get) => ({
      isEnabled: true,
      recentActions: [],
      activeAlerts: [],
      portfolioRisk: {
        overallRisk: 45,
        volatilityLevel: 'medium',
        diversificationScore: 70,
        emotionalTradingIndicator: 20,
      },
      settings: {
        impulseThreshold: 300, // 5 minutes
        volatilityAlertLevel: 60,
        riskToleranceLevel: 70,
        showRealityChecks: true,
      },

      toggleCalmMode: () => set((state) => ({ isEnabled: !state.isEnabled })),

      setEnabled: (enabled) => set({ isEnabled: enabled }),

      addTradingAction: (action) => {
        const newAction: TradingAction = {
          ...action,
          id: `action_${Date.now()}_${Math.random()}`,
          timestamp: Date.now(),
        }

        set((state) => {
          // Keep only last 20 actions
          const updatedActions = [newAction, ...state.recentActions].slice(0, 20)

          // Analyze for impulse trading
          if (state.isEnabled) {
            const recentTrades = updatedActions.filter(
              (a) => Date.now() - a.timestamp < state.settings.impulseThreshold * 1000
            )

            if (recentTrades.length > 3) {
              // Rapid trading detected
              const impulseAlert: RiskAlert = {
                id: `alert_${Date.now()}`,
                type: 'impulse',
                severity: 'high',
                message: `🚨 Impulse Alert: ${recentTrades.length} trades in ${Math.round(state.settings.impulseThreshold / 60)} minutes. Take a breath!`,
                timestamp: Date.now(),
                dismissed: false,
              }
              return {
                recentActions: updatedActions,
                activeAlerts: [impulseAlert, ...state.activeAlerts].slice(0, 10),
              }
            }
          }

          return { recentActions: updatedActions }
        })
      },

      addAlert: (alert) => {
        const newAlert: RiskAlert = {
          ...alert,
          id: `alert_${Date.now()}_${Math.random()}`,
          timestamp: Date.now(),
          dismissed: false,
        }

        set((state) => ({
          activeAlerts: [newAlert, ...state.activeAlerts].slice(0, 10),
        }))
      },

      dismissAlert: (alertId) => {
        set((state) => ({
          activeAlerts: state.activeAlerts.map((alert) =>
            alert.id === alertId ? { ...alert, dismissed: true } : alert
          ),
        }))
      },

      updatePortfolioRisk: (risk) => {
        set((state) => ({
          portfolioRisk: { ...state.portfolioRisk, ...risk },
        }))

        // Check if risk exceeds threshold
        const state = get()
        if (state.isEnabled && risk.overallRisk && risk.overallRisk > state.settings.riskToleranceLevel) {
          state.addAlert({
            type: 'risk',
            severity: risk.overallRisk > 85 ? 'critical' : 'high',
            message: `⚠️ Risk Alert: Portfolio risk at ${risk.overallRisk}%. Consider rebalancing.`,
          })
        }
      },

      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }))
      },

      analyzeEmotionalState: () => {
        const state = get()
        const recentActions = state.recentActions.filter(
          (a) => Date.now() - a.timestamp < 3600000 // Last hour
        )

        const actionCount = recentActions.length
        const { emotionalTradingIndicator } = state.portfolioRisk

        if (actionCount > 10 || emotionalTradingIndicator > 70) {
          return 'panicked'
        } else if (actionCount > 5 || emotionalTradingIndicator > 50) {
          return 'emotional'
        } else if (actionCount > 2 || emotionalTradingIndicator > 30) {
          return 'cautious'
        }
        return 'calm'
      },

      shouldBlockAction: (actionType: string) => {
        const state = get()
        if (!state.isEnabled) {
          return { blocked: false }
        }

        const emotionalState = state.analyzeEmotionalState()
        const recentActions = state.recentActions.filter(
          (a) => Date.now() - a.timestamp < state.settings.impulseThreshold * 1000
        )

        // Block if too many recent actions
        if (recentActions.length >= 5) {
          return {
            blocked: true,
            reason: `You've made ${recentActions.length} trades recently. Please wait ${Math.round(state.settings.impulseThreshold / 60)} minutes before trading again.`,
          }
        }

        // Warn on emotional state
        if (emotionalState === 'panicked' || emotionalState === 'emotional') {
          return {
            blocked: true,
            reason: `Your trading pattern suggests emotional decision-making. Take a 15-minute break to review your strategy.`,
          }
        }

        // Check portfolio risk
        if (state.portfolioRisk.overallRisk > state.settings.riskToleranceLevel && actionType === 'buy') {
          return {
            blocked: false, // Don't block, but warn
            reason: `Portfolio risk is elevated (${state.portfolioRisk.overallRisk}%). Consider if this trade aligns with your risk tolerance.`,
          }
        }

        return { blocked: false }
      },
    }),
    {
      name: 'calm-mode-storage',
      partialize: (state) => ({
        isEnabled: state.isEnabled,
        settings: state.settings,
        // Don't persist alerts and actions
      }),
    }
  )
)
