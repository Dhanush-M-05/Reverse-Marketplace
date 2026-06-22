import { FiInbox } from 'react-icons/fi'

export default function EmptyState({ icon, title = 'Nothing here yet', subtitle, action }) {
  return (
    <div className="empty">
      {icon || <FiInbox />}
      <h3 style={{ color: 'var(--text-2)', marginBottom: 6 }}>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  )
}
