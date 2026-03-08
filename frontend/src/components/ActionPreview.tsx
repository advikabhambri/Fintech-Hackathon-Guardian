import { motion } from 'framer-motion'
import { Target, ArrowRight, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface CompactAction {
  title: string
  category: string
  impact: 'high' | 'medium' | 'low'
  timeframe: string
}

interface ActionPreviewProps {
  wellness: {
    overall_score: number
    diversification: {
      concentration_risk: number
      asset_class_count: number
    }
    liquidity: {
      emergency_fund_coverage: number
      liquidity_ratio: number
    }
    behavioral_resilience: {
      panic_sell_indicators: number
      goal_alignment_score: number
    }
  }
}

function getTopActions(wellness: ActionPreviewProps['wellness']): CompactAction[] {
  const actions: CompactAction[] = []

  if (wellness.diversification.concentration_risk > 30) {
    actions.push({
      title: 'Reduce Concentration Risk',
      category: 'Diversification',
      impact: 'high',
      timeframe: '2-4 weeks',
    })
  }

  if (wellness.liquidity.emergency_fund_coverage < 6) {
    actions.push({
      title: 'Build Emergency Fund',
      category: 'Liquidity',
      impact: 'high',
      timeframe: '3-6 months',
    })
  }

  if (wellness.behavioral_resilience.goal_alignment_score < 70) {
    actions.push({
      title: 'Realign Portfolio with Goals',
      category: 'Strategic',
      impact: 'high',
      timeframe: '2-4 weeks',
    })
  }

  if (wellness.diversification.asset_class_count < 5) {
    actions.push({
      title: 'Expand Asset Class Diversity',
      category: 'Diversification',
      impact: 'medium',
      timeframe: '1-2 weeks',
    })
  }

  if (wellness.liquidity.liquidity_ratio < 0.2) {
    actions.push({
      title: 'Increase Liquid Assets',
      category: 'Liquidity',
      impact: 'medium',
      timeframe: '2-3 weeks',
    })
  }

  return actions.slice(0, 3)
}

function getImpactColor(impact: string) {
  switch (impact) {
    case 'high': return 'text-green-400 bg-green-500/20'
    case 'medium': return 'text-blue-400 bg-blue-500/20'
    case 'low': return 'text-slate-400 bg-slate-500/20'
    default: return 'text-slate-400 bg-slate-500/20'
  }
}

export default function ActionPreview({ wellness }: ActionPreviewProps) {
  const navigate = useNavigate()
  const topActions = getTopActions(wellness)

  if (topActions.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="inline-flex flex-col items-center rounded-xl bg-white/5 border border-white/10 px-5 py-4">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-3">
            <Target className="h-6 w-6 text-green-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">You're on track!</h3>
          <p className="text-xs text-slate-300 mb-3">Your portfolio looks great. Keep monitoring your progress.</p>
          <button
            onClick={() => navigate('/goals')}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            View Goals →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Top Priority Actions</h3>
        </div>
        <button
          onClick={() => navigate('/goals')}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-semibold"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Compact Action Cards */}
      <div className="space-y-3">
        {topActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate('/goals')}
            className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/30 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-blue-400">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white mb-1">{action.title}</h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">{action.category}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">⏱️ {action.timeframe}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(action.impact)}`}>
                {action.impact.toUpperCase()}
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/goals')}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 transition-colors group"
      >
        <Target className="h-4 w-4" />
        <span className="text-sm font-semibold">View Full Action Plan & Goals</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
