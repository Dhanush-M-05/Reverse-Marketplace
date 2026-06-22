import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiCalendar, FiArrowLeft, FiUser } from 'react-icons/fi'
import StatusBadge from '../../components/StatusBadge'
import FileUpload from '../../components/FileUpload'
import EmptyState from '../../components/EmptyState'
import { AIPriceCard } from '../../components/AIInsights'
import { categoryName } from '../../data/categories'
import { formatINR, formatDate } from '../../utils/format'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function SubmitQuote() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const { requirementById, quotesBySeller, addQuote } = useData()
  const req = requirementById(id)
  const [form, setForm] = useState({ price: '', deliveryDays: '5', note: '' })

  if (!req) {
    return <EmptyState title="Requirement not found" action={<Link to="/seller/browse" className="btn btn-primary">Browse requirements</Link>} />
  }

  const alreadyQuoted = quotesBySeller(user?.id).some((q) => q.requirementId === req.id)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (alreadyQuoted) {
      toast('You have already submitted a quote for this requirement.', 'info')
      return
    }
    addQuote(form, req, user)
    toast('Quote submitted! The buyer will review it soon.')
    navigate('/seller/quotes')
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-16" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>

      <div className="detail-grid">
        <div className="card panel">
          <div className="flex justify-between items-center wrap gap-12">
            <span className="badge badge-brand">{categoryName(req.category)} · {req.subCategory}</span>
            <StatusBadge status={req.status} />
          </div>
          <h1 className="page-title mt-16">{req.title}</h1>

          <div className="flex items-center gap-12 mt-16">
            <span className="avatar avatar-sm"><FiUser /></span>
            <div>
              <div style={{ fontWeight: 600 }}>{req.buyerName}</div>
              <div className="dim" style={{ fontSize: '0.8rem' }}>Buyer · {req.location}</div>
            </div>
          </div>

          <div className="req-meta mt-16" style={{ fontSize: '0.88rem' }}>
            <span><FiMapPin /> {req.location}</span>
            <span><FiCalendar /> Deadline {formatDate(req.deadline)}</span>
          </div>

          <div className="divider" />
          <div className="kv"><span>Budget</span><span style={{ color: 'var(--brand-500)' }}>{formatINR(req.budget)}</span></div>
          <div className="kv"><span>Priority</span><span style={{ textTransform: 'capitalize' }}>{req.priority}</span></div>
          <div className="kv"><span>Quotes so far</span><span>{req.quotesCount}</span></div>

          <h4 className="mt-24 mb-8">Description</h4>
          <p className="muted">{req.description}</p>

          {((req.uploadedImages && req.uploadedImages.length > 0) || req.images > 0) && (
            <>
              <h4 className="mt-24 mb-8">Attachments</h4>
              <div className="thumb-strip" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {req.uploadedImages && req.uploadedImages.map((imgUrl, i) => (
                  <div 
                    className="thumb-box" 
                    key={i} 
                    style={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: 8, 
                      overflow: 'hidden', 
                      border: '1px solid var(--border-strong)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    onClick={() => {
                      const w = window.open()
                      if (w) {
                        w.document.write(`<img src="${imgUrl}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`)
                        w.document.close()
                      }
                    }}
                  >
                    <img src={imgUrl} alt={`Attachment ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
                {(!req.uploadedImages || req.uploadedImages.length === 0) && Array.from({ length: req.images }).map((_, i) => (
                  <div className="thumb-box" key={i}>🖼️</div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="stack gap-16">
          <motion.form className="card panel" onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="mb-16">Submit Your Quote</h3>
            <div className="field">
              <label>Your Price (₹) *</label>
              <input className="input" type="number" required placeholder="23900" value={form.price} onChange={set('price')} />
            </div>
            <div className="field">
              <label>Delivery Time</label>
              <select className="select" value={form.deliveryDays} onChange={set('deliveryDays')}>
                {[3, 4, 5, 6, 7, 10, 14].map((d) => <option key={d} value={d}>{d} Days</option>)}
              </select>
            </div>
            <div className="field">
              <label>Notes to Buyer</label>
              <textarea className="textarea" placeholder="Describe your offer, warranty, etc." value={form.note} onChange={set('note')} />
            </div>
            <div className="field">
              <label>Attachments</label>
              <FileUpload />
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={alreadyQuoted}>
              {alreadyQuoted ? 'Quote Already Submitted' : 'Submit Quote'}
            </button>
          </motion.form>

          <AIPriceCard recommended={Math.round(req.budget * 0.95)} market={req.budget} />
        </div>
      </div>
    </div>
  )
}
