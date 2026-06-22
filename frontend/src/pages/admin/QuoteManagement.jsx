import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2 } from 'react-icons/fi'
import SearchBar from '../../components/SearchBar'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { formatINR, formatDate } from '../../utils/format'
import { useToast } from '../../context/ToastContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function QuoteManagement() {
  const { toast } = useToast()
  const { quotes, deleteQuote } = useData()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => quotes.filter((q) =>
    (q.requirementTitle || '').toLowerCase().includes(query.toLowerCase()) || (q.seller || '').toLowerCase().includes(query.toLowerCase())
  ), [quotes, query])

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Quote Management</h1>
          <p className="muted">Review quotes submitted by sellers.</p>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search quotes..." />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No quotes found" />
      ) : (
        <motion.div className="table-wrap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Requirement</th><th>Seller</th><th>Price</th><th>Status</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id}>
                  <td className="dim">{q.id}</td>
                  <td style={{ fontWeight: 600 }}>{q.requirementTitle}</td>
                  <td>{q.seller}</td>
                  <td><strong>{formatINR(q.price)}</strong></td>
                  <td><StatusBadge status={q.status} /></td>
                  <td>{formatDate(q.submittedAt)}</td>
                  <td>
                    <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => { deleteQuote(q.id); toast('Quote removed', 'info') }} aria-label="Delete"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}
