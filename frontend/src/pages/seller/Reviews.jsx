import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import ReviewCard from '../../components/ReviewCard'
import StarRating from '../../components/StarRating'
import EmptyState from '../../components/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function Reviews() {
  const { user } = useAuth()
  const { reviewsForSeller } = useData()
  const reviews = reviewsForSeller(user?.name)

  const total = reviews.length
  const overall = total ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / total).toFixed(1) : '0.0'
  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    percent: total ? Math.round((reviews.filter((r) => Math.round(r.rating) === stars).length / total) * 100) : 0,
  }))

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Reviews &amp; Ratings</h1>
          <p className="muted">See what buyers say about your work.</p>
        </div>
      </div>

      <div className="dash-split-rev mb-24">
        <motion.div className="card panel text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.4rem', fontWeight: 800, lineHeight: 1 }}>{overall}</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <StarRating value={Number(overall)} size={20} />
          </div>
          <div className="muted">Based on {total} reviews</div>
        </motion.div>

        <div className="card panel">
          <h3 className="mb-16">Rating Breakdown</h3>
          {ratingBreakdown.map((r) => (
            <div className="flex items-center gap-12 mb-8" key={r.stars}>
              <span className="flex items-center gap-8" style={{ minWidth: 54 }}><FiStar style={{ color: '#f5a623' }} /> {r.stars}</span>
              <div className="progressbar" style={{ flex: 1 }}>
                <motion.span style={{ background: 'var(--gradient-brand)' }} initial={{ width: 0 }} animate={{ width: `${r.percent}%` }} transition={{ duration: 0.8 }} />
              </div>
              <span className="dim" style={{ minWidth: 38, textAlign: 'right' }}>{r.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="mb-16">Recent Reviews</h3>
      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" subtitle="Reviews from buyers will appear here once you complete orders." />
      ) : (
        <div className="grid cols-2">
          {reviews.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
        </div>
      )}
    </div>
  )
}
