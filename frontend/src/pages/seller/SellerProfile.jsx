import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiCheckCircle } from 'react-icons/fi'
import Avatar from '../../components/Avatar'
import StarRating from '../../components/StarRating'
import ReviewCard from '../../components/ReviewCard'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../utils/format'
import '../dashboard.css'
import '../buyer/profile.css'

const TABS = ['About', 'Skills', 'Reviews']

export default function SellerProfile() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const { reviewsForSeller, ordersForSeller } = useData()
  const [tab, setTab] = useState('About')
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ name: user?.name, bio: user?.bio, location: user?.location })

  const reviews = reviewsForSeller(user?.name)
  const orders = ordersForSeller(user?.id)
  const skills = (user?.skills && user.skills.length) ? user.skills : []

  const save = (e) => {
    e.preventDefault()
    updateProfile(form)
    toast('Profile updated')
    setEdit(false)
  }

  const completed = orders.filter((o) => o.status === 'completed').length
  const stats = [
    { value: String(completed), label: 'Completed' },
    { value: String(reviews.length), label: 'Reviews' },
    { value: (user?.rating || 0) + '★', label: 'Rating' },
  ]

  return (
    <div>
      <motion.div className="profile-cover card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-cover-bg" />
        <div className="profile-cover-body">
          <Avatar name={user?.name} size="xl" />
          <div className="profile-cover-info">
            <h1 className="page-title">{user?.name} {user?.verified && <FiCheckCircle style={{ color: 'var(--info)' }} />}</h1>
            <p className="muted">Seller · {user?.location}</p>
            <div className="mt-8"><StarRating value={user?.rating || 0} count={user?.reviews || 0} showValue /></div>
          </div>
          <button className="btn btn-ghost" onClick={() => setEdit(true)}><FiEdit2 /> Edit Profile</button>
        </div>
        <div className="profile-stats" style={{ maxWidth: 360 }}>
          {stats.map((s) => (
            <div key={s.label}><div className="ps-val">{s.value}</div><div className="ps-label">{s.label}</div></div>
          ))}
        </div>
      </motion.div>

      <div className="tabs mt-24">
        {TABS.map((t) => <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {tab === 'About' && (
        <div className="card panel">
          <h3 className="mb-16">About</h3>
          <p className="muted">{user?.bio || 'Trusted seller on Reverse Marketplace.'}</p>
          <div className="divider" />
          <div className="kv"><span>Email</span><span>{user?.email}</span></div>
          <div className="kv"><span>Location</span><span>{user?.location || '—'}</span></div>
          <div className="kv"><span>Member since</span><span>{formatDate(user?.joined)}</span></div>
        </div>
      )}

      {tab === 'Skills' && (
        <div className="card panel">
          <h3 className="mb-16">Skills &amp; Services</h3>
          {skills.length === 0 ? (
            <p className="muted">No skills added yet. Edit your profile to add them.</p>
          ) : (
            <div className="flex gap-8 wrap">
              {skills.map((s) => <span className="chip" key={s}>{s}</span>)}
            </div>
          )}
        </div>
      )}

      {tab === 'Reviews' && (
        reviews.length === 0 ? (
          <EmptyState title="No reviews yet" />
        ) : (
          <div className="grid cols-2">
            {reviews.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
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
          <div className="field"><label>Location</label><input className="input" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div className="field"><label>Bio</label><textarea className="textarea" value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
        </form>
      </Modal>
    </div>
  )
}
