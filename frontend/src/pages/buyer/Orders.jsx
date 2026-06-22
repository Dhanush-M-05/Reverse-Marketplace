import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEye } from 'react-icons/fi'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import { formatINR, formatDate } from '../../utils/format'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

const TABS = ['all', 'pending', 'accepted', 'in_progress', 'delivered', 'completed', 'cancelled']

export default function Orders({ role = 'buyer' }) {
  const { user } = useAuth()
  const { ordersForBuyer, ordersForSeller } = useData()
  const [tab, setTab] = useState('all')
  const [view, setView] = useState(null)

  const orders = role === 'seller' ? ordersForSeller(user?.id) : ordersForBuyer(user?.id)
  const list = useMemo(
    () => (tab === 'all' ? orders : orders.filter((o) => o.status === tab)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab, orders.length],
  )

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">{role === 'seller' ? 'My Orders' : 'My Orders'}</h1>
          <p className="muted">Track the status of all your orders in one place.</p>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'all' ? 'All' : t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState title="No orders yet" subtitle="Orders appear here once a quote is accepted." />
      ) : (
        <motion.div className="table-wrap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>{role === 'seller' ? 'Buyer' : 'Seller'}</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.title}</div>
                    <div className="dim" style={{ fontSize: '0.78rem' }}>#{o.id}</div>
                  </td>
                  <td>{role === 'seller' ? o.buyer : o.seller}</td>
                  <td><strong>{formatINR(o.amount)}</strong></td>
                  <td>{formatDate(o.date)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    <button className="btn btn-soft btn-sm" onClick={() => setView(o)}><FiEye /> View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal open={!!view} onClose={() => setView(null)} title={`Order #${view?.id}`}>
        {view && (
          <div>
            <h3 className="mb-16">{view.title}</h3>
            <div className="kv"><span>{role === 'seller' ? 'Buyer' : 'Seller'}</span><span>{role === 'seller' ? view.buyer : view.seller}</span></div>
            <div className="kv"><span>Amount</span><span>{formatINR(view.amount)}</span></div>
            <div className="kv"><span>Order Date</span><span>{formatDate(view.date)}</span></div>
            <div className="kv"><span>Estimated Delivery</span><span>{formatDate(view.eta)}</span></div>
            <div className="kv"><span>Status</span><StatusBadge status={view.status} /></div>
            <div className="mt-16">
              <div className="flex justify-between mb-8"><span className="muted">Progress</span><strong>{view.progress}%</strong></div>
              <div className="progressbar"><span style={{ width: `${view.progress}%` }} /></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
