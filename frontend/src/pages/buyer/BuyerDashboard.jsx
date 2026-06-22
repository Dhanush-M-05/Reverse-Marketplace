import { Link } from 'react-router-dom'
import { FiPlusCircle } from 'react-icons/fi'
import StatCard from '../../components/StatCard'
import EmptyState from '../../components/EmptyState'
import { LineChart } from '../../components/Charts'
import { formatINR, monthlySeries } from '../../utils/format'
import Avatar from '../../components/Avatar'
import StarRating from '../../components/StarRating'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function BuyerDashboard() {
  const { user } = useAuth()
  const { myRequirements, quotesForBuyer, ordersForBuyer, notifications } = useData()

  const reqs = myRequirements(user?.id)
  const quotes = quotesForBuyer(user?.id)
  const orders = ordersForBuyer(user?.id)
  const activeQuotes = quotes.filter((q) => q.status === 'pending')

  const stats = [
    { label: 'Total Requirements', value: String(reqs.length), icon: 'clipboard' },
    { label: 'Active Quotes', value: String(activeQuotes.length), icon: 'quote' },
    { label: 'Orders', value: String(orders.length), icon: 'box' },
    { label: 'Notifications', value: String(notifications.length), icon: 'bell' },
  ]

  const totalSpent = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const completed = orders.filter((o) => o.status === 'completed').length
  const summary = [
    { label: 'Total Spent', value: formatINR(totalSpent) },
    { label: 'Active Orders', value: String(orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length), positive: true },
    { label: 'Avg Quotes / Req', value: reqs.length ? (quotes.length / reqs.length).toFixed(1) : '0' },
    { label: 'Completed', value: String(completed), positive: true },
  ]

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0] || 'Buyer'} 👋</h1>
          <p className="muted">Here&apos;s what&apos;s happening with your requirements today.</p>
        </div>
        <Link to="/buyer/post" className="btn btn-primary"><FiPlusCircle /> Post Requirement</Link>
      </div>

      <div className="dash-grid-4 mb-24">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      <div className="dash-split mb-24">
        <div className="card panel">
          <div className="panel-head">
            <h3>Requirement Activity</h3>
            <span className="badge badge-brand">Last 8 months</span>
          </div>
          <LineChart data={monthlySeries(reqs, 'postedAt')} />
        </div>

        <div className="card panel">
          <div className="panel-head">
            <h3>Recent Quotes</h3>
            <Link to="/buyer/quotes" className="muted" style={{ fontSize: '0.85rem' }}>View all</Link>
          </div>
          {quotes.length === 0 ? (
            <EmptyState title="No quotes yet" subtitle="Post a requirement to start receiving quotes." />
          ) : (
            quotes.slice(0, 4).map((q) => (
              <div className="list-row" key={q.id}>
                <Avatar name={q.seller} size="sm" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{q.seller}</div>
                  <StarRating value={q.rating} size={11} />
                </div>
                <strong style={{ color: 'var(--brand-500)' }}>{formatINR(q.price)}</strong>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card panel">
        <div className="panel-head">
          <h3>Account Summary</h3>
        </div>
        <div className="summary-row">
          {summary.map((s) => (
            <div className="summary-cell" key={s.label}>
              <div className={`sc-val ${s.positive ? 'pos' : ''}`}>{s.value}</div>
              <div className="sc-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
