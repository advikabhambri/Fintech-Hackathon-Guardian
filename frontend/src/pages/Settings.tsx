import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Bell, 
  Activity, 
  Clock, 
  Sliders,
  Save,
  Info
} from 'lucide-react'
import { useCalmModeStore } from '../store/calmModeStore'

export default function Settings() {
  const {
    isEnabled,
    settings,
    toggleCalmMode,
    updateSettings,
  } = useCalmModeStore()

  const [localSettings, setLocalSettings] = useState(settings)
  const [savedMessage, setSavedMessage] = useState(false)

  // Sync local settings with store settings
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = () => {
    updateSettings(localSettings)
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your Investor Calm Mode preferences</p>
        </div>

        {/* Calm Mode Main Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 mb-6 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${isEnabled ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : 'bg-gray-700/30'}`}>
                <Shield className={`w-6 h-6 ${isEnabled ? 'text-green-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Investor Calm Mode</h2>
                <p className="text-sm text-gray-400 mb-3 max-w-xl">
                  Your behavioral guard against impulsive trading. Monitors trading patterns, analyzes portfolio risk, 
                  and provides real-time alerts to help you make rational investment decisions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                    Impulse Alerts
                  </span>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                    Volatility Shield
                  </span>
                  <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full">
                    Risk Meter
                  </span>
                  <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
                    Timing Check
                  </span>
                </div>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button
              onClick={toggleCalmMode}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 flex-shrink-0 ${
                isEnabled ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-700'
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: isEnabled ? 32 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </motion.div>

        {/* Settings Panels */}
        <AnimatePresence>
          {isEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-6"
            >
            {/* Impulse Alert Settings */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Impulse Alert System</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-300">Trading Cooldown Period</label>
                    <span className="text-sm font-semibold text-blue-400">
                      {Math.round(localSettings.impulseThreshold / 60)} minutes
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="1800"
                    step="60"
                    value={localSettings.impulseThreshold}
                    onChange={(e) => setLocalSettings({ ...localSettings, impulseThreshold: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Alert if multiple trades within this timeframe
                  </p>
                </div>
              </div>
            </div>

            {/* Volatility Settings */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Volatility Shield</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-300">Alert Threshold</label>
                    <span className="text-sm font-semibold text-purple-400">
                      {localSettings.volatilityAlertLevel}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={localSettings.volatilityAlertLevel}
                    onChange={(e) => setLocalSettings({ ...localSettings, volatilityAlertLevel: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Show alert when market volatility exceeds this level
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Tolerance Settings */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sliders className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-semibold">Risk Tolerance</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-300">Maximum Portfolio Risk</label>
                    <span className="text-sm font-semibold text-orange-400">
                      {localSettings.riskToleranceLevel}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={localSettings.riskToleranceLevel}
                    onChange={(e) => setLocalSettings({ ...localSettings, riskToleranceLevel: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Alert when portfolio risk exceeds your tolerance
                  </p>
                </div>
              </div>
            </div>

            {/* Reality Check Settings */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold">Smart Timing Reality Check</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 mb-1">Show Reality Checks</p>
                    <p className="text-xs text-gray-500">
                      Display timing warnings and emotional state analysis
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newValue = !localSettings.showRealityChecks
                      setLocalSettings({ ...localSettings, showRealityChecks: newValue })
                      updateSettings({ showRealityChecks: newValue })
                    }}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 flex-shrink-0 ${
                      localSettings.showRealityChecks ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gray-700'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                      animate={{ x: localSettings.showRealityChecks ? 32 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-1">How Calm Mode Works</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Calm Mode uses behavioral finance principles to protect you from common investing mistakes. 
                    It monitors your trading frequency, portfolio risk levels, and market conditions in real-time, 
                    providing timely interventions when emotional decision-making is detected. This system is designed 
                    to complement—not replace—your investment strategy.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              {savedMessage && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-green-400 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  Settings saved!
                </motion.div>
              )}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/50"
              >
                <Save className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
