import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiBell, FiFileText, FiCheckCircle, FiMessageSquare, FiBox, FiInfo,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'

const typeIcon = {
  quote: <FiFileText />,
  accepted: <FiCheckCircle />,
  message: <FiMessageSquare />,
  order: <FiBox />,
  system: <FiInfo />,
}

export default function NotificationBell({ basePath = '/buyer' }) {
  const { notifications, markNotificationsRead } = useData()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const items = notifications
  const unread = items.filter((n) => !n.read).length

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const markAll = () => markNotificationsRead()

  return (
    <div className="bell-wrap" ref={ref}>
      <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        <FiBell />
        {unread > 0 && <span className="bell-dot" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="bell-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="bp-head">
              <strong>Notifications</strong>
              <button className="btn btn-sm btn-soft" onClick={markAll}>Mark all read</button>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {items.length === 0 && (
                <div className="muted" style={{ padding: '20px 16px', fontSize: '0.85rem', textAlign: 'center' }}>
                  No notifications yet.
                </div>
              )}
              {items.map((n) => (
                <div key={n.id} className={`bell-item ${n.read ? '' : 'unread'}`}>
                  <span className="bi-icon">{typeIcon[n.type] || <FiInfo />}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{n.title}</div>
                    <div className="muted" style={{ fontSize: '0.8rem' }}>{n.body}</div>
                    <div className="dim" style={{ fontSize: '0.72rem', marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to={`${basePath}/notifications`} className="btn btn-soft btn-block" style={{ borderRadius: 0 }} onClick={() => setOpen(false)}>
              View All Notifications
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
