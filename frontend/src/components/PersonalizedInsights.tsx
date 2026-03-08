import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  TrendingUp,
  Lightbulb,
  Users,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Brain,
  Calculator,
  FilePlus,
  Star,
  Zap,
} from 'lucide-react'

interface PersonalizedInsightsProps {
  wellness: {
    overall_score: number
    grade: string
    diversification: {
      asset_class_count: number
      concentration_risk: number
      diversification_score: number
    }
    liquidity: {
      liquid_assets: number
      liquidity_ratio: number
      emergency_fund_coverage: number
      liquidity_score: number
    }
    behavioral_resilience: {
      portfolio_volatility: number
      panic_sell_indicators: number
      goal_alignment_score: number
      resilience_score: number
    }
    recommendations: string[]
    strengths: string[]
    weaknesses: string[]
  }
  unifiedWallet: {
    totalNetWorth: number
    traditionalValue: number
    digitalValue: number
    alternativeValue: number
  }
}

type UserType = 'client' | 'adviser'
type InsightCategory = 'immediate' | 'short-term' | 'long-term' | 'scenarios'

interface Action {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'easy' | 'moderate' | 'complex'
  category: string
  priority: number
  timeframe: string
  expectedOutcome: string
  steps?: string[]
}

interface Scenario {
  id: string
  name: string
  description: string
  assumptions: string[]
  impact: {
    netWorth: number
    wellnessScore: number
    risk: string
  }
  recommendations: string[]
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function PersonalizedInsights({ wellness, unifiedWallet }: PersonalizedInsightsProps) {
  const [userType, setUserType] = useState<UserType>('client')
  const [activeCategory, setActiveCategory] = useState<InsightCategory>('immediate')
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)

