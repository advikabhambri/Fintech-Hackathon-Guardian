import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Wallet, Target, Settings as SettingsIcon } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-surface-base border-r border-white/10">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-500/20 text-text-accent'
                  : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
