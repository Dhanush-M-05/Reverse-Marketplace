import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FiMapPin, FiClock, FiCalendar, FiArrowLeft, FiBarChart2 } from 'react-icons/fi'
import StatusBadge from '../../components/StatusBadge'
import QuoteCard from '../../components/QuoteCard'
import EmptyState from '../../components/EmptyState'
import { AIPriceCard, AISellerMatchCard, AIScamCard } from '../../components/AIInsights'
import { categoryName } from '../../data/categories'
import { formatINR, formatDate, daysLeft } from '../../utils/format'
import { useToast } from '../../context/ToastContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function RequirementDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { requirementById, quotesForRequirement, acceptQuote } = useData()
  const req = requirementById(id)
  const quotes = quotesForRequirement(id)
  const [acceptedId, setAcceptedId] = useState(null)

  if (!req) {
    return <EmptyState title="Requirement not found" action={<Link to="/buyer/requirements" className="btn btn-primary">Back to requirements</Link>} />
  }

  const accept = (q) => {
    setAcceptedId(q.id)
    acceptQuote(q.id)
    toast(`Quote from ${q.seller} accepted! Order created.`)
  }

  const left = daysLeft(req.deadline)

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-16" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>

      <div className="detail-grid">
        <div className="stack gap-24">
          <div className="card panel">
            <div className="flex justify-between items-center wrap gap-12">
              <span className="badge badge-brand">{categoryName(req.category)} · {req.subCategory}</span>
              <StatusBadge status={req.status} />
            </div>
            <h1 className="page-title mt-16">{req.title}</h1>
            <div className="req-meta mt-8" style={{ fontSize: '0.88rem' }}>
              <span><FiMapPin /> {req.location}</span>
              <span><FiCalendar /> Posted {formatDate(req.postedAt)}</span>
              <span><FiClock /> {left > 0 ? `${left} days left` : 'Closing soon'}</span>
            </div>

            <div className="divider" />
            <h4 className="mb-8">Description</h4>
            <p className="muted">{req.description}</p>

            {((req.uploadedImages && req.uploadedImages.length > 0) || req.images > 0) && (
              <>
                <h4 className="mb-8 mt-24">Attachments</h4>
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

          <div className="flex justify-between items-center">
            <h3>Quotes Received ({quotes.length})</h3>
            <Link to={`/buyer/compare/${req.id}`} className="btn btn-soft btn-sm"><FiBarChart2 /> Compare Quotes</Link>
          </div>

          {quotes.length === 0 ? (
            <EmptyState title="No quotes yet" subtitle="Sellers will start submitting quotes shortly." />
          ) : (
            <div className="grid cols-2">
              {quotes.map((q, i) => (
                <QuoteCard
                  key={q.id}
                  quote={q}
                  index={i}
                  accepted={acceptedId === q.id}
                  onAccept={() => accept(q)}
                  onMessage={() => navigate('/buyer/messages')}
                />
              ))}
            </div>
          )}
        </div>

        <div className="stack gap-16">
          <div className="card panel">
            <h4 className="mb-16">Requirement Summary</h4>
            <div className="kv"><span>Budget</span><span style={{ color: 'var(--brand-500)' }}>{formatINR(req.budget)}</span></div>
            <div className="kv"><span>Deadline</span><span>{formatDate(req.deadline)}</span></div>
            <div className="kv"><span>Priority</span><span style={{ textTransform: 'capitalize' }}>{req.priority}</span></div>
            <div className="kv"><span>Quotes</span><span>{quotes.length}</span></div>
            <div className="kv"><span>Lowest Quote</span><span>{formatINR(Math.min(...quotes.map((q) => q.price), req.budget))}</span></div>
          </div>
          <AIPriceCard recommended={Math.round(req.budget * 0.96)} market={req.budget} />
          <AISellerMatchCard />
          <AIScamCard score={req.aiRiskScore} />
        </div>
      </div>
    </div>
  )
}
