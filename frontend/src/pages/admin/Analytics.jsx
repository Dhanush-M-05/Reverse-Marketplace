import StatCard from '../../components/StatCard'
import EmptyState from '../../components/EmptyState'
import { BarChart, LineChart, DonutChart } from '../../components/Charts'
import { categoryName } from '../../data/categories'
import { formatINR, monthlySeries } from '../../utils/format'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

const DONUT_COLORS = ['#7c4dff', '#00d4b5', '#f5a623', '#ff5d8f', '#4d9bff', '#9b8cff']

export default function Analytics() {
  const { users } = useAuth()
  const { requirements, quotes, orders } = useData()

  const revenue = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const active = users.filter((u) => u.status === 'active').length

  const stats = [
    { label: 'Total Users', value: String(users.length), icon: 'users' },
    { label: 'Active Users', value: String(active), icon: 'users' },
    { label: 'Total Revenue', value: formatINR(revenue), icon: 'wallet' },
    { label: 'Total Quotes', value: String(quotes.length), icon: 'quote' },
  ]

  // Category aggregation from real requirements
  const counts = {}
  requirements.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1 })
  const totalReq = requirements.length
  const categoryRows = Object.entries(counts)
    .map(([cat, n]) => ({ name: categoryName(cat), count: n, percent: totalReq ? Math.round((n / totalReq) * 100) : 0 }))
    .sort((a, b) => b.count - a.count)
  const topCategories = categoryRows.slice(0, 5)
  const donutData = categoryRows.slice(0, 6).map((c, i) => ({ name: c.name, percent: c.percent, color: DONUT_COLORS[i % DONUT_COLORS.length] }))

  const reqSeries = monthlySeries(requirements, 'postedAt')
  const userActivity = reqSeries.map((m) => m.v)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Analytics Overview</h1>
          <p className="muted">Deep insights into platform performance.</p>
        </div>
      </div>

      <div className="dash-grid-4 mb-24">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      <div className="dash-split mb-24">
        <div className="card panel">
          <div className="panel-head"><h3>Requirement Activity</h3><span className="muted" style={{ fontSize: '0.85rem' }}>Last 8 months</span></div>
          <BarChart data={userActivity} />
        </div>
        <div className="card panel">
          <div className="panel-head"><h3>Top Categories</h3></div>
          {topCategories.length === 0 ? (
            <EmptyState title="No data yet" />
          ) : (
            topCategories.map((c) => (
              <div className="flex items-center gap-12 mb-8" key={c.name}>
                <span style={{ minWidth: 100, fontSize: '0.88rem' }}>{c.name}</span>
                <div className="progressbar" style={{ flex: 1 }}><span style={{ width: `${c.percent}%` }} /></div>
                <span className="dim" style={{ minWidth: 36, textAlign: 'right' }}>{c.percent}%</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dash-split">
        <div className="card panel">
          <div className="panel-head"><h3>Requirements Trend</h3><span className="badge badge-brand">Last 8 months</span></div>
          <LineChart data={reqSeries} color="#00d4b5" />
        </div>
        <div className="card panel">
          <div className="panel-head"><h3>Category Split</h3></div>
          {donutData.length === 0 ? (
            <EmptyState title="No data yet" />
          ) : (
            <DonutChart data={donutData} size={150} />
          )}
        </div>
      </div>
    </div>
  )
}
