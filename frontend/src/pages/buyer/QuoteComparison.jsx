import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCpu, FiCheck } from 'react-icons/fi'
import Avatar from '../../components/Avatar'
import StarRating from '../../components/StarRating'
import EmptyState from '../../components/EmptyState'
import { formatINR } from '../../utils/format'
import { useToast } from '../../context/ToastContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function QuoteComparison() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { requirementById, quotesForRequirement, acceptQuote } = useData()
  const req = requirementById(id)
  const quotes = quotesForRequirement(id)
  const [sort, setSort] = useState('price')
  const [recommended, setRecommended] = useState(null)
  const [acceptedId, setAcceptedId] = useState(null)

  const sorted = useMemo(() => {
    const r = [...quotes]
    if (sort === 'price') r.sort((a, b) => a.price - b.price)
    if (sort === 'rating') r.sort((a, b) => b.rating - a.rating)
    if (sort === 'delivery') r.sort((a, b) => a.deliveryDays - b.deliveryDays)
    return r
  }, [quotes, sort])

  const getRecommendation = () => {
    // Simulated AI: score = rating weight - normalized price - delivery
    const best = [...quotes].sort((a, b) => {
      const sa = a.rating * 20 - a.price / 1000 - a.deliveryDays
      const sb = b.rating * 20 - b.price / 1000 - b.deliveryDays
      return sb - sa
    })[0]
    setRecommended(best?.id)
    toast(`AI recommends ${best?.seller} as the best overall value`)
  }

  if (!quotes.length) {
    return <EmptyState title="No quotes to compare" />
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-16" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>

      <div className="page-head">
        <div>
          <h1 className="page-title">Quote Comparison</h1>
          <p className="muted">Compare quotes for <strong>{req?.title || 'your requirement'}</strong> and select the best offer.</p>
        </div>
        <div className="flex gap-12">
          <select className="select" style={{ maxWidth: 190 }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="price">Price: Low to High</option>
            <option value="rating">Rating: High to Low</option>
            <option value="delivery">Fastest Delivery</option>
          </select>
          <button className="btn btn-primary" onClick={getRecommendation}><FiCpu /> Get AI Recommendation</button>
        </div>
      </div>

      <motion.div className="table-wrap" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Seller</th>
              <th>Price</th>
              <th>Delivery</th>
              <th>Rating</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((q) => (
              <tr key={q.id} className={recommended === q.id ? 'best-row' : ''}>
                <td>
                  <div className="flex items-center gap-12">
                    <Avatar name={q.seller} size="sm" />
                    <div>
                      <div style={{ fontWeight: 600 }}>{q.seller}</div>
                      {recommended === q.id && <span className="badge badge-success">AI Pick</span>}
                    </div>
                  </div>
                </td>
                <td><strong style={{ color: 'var(--brand-500)' }}>{formatINR(q.price)}</strong></td>
                <td>{q.deliveryDays} days</td>
                <td><StarRating value={q.rating} count={q.reviews} size={12} /></td>
                <td>{q.experience}</td>
                <td>
                  <button
                    className={`btn btn-sm ${acceptedId === q.id ? 'btn-soft' : 'btn-primary'}`}
                    onClick={() => { setAcceptedId(q.id); acceptQuote(q.id); toast(`Accepted ${q.seller}'s quote!`) }}
                  >
                    {acceptedId === q.id ? <><FiCheck /> Accepted</> : 'Select'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <p className="dim text-center mt-16" style={{ fontSize: '0.85rem' }}>
        Can&apos;t decide? Let our AI help you choose the best seller based on price, rating and delivery.
      </p>
    </div>
  )
}
