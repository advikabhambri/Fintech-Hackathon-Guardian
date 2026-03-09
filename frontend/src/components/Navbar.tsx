import { NavLink } from 'react-router-dom'
import { User, LayoutDashboard, Wallet, Target, TrendingUp, Settings } from 'lucide-react'
import BrandLogo from './BrandLogo'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-surface-base/95 border-b border-white/20 backdrop-blur-md z-50 shadow-lg">
      <div className="px-8 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrandLogo className="w-8 h-8" />
            <h1 className="text-xl font-bold text-white">Guardian</h1>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors text-base ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </NavLink>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 text-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <User className="w-5 h-5 text-slate-300" />
              <span className="text-slate-200 font-semibold">Demo User</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
