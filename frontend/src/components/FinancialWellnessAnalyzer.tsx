import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle,
  Info,
  Target,
  Shield,
  Activity,
  BarChart3,
  Droplets,
  Brain,
  ChevronRight,
  Zap,
  Award,
} from 'lucide-react'

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

interface FinancialWellnessAnalyzerProps {
  overall_score: number
  grade: string
  diversification: DiversificationMetrics
  liquidity: LiquidityMetrics
  behavioral_resilience: BehavioralResilienceMetrics
  recommendations: string[]
  strengths: string[]
  weaknesses: string[]
}

type MetricTab = 'overview' | 'diversification' | 'liquidity' | 'resilience'

function formatCurrency(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

function getScoreColor(score: number) {
  if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-400' }
  if (score >= 65) return { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-400' }
  if (score >= 50) return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-400' }
  return { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-400' }
}

function getScoreLabel(score: number) {
  if (score >= 85) return { label: 'Exceptional', emoji: '🌟' }
  if (score >= 70) return { label: 'Strong', emoji: '💪' }
  if (score >= 55) return { label: 'Stable', emoji: '✅' }
  return { label: 'Needs Attention', emoji: '⚠️' }
}

export default function FinancialWellnessAnalyzer({
  overall_score,
  grade,
  diversification,
  liquidity,
  behavioral_resilience,
  recommendations,
  strengths,
  weaknesses,
}: FinancialWellnessAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<MetricTab>('overview')
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)
  const strengthsRef = useRef<HTMLDivElement | null>(null)
  const alertsRef = useRef<HTMLDivElement | null>(null)
  const actionsRef = useRef<HTMLDivElement | null>(null)

  const scrollToOverviewSection = (section: 'strengths' | 'alerts' | 'actions') => {
    const sectionMap = {
      strengths: strengthsRef,
      alerts: alertsRef,
      actions: actionsRef,
    }

    const scrollToTarget = () => {
      sectionMap[section].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if (activeTab !== 'overview') {
      setActiveTab('overview')
      setTimeout(scrollToTarget, 350)
      return
    }

    scrollToTarget()
  }

  const scoreData = getScoreLabel(overall_score)
  const scoreColors = getScoreColor(overall_score)

  const metrics = [
    {
      id: 'diversification',
      name: 'Diversification',
      score: diversification.diversification_score,
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      description: 'How well-spread your investments are across different asset classes',
    },
    {
      id: 'liquidity',
      name: 'Liquidity',
      score: liquidity.liquidity_score,
      icon: Droplets,
      color: 'from-emerald-500 to-teal-500',
      description: 'Your ability to quickly convert assets to cash without significant loss',
    },
    {
      id: 'resilience',
      name: 'Behavioral Resilience',
      score: behavioral_resilience.resilience_score,
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      description: 'Your emotional and strategic stability during market fluctuations',
    },
  ]

  const radius = 85
  const circumference = 2 * Math.PI * radius
  const progressOffset = circumference - (overall_score / 100) * circumference

  return (
    <div className="space-y-6">
      {/* Header with Overall Score */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-xl p-8"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-96 h-96 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${scoreColors.bg.replace('bg-', 'rgb(var(--tw-')} 0%, transparent 70%)`,
              filter: 'blur(60px)',
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          {/* Left side: Score Circle */}
          <div className="flex items-center gap-8">
            <div className="relative">
              <svg width="200" height="200" className="-rotate-90">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={scoreColors.text} />
                    <stop offset="100%" className="text-blue-600" />
                  </linearGradient>
                </defs>
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  className="text-slate-700/30"
                />
                {/* Animated progress circle */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={`rgb(${scoreColors.bg === 'bg-green-500' ? '34, 197, 94' : scoreColors.bg === 'bg-blue-500' ? '59, 130, 246' : scoreColors.bg === 'bg-amber-500' ? '245, 158, 11' : '239, 68, 68'})`}
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: progressOffset }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{
                    filter: 'drop-shadow(0 0 8px currentColor)',
                  }}
                />
              </svg>
              
              {/* Score Number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="text-center"
                >
                  <div className="text-6xl font-black text-white tracking-tight">
                    {overall_score.toFixed(0)}
                  </div>
                  <div className={`text-lg font-bold ${scoreColors.text} mt-1`}>
                    {grade}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Score Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{scoreData.emoji}</span>
                <h2 className="text-3xl font-bold text-white">{scoreData.label}</h2>
              </div>
              <p className="text-slate-300 text-sm mb-4">Financial Wellness Score</p>
              
              {/* Quick Stats */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => scrollToOverviewSection('strengths')}
                  className={`px-3 py-1.5 rounded-lg border ${scoreColors.border}/30 ${scoreColors.bg}/10 hover:bg-white/10 transition-colors text-left`}
                >
                  <p className="text-xs text-slate-400">Strengths</p>
                  <p className={`text-lg font-bold ${scoreColors.text}`}>{strengths.length}</p>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToOverviewSection('actions')}
                  className={`px-3 py-1.5 rounded-lg border ${scoreColors.border}/30 ${scoreColors.bg}/10 hover:bg-white/10 transition-colors text-left`}
                >
                  <p className="text-xs text-slate-400">Actions</p>
                  <p className={`text-lg font-bold ${scoreColors.text}`}>{recommendations.length}</p>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToOverviewSection('alerts')}
                  className={`px-3 py-1.5 rounded-lg border ${scoreColors.border}/30 ${scoreColors.bg}/10 hover:bg-white/10 transition-colors text-left`}
                >
                  <p className="text-xs text-slate-400">Alerts</p>
                  <p className={`text-lg font-bold ${scoreColors.text}`}>{weaknesses.length}</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right side: Award Badge */}
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <div className={`h-32 w-32 rounded-full ${scoreColors.bg}/20 border-4 ${scoreColors.border}/40 flex items-center justify-center backdrop-blur-sm`}>
              <Award className={`h-16 w-16 ${scoreColors.text}`} />
            </div>
            <motion.div
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="h-4 w-4 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview' as MetricTab, label: 'Overview', icon: Activity },
          { id: 'diversification' as MetricTab, label: 'Diversification', icon: BarChart3 },
          { id: 'liquidity' as MetricTab, label: 'Liquidity', icon: Droplets },
          { id: 'resilience' as MetricTab, label: 'Resilience', icon: Brain },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all
                ${activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </motion.button>
          )
        })}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((metric, index) => {
                  const Icon = metric.icon
                  const colors = getScoreColor(metric.score)
                  return (
                    <motion.div
                      key={metric.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onHoverStart={() => setHoveredMetric(metric.id)}
                      onHoverEnd={() => setHoveredMetric(null)}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl p-6 cursor-pointer"
                      style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      onClick={() => setActiveTab(metric.id as MetricTab)}
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${metric.color}/20 flex items-center justify-center border border-white/10`}>
                            <Icon className={`h-6 w-6 ${colors.text}`} />
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        </div>

                        {/* Metric Name */}
                        <h3 className="text-base font-semibold text-white mb-2">{metric.name}</h3>
                        <p className="text-xs text-slate-400 mb-4">{metric.description}</p>

                        {/* Score */}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-3xl font-black text-white">{metric.score.toFixed(0)}</p>
                            <p className="text-xs text-slate-400 mt-1">out of 100</p>
                          </div>
                          <div className={`px-2 py-1 rounded-lg ${colors.bg}/20 border ${colors.border}/30`}>
                            <p className={`text-xs font-bold ${colors.text}`}>
                              {metric.score >= 80 ? 'Excellent' : metric.score >= 65 ? 'Good' : metric.score >= 50 ? 'Fair' : 'Poor'}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.score}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                      </div>

                      {/* Hover glow effect */}
                      <motion.div
                        className={`absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br ${metric.color} blur-3xl`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredMetric === metric.id ? 0.3 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  )
                })}
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div
                  ref={strengthsRef}
                  className="rounded-2xl border border-green-400/20 backdrop-blur-xl p-6"
                  style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Strengths</h3>
                  </div>
                  <div className="space-y-2">
                    {strengths.map((strength, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-sm text-green-100 bg-green-500/10 rounded-lg p-3 border border-green-400/20"
                      >
                        <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-green-400" />
                        </div>
                        <p>{strength}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Weaknesses/Areas to Improve */}
                <div
                  ref={alertsRef}
                  className="rounded-2xl border border-amber-400/20 backdrop-blur-xl p-6"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                    <h3 className="text-lg font-semibold text-white">Areas to Improve</h3>
                  </div>
                  <div className="space-y-2">
                    {weaknesses.map((weakness, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-sm text-amber-100 bg-amber-500/10 rounded-lg p-3 border border-amber-400/20"
                      >
                        <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertCircle className="h-3 w-3 text-amber-400" />
                        </div>
                        <p>{weakness}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div
                ref={actionsRef}
                className="rounded-2xl border border-blue-400/20 backdrop-blur-xl p-6"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Recommended Actions</h3>
                </div>
                <div className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-sm text-blue-100 bg-blue-500/10 rounded-lg p-4 border border-blue-400/20 hover:bg-blue-500/20 transition-colors cursor-pointer group"
                    >
                      <div className="h-6 w-6 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-xs font-bold text-blue-400">{index + 1}</span>
                      </div>
                      <p className="flex-1">{recommendation}</p>
                      <ChevronRight className="h-5 w-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diversification' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
                <h3 className="text-xl font-bold text-white mb-6">Diversification Analysis</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/20">
                    <p className="text-xs text-blue-300 mb-2">Asset Classes</p>
                    <p className="text-3xl font-black text-white">{diversification.asset_class_count}</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-400/20">
                    <p className="text-xs text-purple-300 mb-2">Concentration Risk</p>
                    <p className="text-3xl font-black text-white">{diversification.concentration_risk.toFixed(0)}%</p>
                  </div>
                  <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-400/20">
                    <p className="text-xs text-cyan-300 mb-2">Herfindahl Index</p>
                    <p className="text-3xl font-black text-white">{diversification.herfindahl_index.toFixed(3)}</p>
                  </div>
                  <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-400/20">
                    <p className="text-xs text-emerald-300 mb-2">Diversity Score</p>
                    <p className="text-3xl font-black text-white">{diversification.diversification_score.toFixed(0)}</p>
                  </div>
                </div>

                {/* Asset Distribution */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Asset Type Distribution</h4>
                  <div className="space-y-3">
                    {Object.entries(diversification.asset_type_distribution).map(([type, percentage], index) => (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-300 capitalize">{type.replace('_', ' ')}</span>
                          <span className="text-sm font-bold text-white">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${
                              ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500'][index % 4]
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'liquidity' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
                <h3 className="text-xl font-bold text-white mb-6">Liquidity Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-emerald-500/10 rounded-xl p-5 border border-emerald-400/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplets className="h-5 w-5 text-emerald-400" />
                      <p className="text-xs text-emerald-300 font-semibold">Liquid Assets</p>
                    </div>
                    <p className="text-3xl font-black text-white mb-2">{formatCurrency(liquidity.liquid_assets)}</p>
                    <div className="h-2 bg-emerald-900/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplets className="h-5 w-5 text-cyan-400" />
                      <p className="text-xs text-cyan-300 font-semibold">Semi-Liquid Assets</p>
                    </div>
                    <p className="text-3xl font-black text-white mb-2">{formatCurrency(liquidity.semi_liquid_assets)}</p>
                    <div className="h-2 bg-cyan-900/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-500/10 rounded-xl p-5 border border-slate-400/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplets className="h-5 w-5 text-slate-400" />
                      <p className="text-xs text-slate-300 font-semibold">Illiquid Assets</p>
                    </div>
                    <p className="text-3xl font-black text-white mb-2">{formatCurrency(liquidity.illiquid_assets)}</p>
                    <div className="h-2 bg-slate-900/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-slate-500 to-slate-600"
                        initial={{ width: 0 }}
                        animate={{ width: '40%' }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-slate-400 mb-2">Liquidity Ratio</p>
                    <p className="text-4xl font-black text-white mb-2">{(liquidity.liquidity_ratio * 100).toFixed(1)}%</p>
                    <p className="text-xs text-slate-400">
                      {liquidity.liquidity_ratio >= 0.3 ? '✅ Healthy liquidity position' : '⚠️ Consider increasing liquid assets'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-slate-400 mb-2">Emergency Fund Coverage</p>
                    <p className="text-4xl font-black text-white mb-2">{liquidity.emergency_fund_coverage.toFixed(1)}x</p>
                    <p className="text-xs text-slate-400">
                      {liquidity.emergency_fund_coverage >= 6 ? '✅ Excellent coverage' : '⚠️ Aim for 6+ months'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resilience' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
                <h3 className="text-xl font-bold text-white mb-6">Behavioral Resilience Analysis</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-400/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <p className="text-xs text-purple-300">Portfolio Volatility</p>
                    </div>
                    <p className="text-2xl font-black text-white">{behavioral_resilience.portfolio_volatility.toFixed(1)}%</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <p className="text-xs text-blue-300">Avg Holding Period</p>
                    </div>
                    <p className="text-2xl font-black text-white">{behavioral_resilience.average_holding_period.toFixed(0)} days</p>
                  </div>
                  <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-400/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-cyan-400" />
                      <p className="text-xs text-cyan-300">Rebalancing Freq.</p>
                    </div>
                    <p className="text-2xl font-black text-white">{behavioral_resilience.rebalancing_frequency.toFixed(0)}x/yr</p>
                  </div>
                  <div className="bg-red-500/10 rounded-xl p-4 border border-red-400/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <p className="text-xs text-red-300">Panic Sell Indicators</p>
                    </div>
                    <p className="text-2xl font-black text-white">{behavioral_resilience.panic_sell_indicators}</p>
                  </div>
                  <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-400/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-emerald-400" />
                      <p className="text-xs text-emerald-300">Goal Alignment</p>
                    </div>
                    <p className="text-2xl font-black text-white">{behavioral_resilience.goal_alignment_score.toFixed(0)}/100</p>
                  </div>
                  <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-400/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-amber-400" />
                      <p className="text-xs text-amber-300">Resilience Score</p>
                    </div>
                    <p className="text-2xl font-black text-white">{behavioral_resilience.resilience_score.toFixed(0)}/100</p>
                  </div>
                </div>

                {/* Insights */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-400/20">
                    <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-300 mb-1">Emotional Stability</p>
                      <p className="text-xs text-blue-100">
                        Your {behavioral_resilience.panic_sell_indicators === 0 ? 'excellent' : 'stable'} emotional control during market fluctuations indicates strong investment discipline.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-400/20">
                    <Info className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-purple-300 mb-1">Strategic Patience</p>
                      <p className="text-xs text-purple-100">
                        Average holding period of {behavioral_resilience.average_holding_period.toFixed(0)} days suggests {behavioral_resilience.average_holding_period > 180 ? 'long-term strategic thinking' : 'active portfolio management'}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
