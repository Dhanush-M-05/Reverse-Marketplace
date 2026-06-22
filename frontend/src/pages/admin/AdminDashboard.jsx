import StatCard from '../../components/StatCard'
import EmptyState from '../../components/EmptyState'
import { LineChart } from '../../components/Charts'
import StatusBadge from '../../components/StatusBadge'
import { categoryName } from '../../data/categories'
import { formatINR, formatDate, monthlySeries } from '../../utils/format'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function AdminDashboard() {
  const { users, pendingSellers } = useAuth()
  const { requirements, quotes, orders } = useData()

  const revenue = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const stats = [
    { label: 'Total Users', value: String(users.length), icon: 'users' },
    { label: 'Requirements', value: String(requirements.length), icon: 'clipboard' },
    { label: 'Quotes', value: String(quotes.length), icon: 'quote' },
    { label: 'Pending Sellers', value: String(pendingSellers.length), icon: 'bell' },
  ]

  const recent = [...requirements].slice(0, 6)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="muted">Platform-wide metrics and activity.</p>
        </div>
      </div>

      <div className="dash-grid-4 mb-24">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      <div className="card panel mb-24">
        <div className="panel-head">
          <h3>Requirements Posted</h3>
          <span className="badge badge-brand">Revenue {formatINR(revenue)}</span>
        </div>
        <LineChart data={monthlySeries(requirements, 'postedAt')} />
      </div>

      <div className="card panel">
        <div className="panel-head"><h3>Recent Requirements</h3></div>
        {recent.length === 0 ? (
          <EmptyState title="No requirements yet" subtitle="Requirements posted by buyers will appear here." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Title</th><th>Category</th><th>Budget</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td className="dim">{r.id}</td>
                    <td style={{ fontWeight: 600 }}>{r.title}</td>
                    <td>{categoryName(r.category)}</td>
                    <td>{formatINR(r.budget)}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>{formatDate(r.postedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