  // Generate personalized actions based on financial data
  const generateClientActions = (): Action[] => {
    const actions: Action[] = []

    // Diversification actions
    if (wellness.diversification.concentration_risk > 30) {
      actions.push({
        id: 'div-1',
        title: 'Reduce Concentration Risk',
        description: `Your portfolio has a concentration risk of ${wellness.diversification.concentration_risk.toFixed(1)}%. Consider spreading investments across more asset classes.`,
        impact: 'high',
        effort: 'moderate',
        category: 'Diversification',
        priority: 1,
        timeframe: '2-4 weeks',
        expectedOutcome: 'Reduce risk by 15-20% and improve portfolio resilience',
        steps: [
          'Review your top 5 holdings (currently represent too much of your portfolio)',
          'Identify 2-3 new asset classes to invest in',
          'Gradually rebalance by selling 10-15% of concentrated positions',
          'Reinvest proceeds into diversified ETFs or mutual funds',
        ],
      })
    }

    if (wellness.diversification.asset_class_count < 5) {
      actions.push({
        id: 'div-2',
        title: 'Expand Asset Class Diversity',
        description: `You're invested in only ${wellness.diversification.asset_class_count} asset classes. Adding more can reduce volatility.`,
        impact: 'medium',
        effort: 'easy',
        category: 'Diversification',
        priority: 3,
        timeframe: '1-2 weeks',
        expectedOutcome: 'Improve diversification score by 10-15 points',
        steps: [
          'Consider adding REITs for real estate exposure',
          'Explore international equities for geographic diversification',
          'Add commodities or precious metals (5-10% allocation)',
        ],
      })
    }

    // Liquidity actions
    if (wellness.liquidity.emergency_fund_coverage < 6) {
      actions.push({
        id: 'liq-1',
        title: 'Build Emergency Fund',
        description: `Your emergency fund covers only ${wellness.liquidity.emergency_fund_coverage.toFixed(1)} months. Aim for 6-12 months of expenses.`,
        impact: 'high',
        effort: 'moderate',
        category: 'Liquidity',
        priority: 2,
        timeframe: '3-6 months',
        expectedOutcome: 'Achieve 6+ months emergency coverage, peace of mind',
        steps: [
          `Save additional ${formatCurrency((6 - wellness.liquidity.emergency_fund_coverage) * 5000)} for full coverage`,
          'Set up automatic monthly transfers to high-yield savings',
          'Keep emergency funds in FDIC-insured accounts',
          'Review and adjust monthly budget to increase savings rate',
        ],
      })
    }

    if (wellness.liquidity.liquidity_ratio < 0.2) {
      actions.push({
        id: 'liq-2',
        title: 'Increase Liquid Assets',
        description: `Only ${(wellness.liquidity.liquidity_ratio * 100).toFixed(1)}% of your portfolio is liquid. Increase to 20-30% for flexibility.`,
        impact: 'medium',
        effort: 'easy',
        category: 'Liquidity',
        priority: 4,
        timeframe: '2-3 weeks',
        expectedOutcome: 'Better ability to handle emergencies and opportunities',
        steps: [
          'Identify illiquid holdings that can be converted',
          'Move 10-15% into money market or short-term bonds',
          'Consider a high-yield savings account for better returns',
        ],
      })
    }

    // Behavioral resilience actions
    if (wellness.behavioral_resilience.panic_sell_indicators > 2) {
      actions.push({
        id: 'res-1',
        title: 'Develop Investment Discipline Strategy',
        description: 'Detected signs of emotional trading. Create rules to maintain discipline during market volatility.',
        impact: 'high',
        effort: 'moderate',
        category: 'Behavioral',
        priority: 2,
        timeframe: '1 week',
        expectedOutcome: 'Reduce emotional decisions, improve long-term returns',
        steps: [
          'Document your investment thesis for each holding',
          'Set predetermined sell rules based on fundamentals, not emotions',
          'Review portfolio monthly, not daily',
          'Consider using dollar-cost averaging for new investments',
        ],
      })
    }

    if (wellness.behavioral_resilience.goal_alignment_score < 70) {
      actions.push({
        id: 'res-2',
        title: 'Realign Portfolio with Goals',
        description: `Your goal alignment score is ${wellness.behavioral_resilience.goal_alignment_score.toFixed(0)}. Ensure investments match your objectives.`,
        impact: 'high',
        effort: 'complex',
        category: 'Strategic',
        priority: 1,
        timeframe: '2-4 weeks',
        expectedOutcome: 'Portfolio structured to achieve your specific financial goals',
        steps: [
          'List your financial goals with timeframes (short/medium/long-term)',
          'Calculate required rate of return for each goal',
          'Adjust asset allocation to match time horizons',
          'Set up separate accounts for different goal buckets',
        ],
      })
    }

    // Performance optimization
    if (wellness.overall_score < 80) {
      actions.push({
        id: 'opt-1',
        title: 'Optimize Portfolio Performance',
        description: `Your wellness score is ${wellness.overall_score.toFixed(0)}. Follow these steps to improve to 85+.`,
        impact: 'high',
        effort: 'complex',
        category: 'Optimization',
        priority: 3,
        timeframe: '4-8 weeks',
        expectedOutcome: 'Improve overall financial health by 10-15 points',
        steps: [
          'Review all holdings for performance and fees',
          'Replace underperforming funds with low-cost alternatives',
          'Tax-loss harvest any positions with losses',
          'Rebalance to target asset allocation',
        ],
      })
    }

    return actions.sort((a, b) => a.priority - b.priority)
  }

