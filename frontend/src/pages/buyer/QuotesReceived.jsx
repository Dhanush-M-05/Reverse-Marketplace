import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import QuoteCard from '../../components/QuoteCard'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import '../dashboard.css'

export default function QuotesReceived() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { quotesForBuyer, requirementById, acceptQuote } = useData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('price')
  const [acceptedId, setAcceptedId] = useState(null)

  const buyerQuotes = quotesForBuyer(user?.id)
  const list = useMemo(() => {
    let res = buyerQuotes.filter((q) => q.seller.toLowerCase().includes(query.toLowerCase()))
    if (sort === 'price') res = [...res].sort((a, b) => a.price - b.price)
    if (sort === 'rating') res = [...res].sort((a, b) => b.rating - a.rating)
    if (sort === 'delivery') res = [...res].sort((a, b) => a.deliveryDays - b.deliveryDays)
    return res
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sort, buyerQuotes.length])

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Quotes Received</h1>
          <p className="muted">All quotes submitted by sellers across your requirements.</p>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by seller..." />
        <select className="select" style={{ maxWidth: 200 }} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="price">Price: Low to High</option>
          <option value="rating">Rating: High to Low</option>
          <option value="delivery">Fastest Delivery</option>
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState title="No quotes yet" subtitle="Quotes from sellers will appear here once they respond to your requirements." />
      ) : (
        <div className="grid cols-3">
          {list.map((q, i) => {
            const req = requirementById(q.requirementId)
            return (
              <div key={q.id}>
                <div className="dim mb-8" style={{ fontSize: '0.78rem' }}>For: {req?.title || q.requirementId}</div>
                <QuoteCard
                  quote={q}
                  index={i}
                  accepted={acceptedId === q.id}
                  onAccept={async () => { setAcceptedId(q.id); await acceptQuote(q.id); toast(`Quote from ${q.seller} accepted!`) }}
                  onMessage={() => navigate('/buyer/messages')}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
