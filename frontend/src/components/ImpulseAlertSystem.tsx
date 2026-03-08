import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react'
import { useCalmMode } from '../hooks/useCalmMode'

const severityConfig = {
  low: {
    icon: Info,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
  },
  medium: {
    icon: AlertCircle,
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    iconBg: 'bg-yellow-500/20',
  },
  high: {
    icon: AlertTriangle,
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    iconBg: 'bg-orange-500/20',
  },
  critical: {
    icon: ShieldAlert,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    iconBg: 'bg-red-500/20',
  },
}

export default function ImpulseAlertSystem() {
  const { activeAlerts, dismissAlert, isEnabled } = useCalmMode()

  if (!isEnabled) return null

  const impulseAlerts = activeAlerts.filter((alert) => alert.type === 'impulse')

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-md">
      <AnimatePresence>
        {impulseAlerts.map((alert) => {
          const config = severityConfig[alert.severity]
          const Icon = config.icon

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`${config.bg} ${config.border} border backdrop-blur-xl rounded-xl p-4 shadow-2xl`}
            >
              <div className="flex items-start gap-3">
                <div className={`${config.iconBg} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${config.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className={`font-semibold ${config.text}`}>Impulse Alert</h4>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{alert.message}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Take a Break
                    </button>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>

              {/* Pulse animation for critical alerts */}
              {alert.severity === 'critical' && (
                <motion.div
                  className="absolute inset-0 border-2 border-red-500 rounded-xl"
                  animate={{
                    opacity: [0.5, 0, 0.5],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
