import { Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import StatCard from '../../components/StatCard'
import EmptyState from '../../components/EmptyState'
import { LineChart } from '../../components/Charts'
import StatusBadge from '../../components/StatusBadge'
import { formatINR, monthlySeries } from '../../utils/format'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function SellerDashboard() {
  const { user } = useAuth()
  const { quotesBySeller, ordersForSeller, openRequirements } = useData()

  const quotes = quotesBySeller(user?.id)
  const orders = ordersForSeller(user?.id)
  const open = openRequirements()
  const earnings = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const won = quotes.filter((q) => q.status === 'accepted').length

  const stats = [
    { label: 'Open Requirements', value: String(open.length), icon: 'clipboard' },
    { label: 'My Quotes', value: String(quotes.length), icon: 'quote' },
    { label: 'Orders Won', value: String(won), icon: 'box' },
    { label: 'Earnings', value: formatINR(earnings), icon: 'wallet' },
  ]

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Seller Dashboard</h1>
          <p className="muted">Track your quotes, orders and earnings.</p>
        </div>
        <Link to="/seller/browse" className="btn btn-primary"><FiSearch /> Browse Requirements</Link>
      </div>

      <div className="dash-grid-4 mb-24">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      <div className="card panel mb-24">
        <div className="panel-head">
          <h3>Quote Activity</h3>
          <span className="badge badge-brand">Last 8 months</span>
        </div>
        <LineChart data={monthlySeries(quotes, 'submittedAt')} color="#00d4b5" />
      </div>

      <div className="card panel">
        <div className="panel-head">
          <h3>Recent Quotes</h3>
          <Link to="/seller/quotes" className="muted" style={{ fontSize: '0.85rem' }}>View all</Link>
        </div>
        {quotes.length === 0 ? (
          <EmptyState title="No quotes yet" subtitle="Browse open requirements to submit your first quote." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Requirement</th><th>Buyer</th><th>My Price</th><th>Status</th></tr>
              </thead>
              <tbody>
                {quotes.slice(0, 6).map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600 }}>{q.requirementTitle}</td>
                    <td>{q.buyer}</td>
                    <td><strong>{formatINR(q.price)}</strong></td>
                    <td><StatusBadge status={q.status} /></td>
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
