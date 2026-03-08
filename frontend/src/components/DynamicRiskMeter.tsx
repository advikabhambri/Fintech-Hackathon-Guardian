import { motion } from 'framer-motion'
import { Gauge, AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import { useCalmMode } from '../hooks/useCalmMode'

export default function DynamicRiskMeter() {
  const { isEnabled, portfolioRisk } = useCalmMode()

  if (!isEnabled) return null

  const { overallRisk, volatilityLevel, diversificationScore } = portfolioRisk

  // Calculate color based on risk level
  const getRiskColor = (risk: number) => {
    if (risk < 30) return { color: 'text-green-400', bg: 'from-green-500', label: 'Low Risk' }
    if (risk < 60) return { color: 'text-blue-400', bg: 'from-blue-500', label: 'Moderate Risk' }
    if (risk < 80) return { color: 'text-orange-400', bg: 'from-orange-500', label: 'High Risk' }
    return { color: 'text-red-400', bg: 'from-red-500', label: 'Critical Risk' }
  }

  const riskConfig = getRiskColor(overallRisk)

  // Calculate angle for gauge (0-180 degrees)
  const gaugeAngle = (overallRisk / 100) * 180

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2.5 rounded-lg">
          <Gauge className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Dynamic Risk Meter</h3>
      </div>

      {/* Gauge visualization */}
      <div className="relative flex items-center justify-center h-32 mb-4">
        {/* Background arc */}
        <svg className="absolute w-48 h-24" viewBox="0 0 200 100">
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Risk gradient arc */}
          <defs>
            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="40%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#riskGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: overallRisk / 100 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0"
          style={{ transformOrigin: 'bottom center' }}
          initial={{ rotate: -90 }}
          animate={{ rotate: gaugeAngle - 90 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className={`w-1 h-16 bg-gradient-to-t ${riskConfig.bg} to-transparent rounded-full`} />
        </motion.div>

        {/* Center display */}
        <div className="absolute bottom-4 text-center">
          <div className={`text-3xl font-bold ${riskConfig.color}`}>{Math.round(overallRisk)}</div>
          <div className="text-xs text-gray-400 mt-1">{riskConfig.label}</div>
        </div>
      </div>

      {/* Risk breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-300">Volatility</span>
          </div>
          <span className={`text-sm font-semibold capitalize ${
            volatilityLevel === 'low' ? 'text-green-400' :
            volatilityLevel === 'medium' ? 'text-blue-400' :
            volatilityLevel === 'high' ? 'text-orange-400' : 'text-red-400'
          }`}>
            {volatilityLevel}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Diversification</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  diversificationScore > 70 ? 'bg-green-500' :
                  diversificationScore > 40 ? 'bg-blue-500' : 'bg-orange-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${diversificationScore}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-300 min-w-[3ch]">
              {Math.round(diversificationScore)}%
            </span>
          </div>
        </div>
      </div>

      {/* Risk recommendation */}
      <div className={`mt-4 p-3 rounded-lg ${
        overallRisk < 60 ? 'bg-green-500/10 border border-green-500/30' :
        overallRisk < 80 ? 'bg-orange-500/10 border border-orange-500/30' :
        'bg-red-500/10 border border-red-500/30'
      }`}>
        <div className="flex items-start gap-2">
          {overallRisk < 60 ? (
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
          )}
          <p className="text-xs text-gray-300 leading-relaxed">
            {overallRisk < 30 && 'Your portfolio risk is well-managed. Continue your balanced approach.'}
            {overallRisk >= 30 && overallRisk < 60 && 'Portfolio risk is moderate. Monitor your positions regularly.'}
            {overallRisk >= 60 && overallRisk < 80 && 'Elevated risk detected. Consider rebalancing to reduce exposure.'}
            {overallRisk >= 80 && 'Critical risk level! Immediate portfolio review recommended.'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
