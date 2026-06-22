import { FiStar } from 'react-icons/fi'

export default function StarRating({ value = 0, size = 15, count, showValue = false }) {
  const full = Math.round(value)
  return (
    <span className="stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          className={i <= full ? 'star-full' : 'star-empty'}
          fill={i <= full ? '#f5a623' : 'none'}
        />
      ))}
      {showValue && <span style={{ marginLeft: 6, color: 'var(--text-2)', fontWeight: 700 }}>{value}</span>}
      {count != null && (
        <span style={{ marginLeft: 4, color: 'var(--text-3)', fontSize: '0.8em' }}>({count})</span>
      )}
    </span>
  )
}
