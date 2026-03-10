import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="relative min-h-screen bg-surface-base">
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
      <Navbar />
      <main className="relative mt-[5.25rem] px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-[1400px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
