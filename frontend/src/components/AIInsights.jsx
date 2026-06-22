import { motion } from 'framer-motion'
import {
  FiCpu, FiTrendingUp, FiUserCheck, FiShield, FiCheckCircle, FiAlertTriangle,
} from 'react-icons/fi'
import { formatINR } from '../utils/format'
import Avatar from './Avatar'
import StarRating from './StarRating'

export function AIPriceCard({ recommended = 24300, market = 24800, position = 35 }) {
  return (
    <motion.div className="card ai-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="ai-head">
        <span className="ai-icon"><FiTrendingUp /></span> AI Price Recommendation
        <span className="badge badge-brand" style={{ marginLeft: 'auto' }}>AI</span>
      </div>
      <div className="ai-price gradient-text">{formatINR(recommended)}</div>
      <div className="muted" style={{ fontSize: '0.85rem' }}>Recommended based on market analysis</div>
      <div className="gauge"><span className="pin" style={{ left: `${position}%` }} /></div>
      <div className="flex justify-between dim" style={{ fontSize: '0.72rem', marginTop: 4 }}>
        <span>Low</span><span>High</span>
      </div>
      <div className="divider" style={{ margin: '12px 0' }} />
      <div className="flex justify-between">
        <span className="muted" style={{ fontSize: '0.85rem' }}>Average Market Price</span>
        <strong>{formatINR(market)}</strong>
      </div>
    </motion.div>
  )
}

export function AISellerMatchCard({ seller }) {
  const s = seller || { name: 'Tech World', rating: 4.8, reviews: 120, match: 96 }
  return (
    <motion.div className="card ai-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="ai-head">
        <span className="ai-icon"><FiUserCheck /></span> AI Seller Matching
        <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Best Match</span>
      </div>
      <div className="flex items-center gap-12 mt-8">
        <Avatar name={s.name} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{s.name}</div>
          <StarRating value={s.rating} count={s.reviews} size={12} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="gradient-text" style={{ fontWeight: 800, fontSize: '1.3rem' }}>{s.match}%</div>
          <div className="dim" style={{ fontSize: '0.7rem' }}>match</div>
        </div>
      </div>
      <div className="progressbar mt-8"><span style={{ width: `${s.match}%` }} /></div>
      <div className="muted" style={{ fontSize: '0.82rem' }}>High reliability &amp; good reviews</div>
    </motion.div>
  )
}

export function AIScamCard({ score = 12 }) {
  const level = score < 33 ? 'low' : score < 66 ? 'med' : 'high'
  const meta = {
    low: { cls: 'risk-low', icon: <FiCheckCircle />, label: 'Low Risk', text: 'This requirement looks safe. All good to proceed.' },
    med: { cls: 'risk-med', icon: <FiAlertTriangle />, label: 'Medium Risk', text: 'Some signals detected. Verify details before proceeding.' },
    high: { cls: 'risk-high', icon: <FiAlertTriangle />, label: 'High Risk', text: 'Multiple red flags. Proceed with caution.' },
  }[level]
  return (
    <motion.div className="card ai-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="ai-head">
        <span className="ai-icon"><FiShield /></span> AI Scam Detection
        <span className="badge badge-brand" style={{ marginLeft: 'auto' }}>Risk {score}</span>
      </div>
      <div className={`risk-banner ${meta.cls}`}>
        {meta.icon}
        <div>
          <strong>{meta.label}</strong>
          <div style={{ fontSize: '0.82rem' }}>{meta.text}</div>
        </div>
      </div>
    </motion.div>
  )
}

export function AIPanelHeader() {
  return (
    <div className="flex items-center gap-8 mb-16">
      <span className="ai-icon"><FiCpu /></span>
      <div>
        <h3 style={{ fontSize: '1.15rem' }}>AI Assistant</h3>
        <span className="muted" style={{ fontSize: '0.85rem' }}>Smart insights to help you decide</span>
      </div>
    </div>
  )
}
