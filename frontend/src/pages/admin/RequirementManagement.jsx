import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2, FiEye } from 'react-icons/fi'
import SearchBar from '../../components/SearchBar'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { categoryName } from '../../data/categories'
import { formatINR, formatDate } from '../../utils/format'
import { useToast } from '../../context/ToastContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function RequirementManagement() {
  const { toast } = useToast()
  const { requirements, deleteRequirement } = useData()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => requirements.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase()) || r.id.toLowerCase().includes(query.toLowerCase())
  ), [requirements, query])

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Requirement Management</h1>
          <p className="muted">Moderate all requirements posted on the platform.</p>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search requirements..." />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No requirements found" />
      ) : (
        <motion.div className="table-wrap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Title</th><th>Category</th><th>Budget</th><th>Status</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="dim">{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.title}</td>
                  <td>{categoryName(r.category)}</td>
                  <td>{formatINR(r.budget)}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{formatDate(r.postedAt)}</td>
                  <td>
                    <div className="flex gap-8">
                      <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => toast('Viewing ' + r.id)} aria-label="View"><FiEye /></button>
                      <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => { deleteRequirement(r.id); toast('Requirement removed', 'info') }} aria-label="Delete"><FiTrash2 /></button>
                    </div>
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