  const generateAdviserActions = (): Action[] => {
    const actions: Action[] = []

    // Client relationship actions
    actions.push({
      id: 'adv-1',
      title: 'Schedule Portfolio Review Meeting',
      description: `Client's wellness score of ${wellness.overall_score.toFixed(0)} suggests need for strategic adjustments. Book 90-minute review.`,
      impact: 'high',
      effort: 'easy',
      category: 'Client Management',
      priority: 1,
      timeframe: 'Next 7 days',
      expectedOutcome: 'Strengthen client relationship and identify optimization opportunities',
      steps: [
        'Prepare detailed portfolio analysis report',
        'Create visual comparison to benchmark indices',
        'Develop 3 alternative allocation strategies',
        'Schedule video call with screen sharing capability',
      ],
    })

    // Risk management
    if (wellness.diversification.concentration_risk > 30) {
      actions.push({
        id: 'adv-2',
        title: 'Address Concentration Risk Urgently',
        description: `${wellness.diversification.concentration_risk.toFixed(1)}% concentration risk requires immediate attention. Client may be overexposed.`,
        impact: 'high',
        effort: 'moderate',
        category: 'Risk Management',
        priority: 1,
        timeframe: 'Within 2 weeks',
        expectedOutcome: 'Reduce client risk exposure and improve risk-adjusted returns',
        steps: [
          'Identify specific concentrated positions',
          'Calculate tax implications of rebalancing',
          'Present diversification strategy with projected outcomes',
          'Implement phased rebalancing over 30-90 days',
        ],
      })
    }

    // Growth opportunities
    const digitalAllocation = (unifiedWallet.digitalValue / unifiedWallet.totalNetWorth) * 100
    if (digitalAllocation < 10 && wellness.behavioral_resilience.resilience_score > 70) {
      actions.push({
        id: 'adv-3',
        title: 'Propose Digital Asset Allocation',
        description: `Client has only ${digitalAllocation.toFixed(1)}% in digital assets with strong resilience score. Opportunity for strategic allocation.`,
        impact: 'medium',
        effort: 'moderate',
        category: 'Growth Strategy',
        priority: 3,
        timeframe: '2-3 weeks',
        expectedOutcome: 'Enhanced portfolio growth potential and modern asset exposure',
        steps: [
          'Educate client on institutional digital asset products',
          'Recommend 5-10% allocation to Bitcoin/Ethereum ETFs',
          'Present risk management strategy (stop-loss, position sizing)',
          'Monitor and rebalance quarterly',
        ],
      })
    }

    // Fee optimization
    actions.push({
      id: 'adv-4',
      title: 'Conduct Fee Audit',
      description: 'Review all investment fees and expenses. Potential to save client 0.5-1.0% annually through optimization.',
      impact: 'medium',
      effort: 'moderate',
      category: 'Cost Optimization',
      priority: 4,
      timeframe: '1-2 weeks',
      expectedOutcome: `Save client ${formatCurrency(unifiedWallet.totalNetWorth * 0.007)} annually`,
      steps: [
        'List all fund expense ratios and advisory fees',
        'Compare to low-cost index alternatives',
        'Calculate total cost difference over 10 years',
        'Present fee reduction proposal with projected savings',
      ],
    })

    // Tax strategy
    actions.push({
      id: 'adv-5',
      title: 'Implement Tax-Loss Harvesting Strategy',
      description: 'Current market conditions present tax-loss harvesting opportunities to reduce client tax burden.',
      impact: 'high',
      effort: 'complex',
      category: 'Tax Strategy',
      priority: 2,
      timeframe: '2-4 weeks',
      expectedOutcome: 'Generate $5K-$15K in tax deductions while maintaining allocation',
      steps: [
        'Identify positions with unrealized losses',
        'Find suitable replacement securities (avoid wash sales)',
        'Calculate tax benefit based on client tax bracket',
        'Execute trades and document for tax reporting',
      ],
    })

    return actions.sort((a, b) => a.priority - b.priority)
  }

