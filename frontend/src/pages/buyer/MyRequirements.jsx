import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlusCircle, FiEdit2, FiTrash2 } from 'react-icons/fi'
import SearchBar from '../../components/SearchBar'
import RequirementCard from '../../components/RequirementCard'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

const PER_PAGE = 4

export default function MyRequirements() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { myRequirements, updateRequirement, deleteRequirement } = useData()
  const items = myRequirements(user?.id)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => {
    return items.filter((r) => {
      const matchQ = r.title.toLowerCase().includes(query.toLowerCase())
      const matchT = tab === 'all' || r.status === tab
      return matchQ && matchT
    })
  }, [items, query, tab])

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const saveEdit = (e) => {
    e.preventDefault()
    updateRequirement(editing.id, editing)
    toast('Requirement updated')
    setEditing(null)
  }

  const confirmDelete = () => {
    deleteRequirement(deleting.id)
    toast('Requirement deleted', 'info')
    setDeleting(null)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">My Requirements</h1>
          <p className="muted">Manage all the requirements you have posted.</p>
        </div>
        <Link to="/buyer/post" className="btn btn-primary"><FiPlusCircle /> New Requirement</Link>
      </div>

      <div className="tabs">
        {['all', 'open', 'in_progress', 'completed'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setPage(1) }}>
            {t === 'all' ? 'All' : t.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1) }} placeholder="Search requirements..." />
      </div>

      {paged.length === 0 ? (
        <EmptyState title="No requirements found" subtitle="Try adjusting your search or post a new requirement." action={<Link to="/buyer/post" className="btn btn-primary">Post Requirement</Link>} />
      ) : (
        <div className="grid cols-2">
          {paged.map((r, i) => (
            <div key={r.id} style={{ position: 'relative' }}>
              <RequirementCard req={r} to={`/buyer/requirements/${r.id}`} index={i} cta="View Quotes" />
              <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 6 }}>
                <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setEditing({ ...r })} aria-label="Edit"><FiEdit2 /></button>
                <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setDeleting(r)} aria-label="Delete"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Requirement"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
          </>
        }
      >
        {editing && (
          <form onSubmit={saveEdit}>
            <div className="field"><label>Title</label><input className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div className="field"><label>Budget (₹)</label><input className="input" type="number" value={editing.budget} onChange={(e) => setEditing({ ...editing, budget: Number(e.target.value) })} /></div>
            <div className="field"><label>Status</label>
              <select className="select" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="field"><label>Description</label><textarea className="textarea" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
          </form>
        )}
      </Modal>

      {/* Delete modal */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Requirement"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleting(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
          </>
        }
      >
        <p className="muted">Are you sure you want to delete <strong>{deleting?.title}</strong>? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}
