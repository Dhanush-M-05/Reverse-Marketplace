import { motion } from 'framer-motion'
import { FiCpu } from 'react-icons/fi'
import { AIPriceCard, AISellerMatchCard, AIScamCard } from '../../components/AIInsights'
import Avatar from '../../components/Avatar'
import StarRating from '../../components/StarRating'
import EmptyState from '../../components/EmptyState'
import { useAuth } from '../../context/AuthContext'
import '../dashboard.css'

export default function AIFeatures() {
  const { users } = useAuth()
  const sellers = users
    .filter((u) => u.role === 'seller' && u.status === 'active')
    .map((s, i) => ({ ...s, match: Math.max(70, 98 - i * 4) }))

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title"><FiCpu style={{ verticalAlign: '-3px', color: 'var(--brand-500)' }} /> AI Features</h1>
          <p className="muted">Smart insights to help you make confident decisions.</p>
        </div>
        <span className="badge badge-brand">Powered by AI</span>
      </div>

      <div className="dash-grid-3 mb-24">
        <AIPriceCard />
        <AISellerMatchCard />
        <AIScamCard score={12} />
      </div>

      <div className="card panel">
        <div className="panel-head">
          <h3>Recommended Sellers for You</h3>
          <span className="muted" style={{ fontSize: '0.85rem' }}>Ranked by AI match score</span>
        </div>
        {sellers.length === 0 ? (
          <EmptyState title="No sellers yet" subtitle="Approved sellers will be recommended here." />
        ) : (
          sellers.map((s, i) => (
            <motion.div
              key={s.id}
              className="list-row"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Avatar name={s.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{s.name} {s.verified && <span className="badge badge-info">Verified</span>}</div>
                <StarRating value={s.rating || 0} count={s.reviews || 0} size={12} />
              </div>
              <div style={{ minWidth: 160 }}>
                <div className="flex justify-between mb-8"><span className="dim" style={{ fontSize: '0.78rem' }}>Match</span><strong className="gradient-text">{s.match}%</strong></div>
                <div className="progressbar"><span style={{ width: `${s.match}%` }} /></div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
