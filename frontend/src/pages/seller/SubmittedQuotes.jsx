import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import SearchBar from '../../components/SearchBar'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import { formatINR, formatDate } from '../../utils/format'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

const TABS = ['all', 'pending', 'shortlisted', 'accepted', 'rejected']

export default function SubmittedQuotes() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { quotesBySeller, updateQuote, deleteQuote } = useData()
  const items = quotesBySeller(user?.id)
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => items.filter((q) => {
    const t = tab === 'all' || q.status === tab
    const s = (q.requirementTitle || '').toLowerCase().includes(query.toLowerCase())
    return t && s
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [items.length, tab, query])

  const saveEdit = (e) => {
    e.preventDefault()
    updateQuote(editing.id, { price: editing.price, status: editing.status })
    toast('Quote updated')
    setEditing(null)
  }
  const confirmDelete = () => {
    deleteQuote(deleting.id)
    toast('Quote withdrawn', 'info')
    setDeleting(null)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Submitted Quotes</h1>
          <p className="muted">Manage all the quotes you have sent to buyers.</p>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'all' ? 'All' : t}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search quotes..." />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No quotes yet" subtitle="Browse open requirements and submit your first quote." />
      ) : (
        <motion.div className="table-wrap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <table className="table">
            <thead>
              <tr><th>Requirement</th><th>Buyer</th><th>My Price</th><th>Submitted</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id}>
                  <td style={{ fontWeight: 600 }}>{q.requirementTitle}</td>
                  <td>{q.buyer}</td>
                  <td><strong>{formatINR(q.price)}</strong></td>
                  <td>{formatDate(q.submittedAt)}</td>
                  <td><StatusBadge status={q.status} /></td>
                  <td>
                    <div className="flex gap-8">
                      <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setEditing({ ...q })} aria-label="Edit"><FiEdit2 /></button>
                      <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setDeleting(q)} aria-label="Withdraw"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Quote"
        footer={<><button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button><button className="btn btn-primary" onClick={saveEdit}>Save</button></>}
      >
        {editing && (
          <form onSubmit={saveEdit}>
            <div className="field"><label>Price (₹)</label><input className="input" type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></div>
            <div className="field"><label>Status</label>
              <select className="select" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Withdraw Quote"
        footer={<><button className="btn btn-ghost" onClick={() => setDeleting(null)}>Cancel</button><button className="btn btn-danger" onClick={confirmDelete}>Withdraw</button></>}
      >
        <p className="muted">Withdraw your quote for <strong>{deleting?.requirementTitle}</strong>?</p>
      </Modal>
    </div>
  )
}