  const generateScenarios = (): Scenario[] => {
    return [
      {
        id: 'market-crash',
        name: 'Market Downturn (-30%)',
        description: 'Stock market correction similar to 2022 or 2020 COVID crash',
        assumptions: [
          'Equities drop 30% over 3 months',
          'Bonds remain stable or gain 5%',
          'Digital assets drop 50%',
          'Recovery begins in 12-18 months',
        ],
        impact: {
          netWorth: unifiedWallet.totalNetWorth * 0.78,
          wellnessScore: Math.max(40, wellness.overall_score - 20),
          risk: 'High stress period, test of resilience',
        },
        recommendations: [
          'Do NOT panic sell - historically, markets recover',
          'Consider tax-loss harvesting opportunities',
          'If you have cash, dollar-cost average into positions',
          'Rebalance to take advantage of lower prices',
          'Maintain 6-12 month emergency fund',
        ],
      },
      {
        id: 'aggressive-growth',
        name: 'Aggressive Growth Strategy',
        description: 'Shift to higher-risk, higher-reward allocation',
        assumptions: [
          'Increase equities to 80% of portfolio',
          'Add 15% alternative investments',
          'Reduce cash to 5%',
          'Target 12-15% annual returns',
        ],
        impact: {
          netWorth: unifiedWallet.totalNetWorth * 1.15,
          wellnessScore: wellness.overall_score - 10,
          risk: 'Higher volatility, may see 20-40% swings',
        },
        recommendations: [
          'Only suitable if time horizon is 10+ years',
          'Requires strong emotional discipline',
          'Regular rebalancing is critical',
          'Consider your age and risk tolerance',
          'May need larger emergency fund due to volatility',
        ],
      },
      {
        id: 'retirement-ready',
        name: 'Retirement Transition (5 Years Out)',
        description: 'Prepare portfolio for retirement income generation',
        assumptions: [
          'Shift to 60% stocks, 30% bonds, 10% cash',
          'Focus on dividend-paying stocks',
          'Build 2-year cash cushion',
          'Target 6-8% annual returns with lower volatility',
        ],
        impact: {
          netWorth: unifiedWallet.totalNetWorth * 1.08,
          wellnessScore: Math.min(100, wellness.overall_score + 5),
          risk: 'Lower risk, more stable income',
        },
        recommendations: [
          'Create income ladder with bonds maturing annually',
          'Increase allocation to dividend aristocrats',
          'Consider annuities for guaranteed income floor',
          'Plan Roth conversions for tax efficiency',
          'Healthcare costs: budget 15-20% of retirement income',
        ],
      },
      {
        id: 'inflation-hedge',
        name: 'High Inflation Environment',
        description: 'Protect purchasing power during 6-8% inflation',
        assumptions: [
          'Inflation runs at 6-8% for 3-5 years',
          'Add 20% allocation to inflation hedges',
          'TIPS, commodities, real estate focus',
          'Cash loses 6-8% purchasing power annually',
        ],
        impact: {
          netWorth: unifiedWallet.totalNetWorth * 1.05,
          wellnessScore: wellness.overall_score,
          risk: 'Moderate - preservation focused',
        },
        recommendations: [
          'Increase TIPS (Treasury Inflation-Protected Securities)',
          'Add commodity exposure (10-15% allocation)',
          'Consider I-Bonds for safe inflation protection',
          'Real estate and REITs as inflation hedge',
          'Minimize cash holdings (use only for emergencies)',
        ],
      },
      {
        id: 'windfall',
        name: 'Sudden Windfall ($500K)',
        description: 'Receive unexpected inheritance or bonus',
        assumptions: [
          'Receive $500,000 lump sum',
          'Deploy over 12 months to avoid timing risk',
          'Maintain current allocation ratios',
          'Tax implications considered',
        ],
        impact: {
          netWorth: unifiedWallet.totalNetWorth + 500000,
          wellnessScore: Math.min(100, wellness.overall_score + 8),
          risk: 'Low if deployed strategically',
        },
        recommendations: [
          'Wait 30 days before making any major decisions',
          'Consult tax professional immediately',
          'Pay off high-interest debt first (>6% interest)',
          'Max out retirement accounts for current year',
          'Dollar-cost average into investments over 12 months',
          'Consider charitable giving for tax benefits',
        ],
      },
    ]
  }

  const clientActions = generateClientActions()
  const adviserActions = generateAdviserActions()
  const scenarios = generateScenarios()

