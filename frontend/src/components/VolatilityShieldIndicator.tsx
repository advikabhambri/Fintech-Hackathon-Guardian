import { motion } from 'framer-motion'
import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useCalmMode } from '../hooks/useCalmMode'

const volatilityColors = {
  calm: {
    bg: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/40',
    text: 'text-green-400',
    glow: 'shadow-green-500/20',
  },
  normal: {
    bg: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  volatile: {
    bg: 'from-orange-500/20 to-yellow-500/20',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
    glow: 'shadow-orange-500/20',
  },
  extreme: {
    bg: 'from-red-500/20 to-pink-500/20',
    border: 'border-red-500/40',
    text: 'text-red-400',
    glow: 'shadow-red-500/20',
  },
}

export default function VolatilityShieldIndicator() {
  const { isEnabled, volatility } = useCalmMode()

  if (!isEnabled) return null

  const config = volatilityColors[volatility.marketCondition]
  
  const TrendIcon = 
    volatility.trend === 'increasing' ? TrendingUp :
    volatility.trend === 'decreasing' ? TrendingDown : Minus

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${config.bg} backdrop-blur-xl border ${config.border} rounded-xl p-4 ${config.glow} shadow-xl`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0"
          >
            <Shield className={`w-10 h-10 ${config.text} opacity-20`} />
          </motion.div>
          <Shield className={`w-10 h-10 ${config.text} relative z-10`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">Volatility Shield</h3>
            <TrendIcon className={`w-4 h-4 ${config.text}`} />
          </div>
          <p className={`text-lg font-bold ${config.text} capitalize`}>
            {volatility.marketCondition}
          </p>
        </div>

        <div className="text-right">
          <div className={`text-2xl font-bold ${config.text}`}>
            {Math.round(volatility.level)}
          </div>
          <div className="text-xs text-gray-400">Volatility</div>
        </div>
      </div>

      {/* Volatility bar */}
      <div className="mt-3 relative h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${config.bg}`}
          initial={{ width: 0 }}
          animate={{ width: `${volatility.level}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Guidance message */}
      <p className="mt-3 text-xs text-gray-300">
        {volatility.marketCondition === 'calm' && '✅ Great time for strategic moves. Market is stable.'}
        {volatility.marketCondition === 'normal' && 'ℹ️ Standard market conditions. Stay vigilant.'}
        {volatility.marketCondition === 'volatile' && '⚠️ Increased volatility. Consider delaying non-essential trades.'}
        {volatility.marketCondition === 'extreme' && '🚨 Extreme volatility detected. Avoid impulsive decisions!'}
      </p>
    </motion.div>
  )
}
