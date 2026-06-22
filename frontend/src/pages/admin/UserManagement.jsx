import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import SearchBar from '../../components/SearchBar'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/format'
import '../dashboard.css'

export default function UserManagement() {
  const { toast } = useToast()
  const {
    users, pendingSellers, approveUser, rejectUser, removeUser, setUserStatus,
  } = useAuth()
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => users.filter((u) => {
    const q = u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
    const r = role === 'all' || u.role === role
    return q && r
  }), [users, query, role])

  const approve = (u) => { approveUser(u.id); toast(`${u.name} approved`) }
  const reject = (u) => { rejectUser(u.id); toast(`${u.name} rejected`, 'info') }
  const toggleStatus = (u) => setUserStatus(u.id, u.status === 'active' ? 'inactive' : 'active')
  const confirmDelete = () => { removeUser(deleting.id); toast('User removed', 'info'); setDeleting(null) }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="muted">Approve new sellers and manage buyers, sellers and admins.</p>
        </div>
      </div>

      {pendingSellers.length > 0 && (
        <div className="card panel mb-24" style={{ borderColor: 'var(--warning)' }}>
          <div className="panel-head">
            <h3>Pending Seller Approvals <span className="badge badge-warning">{pendingSellers.length}</span></h3>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Requested</th><th>Action</th></tr>
              </thead>
              <tbody>
                {pendingSellers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-12">
                        <Avatar name={u.name} size="sm" />
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td className="muted">{u.email}</td>
                    <td>{formatDate(u.joined)}</td>
                    <td>
                      <div className="flex gap-8">
                        <button className="btn btn-sm btn-primary" onClick={() => approve(u)}><FiCheck /> Approve</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => reject(u)}><FiX /> Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search users..." />
        <select className="select" style={{ maxWidth: 180 }} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="buyer">Buyers</option>
          <option value="seller">Sellers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <motion.div className="table-wrap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-12">
                      <Avatar name={u.name} size="sm" />
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td className="muted">{u.email}</td>
                  <td><span className="chip" style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                  <td><button onClick={() => toggleStatus(u)}><StatusBadge status={u.status} /></button></td>
                  <td>{formatDate(u.joined)}</td>
                  <td>
                    <div className="flex gap-8">
                      {u.status === 'pending' && (
                        <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => approve(u)} aria-label="Approve"><FiCheck /></button>
                      )}
                      <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setDeleting(u)} aria-label="Delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Remove User"
        footer={<><button className="btn btn-ghost" onClick={() => setDeleting(null)}>Cancel</button><button className="btn btn-danger" onClick={confirmDelete}>Remove</button></>}
      >
        <p className="muted">Remove <strong>{deleting?.name}</strong> from the platform?</p>
      </Modal>
    </div>
  )
}
