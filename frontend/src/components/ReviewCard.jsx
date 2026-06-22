import { motion } from 'framer-motion'
import { FiThumbsUp } from 'react-icons/fi'
import Avatar from './Avatar'
import StarRating from './StarRating'
import { formatDate } from '../utils/format'

export default function ReviewCard({ review, index = 0 }) {
  return (
    <motion.div
      className="card review-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="rv-head">
        <Avatar name={review.author} size="sm" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{review.author}</div>
          <div className="dim" style={{ fontSize: '0.78rem' }}>{formatDate(review.date)}</div>
        </div>
        <StarRating value={review.rating} size={13} />
      </div>
      {review.title && <strong style={{ fontSize: '0.95rem' }}>{review.title}</strong>}
      <p className="muted" style={{ fontSize: '0.9rem' }}>{review.body}</p>
      {review.helpful != null && (
        <button className="chip" style={{ alignSelf: 'flex-start' }}>
          <FiThumbsUp /> Helpful ({review.helpful})
        </button>
      )}
    </motion.div>
  )
}
