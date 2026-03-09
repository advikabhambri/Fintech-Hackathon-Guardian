import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface-base aurora-bg">
      <Navbar />
      <main className="mt-[4.5rem] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
