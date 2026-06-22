import { statusMeta } from '../data/orders'

export default function StatusBadge({ status }) {
  const meta = statusMeta[status] || { label: status, cls: 'badge-brand' }
  return <span className={`badge ${meta.cls}`}>{meta.label}</span>
}
