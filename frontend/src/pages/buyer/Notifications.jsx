import { motion } from 'framer-motion'
import {
  FiFileText, FiCheckCircle, FiMessageSquare, FiBox, FiInfo, FiCheck,
} from 'react-icons/fi'
import EmptyState from '../../components/EmptyState'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

const typeIcon = {
  quote: <FiFileText />,
  accepted: <FiCheckCircle />,
  message: <FiMessageSquare />,
  order: <FiBox />,
  system: <FiInfo />,
}

export default function Notifications() {
  const { notifications: items, markNotificationsRead } = useData()
  const markAll = () => markNotificationsRead()

  const grouped = items.reduce((acc, n) => {
    ;(acc[n.date] = acc[n.date] || []).push(n)
    return acc
  }, {})

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="muted">Stay up to date with your activity.</p>
        </div>
        <button className="btn btn-soft" onClick={markAll}><FiCheck /> Mark all as read</button>
      </div>

      {items.length === 0 ? (
        <EmptyState title="You're all caught up" />
      ) : (
        Object.entries(grouped).map(([date, group]) => (
          <div key={date} className="mb-24">
            <h4 className="dim mb-8" style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{date}</h4>
            <div className="card" style={{ overflow: 'hidden' }}>
              {group.map((n, i) => (
                <motion.div
                  key={n.id}
                  className={`bell-item ${n.read ? '' : 'unread'}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <span className="bi-icon">{typeIcon[n.type] || <FiInfo />}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                    <div className="muted" style={{ fontSize: '0.88rem' }}>{n.body}</div>
                  </div>
                  <span className="dim" style={{ fontSize: '0.75rem' }}>{n.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
