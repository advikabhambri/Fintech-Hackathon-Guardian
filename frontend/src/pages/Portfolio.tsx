import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import api from '../lib/api'
import WealthWallet from '../components/WealthWallet'
import { useWealthHubData } from '../hooks/useWealthHubData'
import CalmModeWidget from '../components/CalmModeWidget'
import { useCalmMode } from '../hooks/useCalmMode'

interface PortfolioItem {
  id: number
  asset_name: string
  asset_type: string
  quantity: number
  purchase_price: number
  current_price: number | null
  currency: string
  notes: string | null
  created_at: string
}

// Mock data for demo when backend is not available
const MOCK_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    asset_name: 'Apple Inc.',
    asset_type: 'stocks',
    quantity: 50,
    purchase_price: 150.25,
    current_price: 178.50,
    currency: 'USD',
    notes: 'Long-term investment',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    asset_name: 'Bitcoin',
    asset_type: 'crypto',
    quantity: 0.5,
    purchase_price: 45000,
    current_price: 52000,
    currency: 'USD',
    notes: 'Digital gold',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    asset_name: 'US Treasury Bonds',
    asset_type: 'bonds',
    quantity: 100,
    purchase_price: 100,
    current_price: 102.5,
    currency: 'USD',
    notes: 'Safe investment',
    created_at: new Date().toISOString()
  }
]

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    asset_name: '',
    asset_type: 'stocks',
    quantity: '',
    purchase_price: '',
    current_price: '',
    currency: 'USD',
    notes: '',
  })

  
  // Get calm mode integration
  const { executeTrade } = useCalmMode()
  // Get unified wallet data
  const { unifiedWallet } = useWealthHubData()

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/api/portfolio/')
      setItems(response.data)
    } catch (error) {
      console.error('Failed to fetch portfolio:', error)
      // Use mock data when backend is not available
      setItems(MOCK_ITEMS)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Execute with calm mode checks
    const result = await executeTrade(
      {
        type: 'buy',
        asset: formData.asset_name,
        amount: parseFloat(formData.purchase_price) * parseFloat(formData.quantity),
      },
      async () => {
        // Actual trade execution
        await api.post('/api/portfolio/', {
          ...formData,
          quantity: parseFloat(formData.quantity),
          purchase_price: parseFloat(formData.purchase_price),
          current_price: formData.current_price ? parseFloat(formData.current_price) : null,
        })
      }
    )

    if (result.success) {
      setShowModal(false)
      resetForm()
      fetchPortfolio()
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/portfolio/${id}`)
        fetchPortfolio()
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      asset_name: '',
      asset_type: 'stocks',
      quantity: '',
      purchase_price: '',
      current_price: '',
      currency: 'USD',
      notes: '',
    })
  }

  const calculateValue = (item: PortfolioItem) => {
    const price = item.current_price || item.purchase_price
    return price * item.quantity
  }

  const calculateGainLoss = (item: PortfolioItem) => {
    if (!item.current_price) return 0
    return (item.current_price - item.purchase_price) * item.quantity
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-300">Loading...</div>
  }

  const totalValue = items.reduce((sum, item) => sum + calculateValue(item), 0)
  const totalGainLoss = items.reduce((sum, item) => sum + calculateGainLoss(item), 0)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
      
      {/* Calm Mode Widget - Full View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalmModeWidget variant="compact" showVolatilityShield={false} />
      </div>
      
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-slate-300 mt-1 text-sm">Manage your investment portfolio</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Asset</span>
        </button>
      </div>
      {/* Wealth Wallet - Apple Wallet Style */}
      <div className="card">
        <WealthWallet
          totalNetWorth={unifiedWallet.totalNetWorth}
          traditionalValue={unifiedWallet.traditionalValue}
          digitalValue={unifiedWallet.digitalValue}
          alternativeValue={unifiedWallet.alternativeValue}
          assetsCount={unifiedWallet.assetsCount}
          accountsCount={unifiedWallet.accountsCount}
        />
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card">
          <p className="text-xs text-slate-300 font-medium">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-white mt-2">${totalValue.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-300 font-medium">Total Items</p>
          <p className="text-2xl font-bold text-white mt-2">{items.length}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-300 font-medium">Total Gain/Loss</p>
          <p className={`text-2xl font-bold mt-2 ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 font-semibold text-slate-200 text-sm">Asset</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-200 text-sm">Type</th>
                <th className="text-right py-2 px-3 font-semibold text-slate-200 text-sm">Quantity</th>
                <th className="text-right py-2 px-3 font-semibold text-slate-200 text-sm">Purchase Price</th>
                <th className="text-right py-2 px-3 font-semibold text-slate-200 text-sm">Current Price</th>
                <th className="text-right py-2 px-3 font-semibold text-slate-200 text-sm">Value</th>
                <th className="text-right py-2 px-3 font-semibold text-slate-200 text-sm">Gain/Loss</th>
                <th className="text-center py-2 px-3 font-semibold text-slate-200 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => {
                  const gainLoss = calculateGainLoss(item)
                  return (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2.5 px-3 font-medium text-white text-sm">{item.asset_name}</td>
                      <td className="py-2.5 px-3 text-slate-300 text-sm">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                          {item.asset_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-white text-sm">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right text-white text-sm">
                        ${item.purchase_price.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-white text-sm">
                        ${(item.current_price || item.purchase_price).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-white font-medium text-sm">
                        ${calculateValue(item).toFixed(2)}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-medium text-sm ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                    No portfolio items yet. Add your first asset to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Asset</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    value={formData.asset_name}
                    onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Type
                  </label>
                  <select
                    value={formData.asset_type}
                    onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
                    className="input"
                  >
                    <option value="stocks">Stocks</option>
                    <option value="bonds">Bonds</option>
                    <option value="crypto">Crypto</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="cash">Cash</option>
                    <option value="mutual_funds">Mutual Funds</option>
                    <option value="etf">ETF</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.current_price}
                    onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input"
                  rows={3}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Add Asset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
