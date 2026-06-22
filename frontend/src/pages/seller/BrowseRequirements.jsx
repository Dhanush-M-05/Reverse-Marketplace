import { useMemo, useState } from 'react'
import SearchBar from '../../components/SearchBar'
import FilterPanel from '../../components/FilterPanel'
import RequirementCard from '../../components/RequirementCard'
import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import { useData } from '../../context/DataContext'
import './browse.css'

const PER_PAGE = 6

export default function BrowseRequirements() {
  const { requirements } = useData()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ categories: [], maxBudget: 1000000, status: 'all' })
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return requirements.filter((r) => {
      const q = r.title.toLowerCase().includes(query.toLowerCase()) || (r.description || '').toLowerCase().includes(query.toLowerCase())
      const c = filters.categories.length === 0 || filters.categories.includes(r.category)
      const b = r.budget <= filters.maxBudget
      const s = filters.status === 'all' || r.status === filters.status
      return q && c && b && s
    })
  }, [query, filters, requirements])

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Browse Requirements</h1>
          <p className="muted">Find requirements that match your skills and submit a winning quote.</p>
        </div>
        <button className="btn btn-ghost browse-filter-btn" onClick={() => setShowFilters((s) => !s)}>
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      <div className="browse-layout">
        <aside className={`browse-sidebar ${showFilters ? 'open' : ''}`}>
          <FilterPanel filters={filters} setFilters={(f) => { setFilters(f); setPage(1) }} />
        </aside>

        <div>
          <div className="toolbar">
            <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1) }} placeholder="Search requirements..." />
            <span className="chip">{filtered.length} results</span>
          </div>

          {paged.length === 0 ? (
            <EmptyState title="No open requirements yet" subtitle="When buyers post requirements, they'll appear here for you to quote on." />
          ) : (
            <div className="grid cols-2">
              {paged.map((r, i) => (
                <RequirementCard key={r.id} req={r} to={`/seller/requirements/${r.id}`} index={i} cta="View &amp; Quote" />
              ))}
            </div>
          )}
          
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
