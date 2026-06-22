import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiClock, FiFileText, FiImage } from 'react-icons/fi'
import { formatINR, daysLeft } from '../utils/format'
import { categoryName } from '../data/categories'
import StatusBadge from './StatusBadge'

export default function RequirementCard({ req, to, index = 0, cta = 'View Details' }) {
  const left = daysLeft(req.deadline)
  return (
    <motion.div
      className="card req-card card-hover"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="req-head">
        <div>
          <span className="badge badge-brand">{categoryName(req.category)}</span>
          <h3 style={{ marginTop: 8 }}>{req.title}</h3>
        </div>
        <StatusBadge status={req.status} />
      </div>

      <p className="muted" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {req.description}
      </p>

      <div className="req-meta">
        <span><FiMapPin /> {req.location}</span>
        <span><FiClock /> {left > 0 ? `${left} days left` : 'Closing'}</span>
        <span><FiFileText /> {req.quotesCount} quotes</span>
        {req.images > 0 && <span><FiImage /> {req.images}</span>}
      </div>

      <div className="req-foot">
        <span className="req-price">{formatINR(req.budget)}</span>
        <Link to={to} className="btn btn-soft btn-sm">{cta}</Link>
      </div>
    </motion.div>
  )
}
