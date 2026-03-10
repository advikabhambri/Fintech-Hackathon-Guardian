import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { AlertTriangle, ShieldCheck, TrendingDown, TrendingUp } from 'lucide-react'
import { AssetTab, usePortfolioIntelligence } from '../hooks/usePortfolioIntelligence'

const assetTabs: AssetTab[] = ['stocks', 'bonds', 'gold', 'fd', 'insurance', 'crypto']
const palette = ['#3b82f6', '#06b6d4', '#22c55e', '#eab308', '#f97316', '#8b5cf6']

type Props = {
  selectedTab: AssetTab
  onChangeTab: (tab: AssetTab) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function PortfolioIntelligence({ selectedTab, onChangeTab }: Props) {
  const { isLoading, consolidated, risk, exposure, recommendations, recommendationHistory, retirementForecast, swr, holdingsData } = usePortfolioIntelligence(selectedTab)

  if (isLoading) {
    return <div className="card text-slate-300">Loading Portfolio Intelligence...</div>
  }

  return (
    <section className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Portfolio Intelligence</h2>
            <p className="text-xs text-slate-300 mt-1">Consolidated statement + risk/rebalance intelligence</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">As of {consolidated.as_of_date}</p>
            <p className="text-sm text-slate-300">Monthly Change: <span className={consolidated.monthly_change >= 0 ? 'text-green-400' : 'text-red-400'}>{consolidated.monthly_change >= 0 ? '+' : ''}{formatCurrency(consolidated.monthly_change)}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-white/10 p-4 bg-slate-900">
            <p className="text-xs text-slate-400">Total Portfolio</p>
            <p className="text-xl font-bold text-white mt-1">{formatCurrency(consolidated.total_portfolio)}</p>
          </div>
          <div className="border border-white/10 p-4 bg-slate-900">
            <p className="text-xs text-slate-400">Total Assets</p>
            <p className="text-xl font-bold text-white mt-1">{formatCurrency(consolidated.total_assets)}</p>
          </div>
          <div className="border border-white/10 p-4 bg-slate-900">
            <p className="text-xs text-slate-400">Total Liabilities</p>
            <p className="text-xl font-bold text-white mt-1">{formatCurrency(consolidated.total_liabilities)}</p>
          </div>
          <div className="border border-white/10 p-4 bg-slate-900">
            <p className="text-xs text-slate-400">Net Worth</p>
            <p className="text-xl font-bold text-white mt-1">{formatCurrency(consolidated.net_worth)}</p>
          </div>
        </div>

        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={consolidated.allocation} dataKey="value" nameKey="asset_class" cx="50%" cy="50%" outerRadius={92} label={(d) => `${d.asset_class}: ${d.weight}%`}>
                {consolidated.allocation.map((entry, index) => (
                  <Cell key={entry.asset_class} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-2 mb-4">
          {assetTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onChangeTab(tab)}
              className={`px-3 py-2 border text-sm uppercase tracking-wide ${selectedTab === tab ? 'bg-blue-500/20 border-blue-400/30 text-blue-300' : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border border-white/10 p-4 bg-slate-900">
            <p className="text-xs text-slate-400">Daily P&L</p>
            <p className={`text-lg font-bold mt-1 ${holdingsData.pnl.daily >= 0 ? 'text-green-400' : 'text-red-400'}`}>{holdingsData.pnl.daily >= 0 ? '+' : ''}{formatCurrency(holdingsData.pnl.daily)}</p>
          </div>
          <div className="border border-white/10 p-4 bg-slate-900">
            <p className="text-xs text-slate-400">1M P&L</p>
            <p className={`text-lg font-bold mt-1 ${holdingsData.pnl.one_month >= 0 ? 'text-green-400' : 'text-red-400'}`}>{holdingsData.pnl.one_month >= 0 ? '+' : ''}{formatCurrency(holdingsData.pnl.one_month)}</p>
          </div>
          <div className="border border-white/10 p-4 bg-slate-900">
            <p className="text-xs text-slate-400">1Y P&L</p>
            <p className={`text-lg font-bold mt-1 ${holdingsData.pnl.one_year >= 0 ? 'text-green-400' : 'text-red-400'}`}>{holdingsData.pnl.one_year >= 0 ? '+' : ''}{formatCurrency(holdingsData.pnl.one_year)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Holdings</h3>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-300">
                    <th className="text-left py-2">Asset</th>
                    <th className="text-right py-2">Value</th>
                    <th className="text-right py-2">1Y P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {holdingsData.holdings.length === 0 ? (
                    <tr><td className="py-4 text-slate-400" colSpan={3}>No holdings in this asset class.</td></tr>
                  ) : holdingsData.holdings.map((holding) => (
                    <tr key={holding.id} className="border-b border-white/5">
                      <td className="py-2 text-white">{holding.asset_name}</td>
                      <td className="py-2 text-right text-slate-200">{formatCurrency(holding.market_value)}</td>
                      <td className={`py-2 text-right ${holding.pnl_1y >= 0 ? 'text-green-400' : 'text-red-400'}`}>{holding.pnl_1y >= 0 ? '+' : ''}{formatCurrency(holding.pnl_1y)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Sector Allocation</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={holdingsData.sector_allocation}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="sector" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="weight" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="border border-white/10 p-3 bg-slate-900">
                <p className="text-xs text-slate-400 mb-2">Top Gainers</p>
                {holdingsData.top_gainers.slice(0, 2).map((g) => (
                  <div key={g.id} className="text-xs text-green-400 flex justify-between"><span>{g.symbol}</span><span>{g.pnl_pct_1y.toFixed(1)}%</span></div>
                ))}
              </div>
              <div className="border border-white/10 p-3 bg-slate-900">
                <p className="text-xs text-slate-400 mb-2">Top Losers</p>
                {holdingsData.top_losers.slice(0, 2).map((l) => (
                  <div key={l.id} className="text-xs text-red-400 flex justify-between"><span>{l.symbol}</span><span>{l.pnl_pct_1y.toFixed(1)}%</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <h3 className="text-base font-semibold text-white">Risk Panel</h3>
          </div>
          <div className="border border-white/10 p-4 bg-slate-900 mb-4">
            <p className="text-xs text-slate-400">Overall Risk Score</p>
            <p className="text-3xl font-bold text-white mt-1">{risk.overall_risk_score.toFixed(1)}</p>
            <p className="text-xs uppercase tracking-wide text-blue-300 mt-1">{risk.risk_band}</p>
          </div>
          <div className="space-y-2 text-sm">
            {Object.entries(risk.components).map(([key, value]) => (
              <div key={key} className="flex justify-between text-slate-300 border-b border-white/5 pb-1">
                <span className="capitalize">{key.replace('_', ' ')}</span>
                <span>{value.toFixed(1)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400 mb-2">Overexposure Signals</p>
            {exposure.exposure.slice(0, 4).map((row) => (
              <div key={row.sector} className="text-xs text-slate-300 flex justify-between py-1">
                <span className="flex items-center gap-2">{row.overexposed ? <AlertTriangle className="w-3 h-3 text-red-400" /> : <ShieldCheck className="w-3 h-3 text-green-400" />}{row.sector}</span>
                <span>{row.weight}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-300" />
            <h3 className="text-base font-semibold text-white">Recommendation Panel</h3>
          </div>
          <div className="space-y-3">
            {recommendations.recommendations.length === 0 ? (
              <p className="text-sm text-slate-300">No recommendations at this time.</p>
            ) : recommendations.recommendations.map((rec, idx) => (
              <div key={idx} className="border border-white/10 bg-slate-900 p-4">
                <p className="text-sm text-white mb-2">{rec.reason}</p>
                <p className="text-xs text-slate-300 mb-3">{rec.action}</p>
                <p className="text-xs text-slate-400 mb-3">{rec.explainability}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                  <span className="flex items-center gap-1 text-green-400"><TrendingDown className="w-3 h-3" /> Risk impact {rec.expected_risk_impact}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border border-white/10 bg-slate-900 p-4">
            <p className="text-xs text-slate-400 mb-2">Recent Recommendation History</p>
            {recommendationHistory.history.length === 0 ? (
              <p className="text-xs text-slate-500">No historical recommendations yet.</p>
            ) : recommendationHistory.history.slice(0, 3).map((row, idx) => (
              <div key={`${row.created_at}-${idx}`} className="py-1 border-b border-white/5 last:border-b-0">
                <p className="text-xs text-white">{row.reason}</p>
                <p className="text-[11px] text-slate-400">{new Date(row.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Forecasting & Retirement Gap</h3>
            <p className="text-xs text-slate-400 mt-1">Monte Carlo retirement probability (1,000 simulations) + Safe Withdrawal Rate</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Retirement Goal</p>
            <p className="text-sm text-white font-semibold">{formatCurrency(retirementForecast.target_amount)} by age {retirementForecast.retirement_age}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="border border-white/10 bg-slate-900 p-4">
            <p className="text-xs text-slate-400">Success Probability</p>
            <p className={`text-2xl font-bold mt-1 ${retirementForecast.success_probability >= 70 ? 'text-green-400' : retirementForecast.success_probability >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {retirementForecast.success_probability.toFixed(1)}%
            </p>
          </div>
          <div className="border border-white/10 bg-slate-900 p-4">
            <p className="text-xs text-slate-400">Projected Median Corpus</p>
            <p className="text-xl font-bold text-white mt-1">{formatCurrency(retirementForecast.projected_median)}</p>
            <p className="text-[11px] text-slate-500 mt-1">P10: {formatCurrency(retirementForecast.projected_p10)} · P90: {formatCurrency(retirementForecast.projected_p90)}</p>
          </div>
          <div className="border border-white/10 bg-slate-900 p-4">
            <p className="text-xs text-slate-400">Retirement Gap</p>
            <p className={`text-xl font-bold mt-1 ${retirementForecast.retirement_gap > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {retirementForecast.retirement_gap > 0 ? formatCurrency(retirementForecast.retirement_gap) : 'On Track'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-white/10 bg-slate-900 p-4">
            <p className="text-xs text-slate-400">Safe Withdrawal Rate (SWR)</p>
            <p className="text-sm text-slate-300 mt-1">At {(swr.swr_rate * 100).toFixed(1)}% SWR</p>
            <p className="text-2xl font-bold text-white mt-2">{formatCurrency(swr.monthly_safe_withdrawal)}/month</p>
            <p className="text-xs text-slate-400 mt-1">{formatCurrency(swr.annual_safe_withdrawal)} annually</p>
          </div>

          <div className="border border-white/10 bg-slate-900 p-4">
            <p className="text-xs text-slate-400">How it works</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-300 list-disc pl-4">
              <li>Runs 1,000 simulated return paths using expected return + volatility assumptions.</li>
              <li>Computes probability of reaching your retirement target by the selected age.</li>
              <li>SWR estimates sustainable spending from current net worth using a conservative rate.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
