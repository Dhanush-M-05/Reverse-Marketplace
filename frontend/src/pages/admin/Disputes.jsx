import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEye } from 'react-icons/fi'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import { disputes as seed } from '../../data/admin'
import { useToast } from '../../context/ToastContext'
import '../dashboard.css'

export default function Disputes() {
  const { toast } = useToast()
  const [items, setItems] = useState(seed)
  const [view, setView] = useState(null)

  const resolve = (id) => {
    setItems((l) => l.map((d) => (d.id === id ? { ...d, status: 'resolved' } : d)))
    toast('Dispute marked resolved')
    setView(null)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dispute Management</h1>
          <p className="muted">Resolve disputes raised by buyers and sellers.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No disputes" subtitle="Disputes raised by users will appear here." />
      ) : (
        <motion.div className="table-wrap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <table className="table">
            <thead>
              <tr><th>Dispute ID</th><th>Order ID</th><th>User</th><th>Reason</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id}>
                  <td className="dim">{d.id}</td>
                  <td>#{d.orderId}</td>
                  <td>{d.user}</td>
                  <td>{d.reason}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td><button className="btn btn-soft btn-sm" onClick={() => setView(d)}><FiEye /> View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title={`Dispute ${view?.id}`}
        footer={view?.status !== 'resolved' && <><button className="btn btn-ghost" onClick={() => setView(null)}>Close</button><button className="btn btn-primary" onClick={() => resolve(view.id)}>Mark Resolved</button></>}
      >
        {view && (
          <div>
            <div className="kv"><span>Order</span><span>#{view.orderId}</span></div>
            <div className="kv"><span>Raised by</span><span>{view.user}</span></div>
            <div className="kv"><span>Reason</span><span>{view.reason}</span></div>
            <div className="kv"><span>Status</span><StatusBadge status={view.status} /></div>
          </div>
        )}
      </Modal>
    </div>
  )
}
