import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Brain,
  Building2,
  Coins,
  Landmark,
  Lock,
  ShieldCheck,
  Sparkles,
  Wallet2,
  DollarSign,
  Activity,
} from 'lucide-react'
import { useWealthHubData } from '../hooks/useWealthHubData'
import FinancialWellnessAnalyzer from '../components/FinancialWellnessAnalyzer'
import ActionPreview from '../components/ActionPreview'
import CalmModeWidget from '../components/CalmModeWidget'

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

// Animated Gradient Blobs Background
const AnimatedBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Electric Blue Blob */}
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full opacity-30"
      style={{
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0) 70%)',
        filter: 'blur(80px)',
      }}
      animate={{
        x: ['-10%', '10%', '-10%'],
        y: ['-10%', '20%', '-10%'],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      initial={{ x: '20%', y: '10%' }}
    />
    
    {/* Deep Indigo Blob */}
    <motion.div
      className="absolute w-[700px] h-[700px] rounded-full opacity-30"
      style={{
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(79, 70, 229, 0.4) 50%, rgba(99, 102, 241, 0) 70%)',
        filter: 'blur(80px)',
      }}
      animate={{
        x: ['70%', '60%', '70%'],
        y: ['60%', '40%', '60%'],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      initial={{ x: '70%', y: '50%' }}
    />
  </div>
)

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function colorForHealthIndicator(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 65) return '#3b82f6'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

export default function Dashboard() {
  const { isLoading, error, wellness, unifiedWallet, recommendations } = useWealthHubData()
  const [stressDrop, setStressDrop] = useState(20)

  const scenario = useMemo(() => {
    const dropRatio = Math.min(Math.max(stressDrop, 0), 80) / 100
    const adjustedWorth = unifiedWallet.totalNetWorth * (1 - dropRatio * 0.55)
    const adjustedScore = Math.max(0, wellness.overall_score - dropRatio * 25)
    return { adjustedWorth, adjustedScore }
  }, [stressDrop, unifiedWallet.totalNetWorth, wellness.overall_score])

  const treemapData = useMemo(() => {
    const total = unifiedWallet.totalNetWorth || 1
    const cashValue = Math.max(unifiedWallet.totalNetWorth * (wellness.liquidity?.liquidity_ratio || 0.15), total * 0.05)
    const stocksValue = Math.max(unifiedWallet.traditionalValue * 0.65, total * 0.35)
    const privateEquityValue = Math.max(unifiedWallet.alternativeValue, total * 0.10)
    const digitalValue = Math.max(unifiedWallet.digitalValue, total * 0.08)

    const stocksHealth = wellness.diversification?.diversification_score || 75
    const privateHealth = Math.max(0, 100 - (wellness.diversification?.concentration_risk || 15))
    const digitalHealth = Math.max(0, Math.min(100, (wellness.behavioral_resilience?.resilience_score || 70)))

    const data = [
      {
        name: 'Stocks & Securities',
        size: stocksValue,
        health: stocksHealth,
        fill: colorForHealthIndicator(stocksHealth),
      },
      {
        name: 'Cash & Equivalents',
        size: cashValue,
        health: wellness.liquidity?.liquidity_score || 80,
        fill: colorForHealthIndicator(wellness.liquidity?.liquidity_score || 80),
      },
      {
        name: 'Digital Assets',
        size: digitalValue,
        health: digitalHealth,
        fill: colorForHealthIndicator(digitalHealth),
      },
      {
        name: 'Alternative Assets',
        size: privateEquityValue,
        health: privateHealth,
        fill: colorForHealthIndicator(privateHealth),
      },
    ]

    console.log('Treemap Data:', data) // Debug log
    return data
  }, [unifiedWallet, wellness])

  const liquidityLow = wellness.liquidity.liquidity_ratio < 0.2

  // Mock recent transactions for demo
  const recentTransactions = [
    { id: 1, name: 'Apple Inc.', type: 'buy', amount: 5420, date: '2 days ago', trend: 'up' },
    { id: 2, name: 'Bitcoin', type: 'sell', amount: 12800, date: '3 days ago', trend: 'down' },
    { id: 3, name: 'S&P 500 Index', type: 'buy', amount: 8900, date: '1 week ago', trend: 'up' },
  ]

  // Asset allocation for pie chart
  const allocationData = [
    { name: 'Stocks', value: unifiedWallet.traditionalValue * 0.62, color: '#3b82f6' },
    { name: 'Crypto', value: unifiedWallet.digitalValue, color: '#f59e0b' },
    { name: 'Bonds', value: unifiedWallet.traditionalValue * 0.38, color: '#22c55e' },
    { name: 'Alternative', value: unifiedWallet.alternativeValue, color: '#8b5cf6' },
  ]

  if (isLoading) {
    return <div className="py-8 text-center text-slate-300">Loading Guardian...</div>
  }

  return (
    <>
      {/* Animated Gradient Blob Background */}
      <AnimatedBlobs />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative min-h-[calc(100vh-7rem)] p-6 md:p-8"
      >
        {/* Header */}
        <div className="mb-8 relative z-10">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">Guardian</h1>
          <p className="mt-2 text-slate-300 text-sm">Your financial command center</p>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>

        {/* Calm Mode Widget - Compact View */}
        <div className="mb-6 relative z-10">
          <CalmModeWidget variant="compact" showRiskMeter={false} showTimingCheck={false} />
        </div>

        {/* 
        {/* 12-Column Grid Layout - 24px gap (gap-6), 24px radius (rounded-3xl) */}
        <div className="grid grid-cols-12 gap-6 auto-rows-auto relative z-10">
        
        {/* 1. Total Net Worth - Full Width Horizontal */}
        <motion.section
          variants={cardVariants}
          className="col-span-12 rounded-3xl border border-white/10 backdrop-blur-[16px] p-8 shadow-glass relative overflow-hidden"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
        >
          {/* Animated gradient orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left: Main Portfolio Value */}
            <div className="flex-shrink-0">
              {/* Header with icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-400/20">
                  <DollarSign className="h-5 w-5 text-blue-300 drop-shadow-[0_0_20px_rgba(96,165,250,0.4)]" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold mb-0.5">Total Portfolio Value</p>
                  <p className="text-xs text-slate-400 font-medium">{unifiedWallet.accountsCount} accounts • {unifiedWallet.assetsCount} assets</p>
                </div>
              </div>

              {/* Main net worth value */}
              <div>
                <h2 className="figure-mono text-6xl font-black tracking-tighter text-white mb-2 drop-shadow-[0_2px_20px_rgba(255,255,255,0.1)]">
                  {formatCurrency(unifiedWallet.totalNetWorth)}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30">
                    <ArrowUpRight className="h-3 w-3 text-green-300" />
                    <span className="text-xs font-bold text-green-300">+12.4%</span>
                  </span>
                  <span className="text-xs text-slate-400">this month</span>
                </div>
              </div>
            </div>

            {/* Right: Asset breakdown cards - Horizontal */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Traditional */}
              <div className="group relative rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-400/20 p-5 hover:border-blue-400/40 transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="h-9 w-9 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-400/30 mb-3">
                    <Landmark className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-[10px] text-blue-300/80 uppercase tracking-wider font-semibold mb-2">Traditional Assets</p>
                  <p className="figure-mono text-2xl font-bold text-white tabular-nums mb-1">
                    {formatCurrency(unifiedWallet.traditionalValue)}
                  </p>
                  <p className="text-sm font-semibold text-slate-400 mt-auto">
                    {((unifiedWallet.traditionalValue / unifiedWallet.totalNetWorth) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>

              {/* Digital */}
              <div className="group relative rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-400/20 p-5 hover:border-amber-400/40 transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-400/30 mb-3">
                    <Coins className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="text-[10px] text-amber-300/80 uppercase tracking-wider font-semibold mb-2">Digital Assets</p>
                  <p className="figure-mono text-2xl font-bold text-white tabular-nums mb-1">
                    {formatCurrency(unifiedWallet.digitalValue)}
                  </p>
                  <p className="text-sm font-semibold text-slate-400 mt-auto">
                    {((unifiedWallet.digitalValue / unifiedWallet.totalNetWorth) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>

              {/* Alternative */}
              <div className="group relative rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-400/20 p-5 hover:border-purple-400/40 transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="h-9 w-9 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-400/30 mb-3">
                    <Building2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-[10px] text-purple-300/80 uppercase tracking-wider font-semibold mb-2">Alternative Assets</p>
                  <p className="figure-mono text-2xl font-bold text-white tabular-nums mb-1">
                    {formatCurrency(unifiedWallet.alternativeValue)}
                  </p>
                  <p className="text-sm font-semibold text-slate-400 mt-auto">
                    {((unifiedWallet.alternativeValue / unifiedWallet.totalNetWorth) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 2. Financial Wellness Analyzer - Full Width */}
        <motion.section
          variants={cardVariants}
          className="col-span-12"
        >
          <FinancialWellnessAnalyzer
            overall_score={wellness.overall_score}
            grade={wellness.grade}
            diversification={wellness.diversification}
            liquidity={wellness.liquidity}
            behavioral_resilience={wellness.behavioral_resilience}
            recommendations={recommendations.recommendations}
            strengths={wellness.strengths}
            weaknesses={wellness.weaknesses}
          />
        </motion.section>

        {/* Action Preview - Quick Actions */}
        <motion.section
          variants={cardVariants}
          className="col-span-12 md:col-span-6 rounded-3xl border border-white/10 backdrop-blur-[16px] p-8 shadow-glass"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
        >
          <ActionPreview wellness={wellness} />
        </motion.section>

        {/* 3. Recent Transactions - 6 Columns */}
        <motion.section
          variants={cardVariants}
          className="col-span-12 md:col-span-6 rounded-3xl border border-white/10 backdrop-blur-[16px] p-8 shadow-glass overflow-hidden"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
            </div>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View All</button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-2xl backdrop-blur-sm border border-white/5 p-5 hover:border-white/10 transition-all cursor-pointer"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {tx.trend === 'up' ? (
                      <ArrowUpRight className="h-5 w-5 text-green-400" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{tx.name}</p>
                    <p className="text-xs text-slate-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`figure-mono text-sm font-semibold ${
                    tx.type === 'buy' ? 'text-green-400' : 'text-white'
                  }`}>
                    {tx.type === 'buy' ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">{tx.type}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 4. Asset Allocation - 6 Columns */}
        <motion.section
          variants={cardVariants}
          className="col-span-12 md:col-span-6 rounded-3xl border border-white/10 backdrop-blur-[16px] p-8 shadow-glass overflow-hidden"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wallet2 className="h-4 w-4 text-purple-400" />
              <h2 className="text-base font-semibold text-white">Asset Allocation</h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-40 w-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-4">
              {allocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-200">{item.name}</span>
                  </div>
                  <span className="figure-mono text-sm font-medium text-white">
                    {((item.value / unifiedWallet.totalNetWorth) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 5. Scenario Analysis - 6 Columns */}
        <motion.section
          variants={cardVariants}
          className="col-span-12 md:col-span-6 rounded-3xl border border-white/10 backdrop-blur-[16px] p-8 shadow-glass overflow-hidden"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Scenario Analysis</h2>
            </div>
          </div>

          <label className="block text-sm text-slate-300 mb-3">
            What if S&P 500 drops by <span className="text-white font-semibold">{stressDrop}%</span>?
          </label>
          <input
            type="range"
            min={0}
            max={40}
            value={stressDrop}
            onChange={(event) => setStressDrop(Number(event.target.value))}
            className="w-full accent-blue-500 mb-6"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl backdrop-blur-sm border border-white/5 p-5" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
              <p className="text-xs text-slate-300 mb-3">Projected Net Worth</p>
              <p className="figure-mono text-lg font-semibold text-white">
                {formatCurrency(scenario.adjustedWorth)}
              </p>
              <p className="text-xs text-red-400 mt-2">
                -{formatCurrency(unifiedWallet.totalNetWorth - scenario.adjustedWorth)}
              </p>
            </div>
            <div className="rounded-2xl backdrop-blur-sm border border-white/5 p-5" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
              <p className="text-xs text-slate-300 mb-3">Projected Score</p>
              <p className="figure-mono text-lg font-semibold text-white">
                {scenario.adjustedScore.toFixed(0)}
              </p>
              <p className="text-xs text-red-400 mt-2">
                -{(wellness.overall_score - scenario.adjustedScore).toFixed(1)} points
              </p>
            </div>
          </div>
        </motion.section>

        {/* 6. Proactive Insights - 6 Columns */}
        <motion.section
          variants={cardVariants}
          className="col-span-12 md:col-span-6 rounded-3xl border border-white/10 backdrop-blur-[16px] p-8 shadow-glass overflow-hidden"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h2 className="text-base font-semibold text-white">Proactive Insights</h2>
            </div>
          </div>

          <div className="space-y-4">
            {liquidityLow && (
              <motion.article
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl border border-blue-400/40 bg-blue-500/10 p-5"
              >
                <p className="text-sm font-medium text-blue-300 mb-2">Liquidity Alert</p>
                <p className="text-xs text-slate-200">
                  Liquidity is {(wellness.liquidity.liquidity_ratio * 100).toFixed(1)}%. Consider rebalancing.
                </p>
              </motion.article>
            )}

            {(recommendations.recommendations ?? []).slice(0, 3).map((tip: string, idx: number) => (
              <div
                key={idx}
                className="rounded-2xl backdrop-blur-sm border border-white/5 p-5 hover:border-white/10 transition-all cursor-pointer"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
              >
                <p className="text-sm text-white">{tip}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 7. Wealth Composition - Full Width */}
        <motion.section
          variants={cardVariants}
          className="col-span-12 rounded-3xl border border-white/10 backdrop-blur-[16px] p-8 shadow-glass overflow-hidden"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <h2 className="text-lg font-bold text-white">Wealth Composition</h2>
              </div>
              <p className="text-xs text-slate-400">Breakdown of your portfolio by asset type and health status</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Strong
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Healthy
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Watch
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Risk
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {treemapData && treemapData.map((asset, index) => {
              const percentage = ((asset.size / unifiedWallet.totalNetWorth) * 100).toFixed(1)
              const healthColor = asset.fill
              
              return (
                <motion.div
                  key={asset.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative rounded-2xl border border-white/10 p-6 hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden"
                  style={{ 
                    backgroundColor: `${healthColor}10`,
                    borderColor: `${healthColor}30`,
                  }}
                >
                  {/* Background gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${healthColor}15 0%, transparent 100%)`,
                    }}
                  />
                  
                  <div className="relative z-10">
                    {/* Health indicator badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ 
                          backgroundColor: `${healthColor}20`,
                          color: healthColor,
                          border: `1px solid ${healthColor}40`,
                        }}
                      >
                        {asset.health >= 80 ? '🟢 Strong' : asset.health >= 65 ? '🔵 Healthy' : asset.health >= 50 ? '🟠 Watch' : '🔴 Risk'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{percentage}%</span>
                    </div>

                    {/* Asset name */}
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                      {asset.name}
                    </h3>

                    {/* Asset value */}
                    <p className="figure-mono text-2xl font-black text-white mb-3 tracking-tight">
                      {formatCurrency(asset.size)}
                    </p>

                    {/* Health score bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Health Score</span>
                        <span className="font-bold" style={{ color: healthColor }}>{asset.health.toFixed(0)}/100</span>
                      </div>
                      <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: healthColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${asset.health}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div 
                    className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ backgroundColor: healthColor }}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* 8. Security Notice - Full Width */}
        <motion.section
          variants={cardVariants}
          className="col-span-12 rounded-3xl border border-white/10 backdrop-blur-[16px] p-8 shadow-glass overflow-hidden"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Lock className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-white mb-2">Trust & Security</h2>
              <p className="text-xs text-slate-300 mb-4">
                Your data is protected with enterprise-grade encryption, tokenized account linking, and continuous monitoring.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">
                  <ShieldCheck className="mr-1.5 h-3 w-3" /> Bank-Level Encryption
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                  <ShieldCheck className="mr-1.5 h-3 w-3" /> SOC 2 Compliant
                </span>
                <span className="inline-flex items-center rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300">
                  <ShieldCheck className="mr-1.5 h-3 w-3" /> Zero-Knowledge Architecture
                </span>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </motion.div>
    </>
  )
}
