import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet2,
  Landmark,
  Coins,
  Building2,
  TrendingUp,
  TrendingDown,
  Lock,
  ShieldCheck,
  ChevronDown,
  DollarSign,
} from 'lucide-react'

interface WalletCard {
  id: string
  type: 'traditional' | 'crypto' | 'alternative' | 'cash'
  name: string
  value: number
  change: number
  changePercent: number
  icon: any
  gradient: string
  assets: Array<{
    name: string
    value: number
    quantity?: number
    symbol?: string
  }>
}

interface WealthWalletProps {
  totalNetWorth: number
  traditionalValue: number
  digitalValue: number
  alternativeValue: number
  assetsCount: number
  accountsCount: number
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCompact(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return formatCurrency(value)
}

export default function WealthWallet({
  totalNetWorth,
  traditionalValue,
  digitalValue,
  alternativeValue,
  assetsCount,
  accountsCount,
}: WealthWalletProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  // Calculate cash value (approximation based on liquidity)
  const cashValue = totalNetWorth * 0.12

  // Mock individual assets for demonstration
  const walletCards: WalletCard[] = [
    {
      id: 'traditional',
      type: 'traditional',
      name: 'Traditional Portfolio',
      value: traditionalValue,
      change: 12840,
      changePercent: 8.5,
      icon: Landmark,
      gradient: 'from-blue-600 via-blue-500 to-cyan-500',
      assets: [
        { name: 'Apple Inc.', value: traditionalValue * 0.25, quantity: 145, symbol: 'AAPL' },
        { name: 'Microsoft Corp.', value: traditionalValue * 0.20, quantity: 89, symbol: 'MSFT' },
        { name: 'S&P 500 ETF', value: traditionalValue * 0.30, quantity: 234, symbol: 'SPY' },
        { name: 'Treasury Bonds', value: traditionalValue * 0.25, quantity: 50, symbol: 'TLT' },
      ],
    },
    {
      id: 'crypto',
      type: 'crypto',
      name: 'Digital Assets',
      value: digitalValue,
      change: -2340,
      changePercent: -3.2,
      icon: Coins,
      gradient: 'from-amber-500 via-orange-500 to-yellow-500',
      assets: [
        { name: 'Bitcoin', value: digitalValue * 0.60, quantity: 0.85, symbol: 'BTC' },
        { name: 'Ethereum', value: digitalValue * 0.30, quantity: 12.5, symbol: 'ETH' },
        { name: 'Solana', value: digitalValue * 0.10, quantity: 245, symbol: 'SOL' },
      ],
    },
    {
      id: 'alternative',
      type: 'alternative',
      name: 'Alternative Assets',
      value: alternativeValue,
      change: 8920,
      changePercent: 12.1,
      icon: Building2,
      gradient: 'from-purple-600 via-purple-500 to-pink-500',
      assets: [
        { name: 'Private Equity Fund', value: alternativeValue * 0.50 },
        { name: 'Real Estate Portfolio', value: alternativeValue * 0.35 },
        { name: 'Art & Collectibles', value: alternativeValue * 0.15 },
      ],
    },
    {
      id: 'cash',
      type: 'cash',
      name: 'Cash & Equivalents',
      value: cashValue,
      change: 450,
      changePercent: 0.8,
      icon: DollarSign,
      gradient: 'from-emerald-600 via-green-500 to-teal-500',
      assets: [
        { name: 'High-Yield Savings', value: cashValue * 0.60 },
        { name: 'Money Market', value: cashValue * 0.30 },
        { name: 'Checking Account', value: cashValue * 0.10 },
      ],
    },
  ]

  const handleCardClick = (cardId: string) => {
    if (selectedCard === cardId) {
      setSelectedCard(null)
      setExpandedCard(null)
    } else {
      setSelectedCard(cardId)
      setExpandedCard(cardId)
    }
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border border-indigo-400/20">
            <Wallet2 className="h-6 w-6 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Wealth Wallet</h2>
            <p className="text-xs text-slate-400">
              {accountsCount} accounts • {assetsCount} assets • Secured
            </p>
          </div>
        </div>

        {/* Total Balance */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/5">
          <p className="text-xs text-slate-400 mb-1">Total Balance</p>
          <p className="figure-mono text-3xl font-black text-white tracking-tight">
            {formatCurrency(totalNetWorth)}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-400/30">
              <TrendingUp className="h-3 w-3 text-green-300" />
              <span className="text-xs font-bold text-green-300">+12.4%</span>
            </span>
            <span className="text-xs text-slate-500">Past 30 days</span>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative" style={{ perspective: '1000px' }}>
        <div className="space-y-3">
          {walletCards.map((card, index) => {
            const isExpanded = expandedCard === card.id
            const isSelected = selectedCard === card.id
            const Icon = card.icon

            // Calculate stacking effect
            const stackOffset = isExpanded ? 0 : index * -8
            const zIndex = isSelected ? 50 : walletCards.length - index

            return (
              <motion.div
                key={card.id}
                className="relative cursor-pointer"
                style={{ zIndex }}
                initial={false}
                animate={{
                  y: isSelected ? 0 : stackOffset,
                  scale: isSelected ? 1 : 1 - index * 0.02,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={() => handleCardClick(card.id)}
              >
                {/* Card */}
                <motion.div
                  className={`
                    relative overflow-hidden rounded-3xl
                    ${isSelected ? 'shadow-2xl shadow-black/50' : 'shadow-lg'}
                  `}
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                  animate={{
                    height: isExpanded ? 'auto' : '140px',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`} />

                  {/* Noise texture overlay */}
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                    <div className="w-full h-full" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                    }} />
                  </div>

                  {/* Security Chip (like credit cards) */}
                  <div className="absolute top-6 right-6 w-12 h-10 rounded-md bg-gradient-to-br from-yellow-200/40 to-yellow-400/40 border border-yellow-300/50 backdrop-blur-sm" />

                  {/* Content */}
                  <div className="relative z-10 p-6">
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white/90">{card.name}</p>
                          <p className="text-xs text-white/60">{card.assets.length} holdings</p>
                        </div>
                      </div>

                      {/* Security Badge */}
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <Lock className="h-3 w-3 text-white/90" />
                        <span className="text-[10px] font-semibold text-white/90">Secured</span>
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="mb-3">
                      <p className="figure-mono text-3xl font-black text-white tracking-tight drop-shadow-lg">
                        {formatCurrency(card.value)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {card.change >= 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                            <TrendingUp className="h-3 w-3 text-white" />
                            <span className="text-xs font-bold text-white">
                              +{formatCompact(Math.abs(card.change))} ({card.changePercent.toFixed(1)}%)
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                            <TrendingDown className="h-3 w-3 text-white" />
                            <span className="text-xs font-bold text-white">
                              {formatCompact(card.change)} ({card.changePercent.toFixed(1)}%)
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Divider */}
                          <div className="my-4 h-px bg-white/20" />

                          {/* Holdings List */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-3">
                              Holdings
                            </p>
                            {card.assets.map((asset, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-white">{asset.name}</p>
                                  {asset.quantity !== undefined && (
                                    <p className="text-xs text-white/60">
                                      {asset.quantity.toLocaleString()} {asset.symbol || 'units'}
                                    </p>
                                  )}
                                </div>
                                <p className="text-sm font-bold text-white tabular-nums">
                                  {formatCompact(asset.value)}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Security Footer */}
                          <div className="mt-4 pt-4 border-t border-white/20">
                            <div className="flex items-center justify-between text-xs text-white/70">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                <span>Bank-level encryption</span>
                              </div>
                              <span className="font-mono">••• {Math.floor(Math.random() * 9000) + 1000}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expand/Collapse Indicator */}
                    <div className="absolute bottom-2 right-6">
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-5 w-5 text-white/60" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-800/30 border border-white/5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-white mb-1">Protected & Encrypted</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              All your financial data is secured with 256-bit encryption and zero-knowledge architecture. 
              We never store your credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
