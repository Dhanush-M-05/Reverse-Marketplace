import { motion } from 'framer-motion'
import {
  FiClipboard, FiFileText, FiBox, FiBell, FiUsers,
  FiDollarSign, FiStar, FiTrendingUp, FiTrendingDown,
} from 'react-icons/fi'

const iconMap = {
  clipboard: <FiClipboard />,
  quote: <FiFileText />,
  box: <FiBox />,
  bell: <FiBell />,
  users: <FiUsers />,
  wallet: <FiDollarSign />,
  star: <FiStar />,
}

export default function StatCard({ label, value, icon, trend, index = 0 }) {
  const down = trend && trend.startsWith('-')
  return (
    <motion.div
      className="card stat-card card-hover"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <div className="stat-top">
        <span className="stat-icon">{iconMap[icon] || <FiClipboard />}</span>
        {trend && (
          <span className={`stat-trend ${down ? 'down' : ''}`}>
            {down ? <FiTrendingDown /> : <FiTrendingUp />} {trend}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  )
}
