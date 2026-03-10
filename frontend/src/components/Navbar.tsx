import { NavLink, useNavigate } from 'react-router-dom'
import { User, LayoutDashboard, Wallet, Target, TrendingUp, Settings, LogOut } from 'lucide-react'
import BrandLogo from './BrandLogo'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const displayName = user?.full_name || user?.username || user?.email || 'User'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-surface-base/70 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-2 shrink-0">
            <div className="rounded-lg border border-white/10 bg-white/5 p-1.5 shadow-glass">
              <BrandLogo className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold gradient-text">Guardian</h1>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-1.5 py-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30 shadow-[0_0_0_1px_rgba(96,165,250,0.2)]'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'
                    }`
                  }
                >
                  <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline font-semibold tracking-wide">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-1.5 text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group cursor-pointer"
                title="View Profile"
              >
                <User className="w-4 h-4 text-slate-300 group-hover:text-blue-300 transition-colors" />
                <span className="hidden lg:inline text-slate-200 font-semibold group-hover:text-blue-300 transition-colors whitespace-nowrap max-w-[140px] truncate">{displayName}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-all text-xs sm:text-sm border border-transparent hover:border-red-500/30"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

