import { FiTrash2 } from 'react-icons/fi'
import StarRating from '../../components/StarRating'
import Avatar from '../../components/Avatar'
import EmptyState from '../../components/EmptyState'
import { formatDate } from '../../utils/format'
import { useToast } from '../../context/ToastContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function ReviewManagement() {
  const { toast } = useToast()
  const { reviews: items, deleteReview } = useData()

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Review Management</h1>
          <p className="muted">Moderate reviews and remove abusive content.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No reviews" />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {items.map((r) => (
            <div className="list-row" key={r.id} style={{ padding: '16px 20px' }}>
              <Avatar name={r.author} size="sm" />
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-12">
                  <strong>{r.author}</strong>
                  <span className="dim" style={{ fontSize: '0.78rem' }}>→ {r.target}</span>
                  <StarRating value={r.rating} size={12} />
                  <span className="dim" style={{ fontSize: '0.78rem', marginLeft: 'auto' }}>{formatDate(r.date)}</span>
                </div>
                <p className="muted mt-8" style={{ fontSize: '0.9rem' }}>{r.body}</p>
              </div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => { deleteReview(r.id); toast('Review removed', 'info') }} aria-label="Delete"><FiTrash2 /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
