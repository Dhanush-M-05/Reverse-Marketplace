import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SearchBar from '../../components/SearchBar'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { formatINR, formatDate } from '../../utils/format'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function OrderManagement() {
  const { orders } = useData()
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => orders.filter((o) =>
    o.title.toLowerCase().includes(query.toLowerCase()) || o.id.toLowerCase().includes(query.toLowerCase())
  ), [orders, query])

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Order Management</h1>
          <p className="muted">Monitor all orders across the platform.</p>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search orders..." />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No orders found" />
      ) : (
        <motion.div className="table-wrap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <table className="table">
            <thead>
              <tr><th>Order ID</th><th>Title</th><th>Buyer</th><th>Seller</th><th>Amount</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="dim">#{o.id}</td>
                  <td style={{ fontWeight: 600 }}>{o.title}</td>
                  <td>{o.buyer}</td>
                  <td>{o.seller}</td>
                  <td><strong>{formatINR(o.amount)}</strong></td>
                  <td>{formatDate(o.date)}</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}
