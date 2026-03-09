import { useState, useEffect } from 'react'
import { User, Mail, Edit2, Save, X } from 'lucide-react'
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

  return (
    <div className="min-h-[calc(100vh-80px)] pt-24 px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-slate-400">Manage your account information</p>
        </div>

        {/* Main Card */}
        <div className="bg-surface-card border border-white/10 rounded-2xl p-8 shadow-xl">
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
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
                className="input bg-slate-900/50 text-slate-400 cursor-not-allowed opacity-75"
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
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-success-500 hover:bg-success-600 disabled:bg-success-500/50 text-white rounded-lg transition-colors font-semibold"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white rounded-lg transition-colors font-semibold"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-surface-card border border-white/10 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">User ID</p>
              <p className="text-sm text-white font-mono">{user?.id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Last Updated</p>
              <p className="text-sm text-white">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
