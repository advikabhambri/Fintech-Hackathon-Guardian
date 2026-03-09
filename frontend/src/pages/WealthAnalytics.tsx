import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Layers,
  Calendar,
  Download,
  RefreshCw,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from 'lucide-react'
import { useWealthHubData } from '../hooks/useWealthHubData'
import PersonalizedInsights from '../components/PersonalizedInsights'

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

type TimeRange = '7d' | '1m' | '3m' | '6m' | '1y' | 'all'
type ViewMode = 'composition' | 'trends' | 'comparison'

function formatCurrency(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

export default function WealthAnalytics() {
  const { isLoading, wellness, unifiedWallet } = useWealthHubData()
  const [timeRange, setTimeRange] = useState<TimeRange>('6m')
  const [viewMode, setViewMode] = useState<ViewMode>('composition')

  // Generate historical data for time-series (mock data for demo)
  const historicalData = useMemo(() => {
    const months = timeRange === '7d' ? 7 : timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : timeRange === '6m' ? 180 : timeRange === '1y' ? 365 : 730
    const data = []
    const baseValue = unifiedWallet.totalNetWorth * 0.85
    
    for (let i = 0; i < months; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (months - i))
      const growth = (i / months) * 0.15
      const volatility = Math.sin(i / 10) * 0.03
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalNetWorth: baseValue * (1 + growth + volatility),
        traditionalValue: baseValue * 0.55 * (1 + growth + volatility * 0.8),
        digitalValue: baseValue * 0.25 * (1 + growth + volatility * 1.5),
        alternativeValue: baseValue * 0.20 * (1 + growth + volatility * 1.2),
        wellnessScore: Math.min(100, Math.max(60, wellness.overall_score - 15 + (i / months) * 20 + Math.random() * 5)),
        diversificationScore: Math.min(100, wellness.diversification.diversification_score + Math.random() * 10 - 5),
        liquidityScore: Math.min(100, wellness.liquidity.liquidity_score + Math.random() * 10 - 5),
        resilienceScore: Math.min(100, wellness.behavioral_resilience.resilience_score + Math.random() * 10 - 5),
      })
    }
    return data
  }, [timeRange, unifiedWallet.totalNetWorth, wellness])

  // Wealth composition for pie chart
  const compositionData = [
    { 
      name: 'Traditional Assets', 
      value: unifiedWallet.traditionalValue, 
      color: '#3b82f6',
      percentage: (unifiedWallet.traditionalValue / unifiedWallet.totalNetWorth * 100).toFixed(1)
    },
    { 
      name: 'Digital Assets', 
      value: unifiedWallet.digitalValue, 
      color: '#f59e0b',
      percentage: (unifiedWallet.digitalValue / unifiedWallet.totalNetWorth * 100).toFixed(1)
    },
    { 
      name: 'Alternative Assets', 
      value: unifiedWallet.alternativeValue, 
      color: '#8b5cf6',
      percentage: (unifiedWallet.alternativeValue / unifiedWallet.totalNetWorth * 100).toFixed(1)
    },
    { 
      name: 'Cash & Equivalents', 
      value: unifiedWallet.totalNetWorth * 0.12, 
      color: '#22c55e',
      percentage: '12.0'
    },
  ]

  // Asset type distribution
  const assetDistribution = Object.entries(wellness.diversification.asset_type_distribution).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    value,
    color: ['#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 6)]
  }))

  // Health indicators radar chart
  const healthRadarData = [
    { metric: 'Diversification', score: wellness.diversification.diversification_score, fullMark: 100 },
    { metric: 'Liquidity', score: wellness.liquidity.liquidity_score, fullMark: 100 },
    { metric: 'Resilience', score: wellness.behavioral_resilience.resilience_score, fullMark: 100 },
    { metric: 'Risk Management', score: 100 - wellness.diversification.concentration_risk, fullMark: 100 },
    { metric: 'Goal Alignment', score: wellness.behavioral_resilience.goal_alignment_score, fullMark: 100 },
  ]

  // Calculate growth metrics
  const firstValue = historicalData[0]?.totalNetWorth || 0
  const lastValue = historicalData[historicalData.length - 1]?.totalNetWorth || 0
  const growthAmount = lastValue - firstValue
  const growthPercent = (growthAmount / firstValue) * 100

  if (isLoading) {
    return <div className="py-8 text-center text-slate-300">Loading Analytics...</div>
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-[calc(100vh-7rem)] p-6 md:p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Wealth Analytics</h1>
            <p className="mt-2 text-slate-300 text-sm">Track your wealth composition and health indicators over time</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors">
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Refresh</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-colors">
              <Download className="h-4 w-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>

        {/* View Mode & Time Range Selector */}
        <div className="flex items-center justify-between">
          {/* View Mode Tabs */}
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            {[
              { id: 'composition' as ViewMode, label: 'Composition', icon: PieChartIcon },
              { id: 'trends' as ViewMode, label: 'Trends', icon: LineChartIcon },
              { id: 'comparison' as ViewMode, label: 'Comparison', icon: BarChart3 },
            ].map((mode) => {
              const Icon = mode.icon
              return (
                <motion.button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-md transition-all font-semibold text-sm ${
                    viewMode === mode.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{mode.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            {(['7d', '1m', '3m', '6m', '1y', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeRange === range
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div variants={cardVariants} className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-400 font-medium">Total Growth</p>
            {growthAmount >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
          <p className="text-2xl font-black text-white mb-1">{formatCurrency(Math.abs(growthAmount))}</p>
          <p className={`text-sm font-bold ${growthAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {growthAmount >= 0 ? '+' : ''}{growthPercent.toFixed(2)}%
          </p>
        </motion.div>

        <motion.div variants={cardVariants} className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-400 font-medium">Current Net Worth</p>
            <Activity className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white mb-1">{formatCurrency(unifiedWallet.totalNetWorth)}</p>
          <p className="text-sm text-slate-400">Across {unifiedWallet.accountsCount} accounts</p>
        </motion.div>

        <motion.div variants={cardVariants} className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-400 font-medium">Wellness Score</p>
            <Activity className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white mb-1">{wellness.overall_score.toFixed(0)}</p>
          <p className="text-sm text-purple-400 font-bold">{wellness.grade} Grade</p>
        </motion.div>

        <motion.div variants={cardVariants} className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-400 font-medium">Asset Classes</p>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white mb-1">{wellness.diversification.asset_class_count}</p>
          <p className="text-sm text-cyan-400 font-bold">Diversified</p>
        </motion.div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'composition' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Wealth Composition Pie Chart */}
          <motion.div variants={cardVariants} className="col-span-12 md:col-span-8 card p-8">
            <h3 className="text-lg font-bold text-white mb-6">Wealth Composition</h3>
            <div className="flex items-center gap-8">
              <div className="h-80 w-80 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={compositionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={800}
                    >
                      {compositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-4">
                {compositionData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.percentage}% of total</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-white">{formatCurrency(item.value)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Asset Distribution */}
          <motion.div variants={cardVariants} className="col-span-12 md:col-span-4 card p-6">
            <h3 className="text-lg font-bold text-white mb-6">Asset Type Distribution</h3>
            <div className="space-y-4">
              {assetDistribution.map((asset, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">{asset.name}</span>
                    <span className="text-xs font-bold text-white">{asset.value.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: asset.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${asset.value}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Health Radar Chart */}
          <motion.div variants={cardVariants} className="col-span-12 card p-8">
            <h3 className="text-lg font-bold text-white mb-6">Financial Health Indicators</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={healthRadarData}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    animationDuration={800}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {viewMode === 'trends' && (
        <motion.div variants={containerVariants} className="space-y-6">
          {/* Net Worth Over Time */}
          <motion.div variants={cardVariants} className="card p-8">
            <h3 className="text-lg font-bold text-white mb-6">Net Worth Over Time</h3>
            <div className="w-full h-96 bg-slate-900/20 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} tickFormatter={formatCurrency} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalNetWorth"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorNetWorth)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Health Scores Over Time */}
          <motion.div variants={cardVariants} className="card p-8">
            <h3 className="text-lg font-bold text-white mb-6">Health Indicators Trends</h3>
            <div className="w-full h-96 bg-slate-900/20 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="wellnessScore"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Overall Wellness"
                    dot={false}
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="diversificationScore"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Diversification"
                    dot={false}
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="liquidityScore"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Liquidity"
                    dot={false}
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="resilienceScore"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Resilience"
                    dot={false}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Asset Allocation Over Time */}
          <motion.div variants={cardVariants} className="card p-8">
            <h3 className="text-lg font-bold text-white mb-6">Asset Allocation Trends</h3>
            <div className="w-full h-96 bg-slate-900/20 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} tickFormatter={formatCurrency} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="traditionalValue"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.8}
                    name="Traditional"
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="digitalValue"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.8}
                    name="Digital"
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="alternativeValue"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.8}
                    name="Alternative"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      )}

      {viewMode === 'comparison' && (
        <motion.div variants={containerVariants} className="space-y-6">
          {/* Asset Performance Comparison */}
          <motion.div variants={cardVariants} className="card p-8">
            <h3 className="text-lg font-bold text-white mb-6">Asset Class Performance</h3>
            <div className="w-full h-96 bg-slate-900/20 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={compositionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    style={{ fontSize: '12px' }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} tickFormatter={formatCurrency} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} animationDuration={800} name="Value">
                    {compositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Health Metrics Comparison - Horizontal Bar Chart */}
          <motion.div variants={cardVariants} className="card p-8">
            <h3 className="text-lg font-bold text-white mb-6">Health Metrics Comparison</h3>
            <div className="w-full h-80 bg-slate-900/20 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={healthRadarData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 140, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis type="category" dataKey="metric" stroke="#94a3b8" style={{ fontSize: '12px' }} width={130} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}/100`}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[0, 8, 8, 0]} animationDuration={800} name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Performance Over Time */}
          <motion.div variants={cardVariants} className="card p-8">
            <h3 className="text-lg font-bold text-white mb-6">Asset vs Health Score Trends</h3>
            <div className="w-full h-96 bg-slate-900/20 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalNetWorth"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Net Worth"
                    dot={false}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Personalized Insights Section - Always Visible */}
      <motion.div variants={cardVariants} className="card p-8 mt-6">
        <PersonalizedInsights wellness={wellness} unifiedWallet={unifiedWallet} />
      </motion.div>
    </motion.div>
  )
}
