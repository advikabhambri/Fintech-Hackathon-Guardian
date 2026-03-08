import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Goals from './pages/Goals'
import WealthAnalytics from './pages/WealthAnalytics'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/analytics" element={<WealthAnalytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
