import { FiMapPin, FiCheckCircle } from 'react-icons/fi'
import Avatar from './Avatar'
import StarRating from './StarRating'

export default function ProfileCard({ user, stats }) {
  return (
    <div className="card profile-card">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar name={user.name} size="xl" />
      </div>
      <h3 style={{ marginTop: 14 }}>
        {user.name}{' '}
        {user.verified && <FiCheckCircle style={{ color: 'var(--info)', verticalAlign: '-2px' }} />}
      </h3>
      <div className="muted" style={{ textTransform: 'capitalize' }}>{user.role}</div>
      <div className="dim flex items-center gap-8" style={{ justifyContent: 'center', fontSize: '0.85rem', marginTop: 4 }}>
        <FiMapPin /> {user.location || 'India'}
      </div>
      {user.rating && (
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
          <StarRating value={user.rating} count={user.reviews} size={14} />
        </div>
      )}
      {stats && (
        <div className="profile-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="ps-val">{s.value}</div>
              <div className="ps-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
