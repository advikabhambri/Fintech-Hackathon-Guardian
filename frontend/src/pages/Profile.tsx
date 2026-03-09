import { useState, useEffect } from 'react'
import { Mail, Edit2, Save, X } from 'lucide-react'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

export default function Profile() {
  const { user, fetchUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await api.put('/api/auth/me', formData)
      await fetchUser()
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      username: user?.username || '',
    })
    setError('')
    setIsEditing(false)
  }

  const initials = (user?.full_name || user?.username || user?.email || 'U')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-[calc(100vh-80px)] pt-24 px-8 aurora-bg">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 rounded-3xl glass-panel p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-16 -right-14 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Account Center</p>
              <h1 className="text-4xl font-bold gradient-text mt-1">My Profile</h1>
              <p className="text-slate-300 mt-2">Manage your account details and identity settings</p>
            </div>
            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-xl font-bold text-white">
              {initials}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-panel rounded-3xl p-8 shadow-xl">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-success-50 text-success-600 px-4 py-3 rounded-lg flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-success-600"></div>
              <span>{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-danger-50 text-danger-600 px-4 py-3 rounded-lg flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-danger-600"></div>
              <span>{error}</span>
            </div>
          )}

          {/* Profile Avatar Section */}
          <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-white/10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/90 to-purple-600/90 flex items-center justify-center border border-white/20 shadow-glass">
              <span className="text-2xl font-black text-white tracking-wide">{initials}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-400">Member since</p>
              <p className="text-white font-semibold">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">Profile secured</span>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input bg-slate-900/50 text-slate-400 cursor-not-allowed opacity-75 border-white/10"
              />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className={`input ${
                  isEditing
                    ? 'bg-slate-800 text-white border-blue-500/30 focus:border-blue-500'
                    : 'bg-slate-900/50 text-slate-400 cursor-not-allowed opacity-75'
                }`}
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your full name"
                className={`input ${
                  isEditing
                    ? 'bg-slate-800 text-white border-blue-500/30 focus:border-blue-500'
                    : 'bg-slate-900/50 text-slate-400 cursor-not-allowed opacity-75'
                }`}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Account Status</label>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success-500"></div>
                <span className="text-slate-300">
                  {user?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Verification Status */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Verification Status</label>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${user?.is_verified ? 'bg-success-500' : 'bg-slate-500'}`}></div>
                <span className="text-slate-300">
                  {user?.is_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all font-semibold shadow-[0_8px_24px_rgba(30,144,255,0.35)]"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-success-500 hover:bg-success-600 disabled:bg-success-500/50 text-white rounded-xl transition-all font-semibold"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white rounded-xl transition-all font-semibold"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 glass-panel rounded-3xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">User ID</p>
              <p className="text-sm text-white font-mono">{user?.id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Member Since</p>
              <p className="text-sm text-white">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
