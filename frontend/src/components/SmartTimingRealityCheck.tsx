import { motion } from 'framer-motion'
import { Clock, Brain, Activity, AlertCircle } from 'lucide-react'
import { useCalmMode } from '../hooks/useCalmMode'

export default function SmartTimingRealityCheck() {
  const { isEnabled, emotionalAnalysis, checkTradingTiming } = useCalmMode()

  if (!isEnabled) return null

  const timingCheck = checkTradingTiming()
  const { state, recentTradeCount, recommendation } = emotionalAnalysis

  const stateConfig = {
    calm: { icon: Brain, bg: 'from-green-500/20', text: 'text-green-400', emoji: '🧘' },
    cautious: { icon: Activity, bg: 'from-yellow-500/20', text: 'text-yellow-400', emoji: '🤔' },
    emotional: { icon: AlertCircle, bg: 'from-orange-500/20', text: 'text-orange-400', emoji: '😰' },
    panicked: { icon: AlertCircle, bg: 'from-red-500/20', text: 'text-red-400', emoji: '😱' },
  }

  const config = stateConfig[state]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-2.5 rounded-lg">
          <Clock className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Smart Timing Reality Check</h3>
      </div>

      {/* Emotional state indicator */}
      <div className={`bg-gradient-to-br ${config.bg} to-transparent border border-white/10 rounded-xl p-4 mb-4`}>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{config.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-5 h-5 ${config.text}`} />
              <h4 className={`font-bold ${config.text} capitalize`}>{state}</h4>
            </div>
            <p className="text-sm text-gray-300">{recommendation}</p>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${config.text}`}>{recentTradeCount}</div>
            <div className="text-xs text-gray-400">Recent trades</div>
          </div>
        </div>

        {/* Emotional state bar */}
        <div className="mt-3 flex gap-1">
          {['calm', 'cautious', 'emotional', 'panicked'].map((s, idx) => (
            <motion.div
              key={s}
              className={`h-2 flex-1 rounded-full ${
                idx <= ['calm', 'cautious', 'emotional', 'panicked'].indexOf(state)
                  ? 'bg-gradient-to-r ' + stateConfig[s as keyof typeof stateConfig].bg
                  : 'bg-white/5'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Timing information */}
      {!timingCheck.isOptimal && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-4"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-300 leading-relaxed">{timingCheck.message}</p>
          </div>
        </motion.div>
      )}

      {/* Reality check questions */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-white mb-3">Before you trade, ask yourself:</p>
        
        <div className="space-y-2">
          {[
            'Is this based on research or emotion?',
            'Have I reviewed my strategy recently?',
            'Am I trading to recover losses?',
            'Can this wait until tomorrow?',
          ].map((question, idx) => (
            <motion.div
              key={question}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-2 text-xs text-gray-300"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
              <span>{question}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action buttons based on emotional state */}
      <div className="mt-4 flex gap-2">
        {state === 'panicked' || state === 'emotional' ? (
          <>
            <button className="flex-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-white text-sm py-2 rounded-lg transition-all">
              Take a Break
            </button>
            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm py-2 rounded-lg transition-all">
              Review Strategy
            </button>
          </>
        ) : (
          <button className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-white text-sm py-2 rounded-lg transition-all">
            Proceed with Caution
          </button>
        )}
      </div>
    </motion.div>
  )
}
