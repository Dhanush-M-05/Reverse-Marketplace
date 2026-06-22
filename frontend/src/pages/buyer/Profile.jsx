import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiCheckCircle } from 'react-icons/fi'
import Avatar from '../../components/Avatar'
import StarRating from '../../components/StarRating'
import RequirementCard from '../../components/RequirementCard'
import ReviewCard from '../../components/ReviewCard'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../utils/format'
import '../dashboard.css'
import './profile.css'

const TABS = ['About', 'Requirements', 'Reviews']

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const { myRequirements, ordersForBuyer, reviewsForSeller } = useData()
  const [tab, setTab] = useState('About')
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ name: user?.name, bio: user?.bio, location: user?.location, phone: user?.phone })

  const allReqs = myRequirements(user?.id)
  const myReqs = allReqs.slice(0, 4)
  const orders = ordersForBuyer(user?.id)
  const reviews = reviewsForSeller(user?.name)

  const save = (e) => {
    e.preventDefault()
    updateProfile(form)
    toast('Profile updated')
    setEdit(false)
  }

  const completed = orders.filter((o) => o.status === 'completed').length
  const stats = [
    { value: String(allReqs.length), label: 'Requirements' },
    { value: String(orders.length), label: 'Orders' },
    { value: orders.length ? `${Math.round((completed / orders.length) * 100)}%` : '0%', label: 'Success' },
  ]

  return (
    <div>
      <motion.div className="profile-cover card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-cover-bg" />
        <div className="profile-cover-body">
          <Avatar name={user?.name} size="xl" />
          <div className="profile-cover-info">
            <h1 className="page-title">
              {user?.name} {user?.verified && <FiCheckCircle style={{ color: 'var(--info)' }} />}
            </h1>
            <p className="muted" style={{ textTransform: 'capitalize' }}>{user?.role} · {user?.location}</p>
            <div className="mt-8"><StarRating value={user?.rating || 0} count={user?.reviews || 0} showValue /></div>
          </div>
          <button className="btn btn-ghost" onClick={() => setEdit(true)}><FiEdit2 /> Edit Profile</button>
        </div>
        <div className="profile-stats" style={{ maxWidth: 360 }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div className="ps-val">{s.value}</div>
              <div className="ps-label">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="tabs mt-24">
        {TABS.map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'About' && (
        <div className="card panel">
          <h3 className="mb-16">About Me</h3>
          <p className="muted">{user?.bio || 'No bio yet.'}</p>
          <div className="divider" />
          <div className="kv"><span>Email</span><span>{user?.email}</span></div>
          <div className="kv"><span>Phone</span><span>{user?.phone || '—'}</span></div>
          <div className="kv"><span>Location</span><span>{user?.location || '—'}</span></div>
          <div className="kv"><span>Member since</span><span>{formatDate(user?.joined)}</span></div>
        </div>
      )}

      {tab === 'Requirements' && (
        myReqs.length === 0 ? (
          <EmptyState title="No requirements yet" subtitle="Requirements you post will appear here." />
        ) : (
          <div className="grid cols-2">
            {myReqs.map((r, i) => <RequirementCard key={r.id} req={r} to={`/buyer/requirements/${r.id}`} index={i} cta="View" />)}
          </div>
        )
      )}

      {tab === 'Reviews' && (
        reviews.length === 0 ? (
          <EmptyState title="No reviews yet" />
        ) : (
          <div className="grid cols-2">
            {reviews.slice(0, 4).map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
          </div>
        )
      )}

      <Modal
        open={edit}
        onClose={() => setEdit(false)}
        title="Edit Profile"
        footer={<><button className="btn btn-ghost" onClick={() => setEdit(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save</button></>}
      >
        <form onSubmit={save}>
          <div className="field"><label>Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>Phone</label><input className="input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="field"><label>Location</label><input className="input" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div className="field"><label>Bio</label><textarea className="textarea" value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
        </form>
      </Modal>
    </div>
  )
}