  const actions = userType === 'client' ? clientActions : adviserActions
  const filteredActions = actions.filter((action) => {
    if (activeCategory === 'immediate') return action.priority <= 2
    if (activeCategory === 'short-term') return action.priority > 2 && action.priority < 4
    if (activeCategory === 'long-term') return action.priority >= 4
    return true
  })

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-400 bg-green-500/20 border-green-400/30'
      case 'medium': return 'text-blue-400 bg-blue-500/20 border-blue-400/30'
      case 'low': return 'text-slate-400 bg-slate-500/20 border-slate-400/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-400/30'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'easy': return 'text-green-400'
      case 'moderate': return 'text-amber-400'
      case 'complex': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with User Type Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {userType === 'client' ? 'Your Personalized Action Plan' : 'Adviser Recommendations'}
          </h2>
          <p className="text-slate-300 text-sm">
            {userType === 'client' 
              ? 'Data-driven recommendations to improve your financial wellness'
              : 'Strategic insights and actions for client portfolio management'}
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="flex gap-2 p-1 rounded-lg bg-slate-800/50 border border-white/10">
          <button
            onClick={() => setUserType('client')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              userType === 'client'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Client View</span>
          </button>
          <button
            onClick={() => setUserType('adviser')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              userType === 'adviser'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">Adviser View</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'immediate' as InsightCategory, label: 'Immediate Actions', icon: Zap },
          { id: 'short-term' as InsightCategory, label: 'Short-Term (1-3 months)', icon: Target },
          { id: 'long-term' as InsightCategory, label: 'Long-Term Strategy', icon: TrendingUp },
          { id: 'scenarios' as InsightCategory, label: 'What-If Scenarios', icon: Calculator },
        ].map((category) => {
          const Icon = category.icon
          return (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{category.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeCategory !== 'scenarios' ? (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredActions.length === 0 ? (
              <div className="card p-6 text-center border border-dashed border-white/20">
                <h3 className="text-base font-semibold text-white mb-2">No actions in this category yet</h3>
                <p className="text-sm text-slate-300">
                  Try another tab or switch between Client and Adviser view to see more recommendations.
                </p>
              </div>
            ) : (
              filteredActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group card p-6 hover:border-blue-400/30 transition-all cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-black text-blue-400">#{index + 1}</span>
                        <h3 className="text-lg font-bold text-white">{action.title}</h3>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{action.description}</p>
                      
                      {/* Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(action.impact)}`}>
                          {action.impact.toUpperCase()} IMPACT
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getEffortColor(action.effort)}`}>
                          {action.effort.toUpperCase()} EFFORT
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                          {action.category}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
                          ⏱️ {action.timeframe}
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>

                  {/* Expected Outcome */}
                  <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-400/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-semibold text-green-300 uppercase">Expected Outcome</span>
                    </div>
                    <p className="text-sm text-green-100">{action.expectedOutcome}</p>
                  </div>

                  {/* Action Steps */}
                  {action.steps && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FilePlus className="h-4 w-4 text-blue-400" />
                        <span className="text-xs font-semibold text-blue-300 uppercase">Action Steps</span>
                      </div>
                      <div className="space-y-2">
                        {action.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                            <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-blue-400">{idx + 1}</span>
                            </div>
                            <p>{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 transition-colors">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {userType === 'client' ? 'Mark as Planned' : 'Add to Client Plan'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="card p-6 bg-blue-500/10 border-blue-400/30">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Scenario Planning</h3>
                  <p className="text-sm text-blue-100">
                    Explore different market scenarios and see how they might impact your portfolio. 
                    Use these insights to prepare strategies and build resilience.
                  </p>
                </div>
              </div>
            </div>

            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{scenario.name}</h3>
                    <p className="text-sm text-slate-300">{scenario.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
                    className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30 transition-colors text-sm font-semibold"
                  >
                    {selectedScenario === scenario.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {/* Impact Summary */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Projected Net Worth</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(scenario.impact.netWorth)}</p>
                    <p className={`text-xs font-semibold ${
                      scenario.impact.netWorth >= unifiedWallet.totalNetWorth ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {scenario.impact.netWorth >= unifiedWallet.totalNetWorth ? '+' : ''}
                      {formatCurrency(scenario.impact.netWorth - unifiedWallet.totalNetWorth)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Wellness Score</p>
                    <p className="text-lg font-bold text-white">{scenario.impact.wellnessScore.toFixed(0)}</p>
                    <p className={`text-xs font-semibold ${
                      scenario.impact.wellnessScore >= wellness.overall_score ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {scenario.impact.wellnessScore >= wellness.overall_score ? '+' : ''}
                      {(scenario.impact.wellnessScore - wellness.overall_score).toFixed(0)} points
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Risk Level</p>
                    <p className="text-sm font-semibold text-white">{scenario.impact.risk}</p>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedScenario === scenario.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-4 border-t border-white/10"
                    >
                      {/* Assumptions */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-cyan-400" />
                          Key Assumptions
                        </h4>
                        <div className="space-y-2">
                          {scenario.assumptions.map((assumption, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <ArrowRight className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <p>{assumption}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-400" />
                          {userType === 'client' ? 'What You Should Do' : 'Adviser Recommendations'}
                        </h4>
                        <div className="space-y-2">
                          {scenario.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-400/20">
                              <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-amber-400">{idx + 1}</span>
                              </div>
                              <p className="text-sm text-amber-100">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
