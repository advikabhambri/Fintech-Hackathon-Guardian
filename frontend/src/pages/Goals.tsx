import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Trash2, CheckCircle } from 'lucide-react'
import api from '../lib/api'
import PersonalizedInsights from '../components/PersonalizedInsights'
import { useWealthHubData } from '../hooks/useWealthHubData'

interface Goal {
  id: number
  title: string
  goal_type: string
  target_amount: number
  current_amount: number
  target_date: string | null
  is_completed: boolean
  description: string | null
  created_at: string
}

// Mock data for demo when backend is not available
const MOCK_GOALS: Goal[] = [
  {
    id: 1,
    title: 'Emergency Fund',
    goal_type: 'emergency_fund',
    target_amount: 20000,
    current_amount: 15100,
    target_date: '2026-12-31',
    is_completed: false,
    description: 'Build 6 months of expenses as safety net',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'House Down Payment',
    goal_type: 'house',
    target_amount: 100000,
    current_amount: 42000,
    target_date: '2028-06-01',
    is_completed: false,
    description: 'Save for 20% down payment on dream home',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Retirement Savings',
    goal_type: 'retirement',
    target_amount: 200000,
    current_amount: 37000,
    target_date: '2045-12-31',
    is_completed: false,
    description: 'Long-term retirement planning',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Vacation Fund',
    goal_type: 'other',
    target_amount: 5000,
    current_amount: 5000,
    target_date: '2026-07-01',
    is_completed: true,
    description: 'European summer trip',
    created_at: new Date().toISOString()
  }
]

export default function Goals() {
  const { wellness, unifiedWallet } = useWealthHubData()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    goal_type: 'retirement',
    target_amount: '',
    current_amount: '',
    target_date: '',
    description: '',
  })

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await api.get('/api/goals/')
      setGoals(response.data)
    } catch (error) {
      console.error('Failed to fetch goals:', error)
      // Use mock data when backend is not available
      setGoals(MOCK_GOALS)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const targetAmount = parseFloat(formData.target_amount)
    const currentAmount = parseFloat(formData.current_amount) || 0

    if (!formData.title.trim()) {
      setFormError('Goal title is required.')
      return
    }
    if (Number.isNaN(targetAmount) || targetAmount <= 0) {
      setFormError('Target amount must be greater than 0.')
      return
    }
    if (currentAmount < 0) {
      setFormError('Current amount cannot be negative.')
      return
    }

    setFormError('')
    setIsSubmitting(true)

    try {
      await api.post('/api/goals/', {
        ...formData,
        target_amount: targetAmount,
        current_amount: currentAmount,
        target_date: formData.target_date || null,
      })
      setShowModal(false)
      resetForm()
      fetchGoals()
    } catch (error) {
      console.error('Failed to create goal:', error)
      setFormError('Could not add goal right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/api/goals/${id}`)
        fetchGoals()
      } catch (error) {
        console.error('Failed to delete goal:', error)
      }
    }
  }

  const handleToggleComplete = async (goal: Goal) => {
    try {
      await api.put(`/api/goals/${goal.id}`, {
        is_completed: !goal.is_completed,
      })
      fetchGoals()
    } catch (error) {
      console.error('Failed to update goal:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      goal_type: 'retirement',
      target_amount: '',
      current_amount: '',
      target_date: '',
      description: '',
    })
    setFormError('')
  }

  const goalProgressPreview = useMemo(() => {
    const targetAmount = parseFloat(formData.target_amount)
    const currentAmount = parseFloat(formData.current_amount) || 0
    if (Number.isNaN(targetAmount) || targetAmount <= 0) return 0
    return Math.min((currentAmount / targetAmount) * 100, 100)
  }, [formData.target_amount, formData.current_amount])

  const calculateProgress = (goal: Goal) => {
    return (goal.current_amount / goal.target_amount) * 100
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-300">Loading...</div>
  }

  const activeGoals = goals.filter((g) => !g.is_completed)
  const completedGoals = goals.filter((g) => g.is_completed)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Goals</h1>
          <p className="text-slate-300 mt-1 text-sm">Track and achieve your financial objectives</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card">
          <p className="text-xs text-slate-300 font-medium">Total Goals</p>
          <p className="text-2xl font-bold text-white mt-2">{goals.length}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-300 font-medium">Active Goals</p>
          <p className="text-2xl font-bold text-blue-400 mt-2">{activeGoals.length}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-300 font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-400 mt-2">{completedGoals.length}</p>
        </div>
      </div>

      {/* Active Goals */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Active Goals</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {activeGoals.length > 0 ? (
            activeGoals.map((goal) => {
              const progress = calculateProgress(goal)
              return (
                <div key={goal.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-white">{goal.title}</h3>
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                        {goal.goal_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleComplete(goal)}
                        className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Mark as complete"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-slate-300 mb-4">{goal.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Progress</span>
                      <span className="font-medium text-white">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        ${goal.current_amount.toLocaleString()}
                      </span>
                      <span className="text-white font-medium">
                        ${goal.target_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {goal.target_date && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-slate-300">
                        Target Date:{' '}
                        <span className="font-medium text-white">
                          {new Date(goal.target_date).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="col-span-2 text-center py-12 text-slate-400 text-sm">
              No active goals. Add your first goal to get started!
            </div>
          )}
        </div>
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Completed Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="card bg-green-500/10 border-green-500/30">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{goal.title}</h3>
                    <p className="text-sm text-slate-300 mt-1">
                      ${goal.target_amount.toLocaleString()}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Insights & Action Plan */}
      <div className="rounded-3xl border border-white/10 backdrop-blur-[16px] p-8 shadow-glass" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
        <PersonalizedInsights
          wellness={wellness}
          unifiedWallet={unifiedWallet}
        />
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowModal(false)
              resetForm()
            }}
          >
          <motion.div
            className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Add New Goal</h2>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Set a target, track progress, and align with your financial plan.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="e.g. Emergency Fund"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Type
                </label>
                <select
                  value={formData.goal_type}
                  onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                  className="input"
                >
                  <option value="retirement">Retirement</option>
                  <option value="emergency_fund">Emergency Fund</option>
                  <option value="house">House</option>
                  <option value="education">Education</option>
                  <option value="vacation">Vacation</option>
                  <option value="debt_payoff">Debt Payoff</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    className="input"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-blue-700">Starting Progress</p>
                  <p className="text-xs font-semibold text-blue-800">{goalProgressPreview.toFixed(1)}%</p>
                </div>
                <div className="h-2.5 w-full rounded-full bg-blue-100">
                  <div
                    className="h-2.5 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${goalProgressPreview}%` }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows={3}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-1 btn-primary disabled:opacity-60" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Goal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}
