import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, LogIn } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import BrandLogo from '../components/BrandLogo'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base aurora-bg px-4">
      <div className="glass-panel rounded-3xl shadow-xl p-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute -top-20 -left-16 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="text-center mb-8">
          <BrandLogo className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-slate-300 mt-2">Sign in to your Guardian account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="bg-danger-50 text-danger-600 px-4 py-3 rounded-lg text-sm border border-danger-600/30">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 shadow-[0_10px_24px_rgba(30,144,255,0.35)]"
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-300 hover:text-blue-200 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
