import { categories } from '../data/categories'

export default function FilterPanel({ filters, setFilters }) {
  const toggleCat = (id) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((c) => c !== id)
        : [...f.categories, id],
    }))
  }

  return (
    <div className="card card-pad filter-panel">
      <div className="filter-group">
        <h5>Category</h5>
        <div className="filter-options">
          {categories.map((c) => (
            <label key={c.id} className="filter-check">
              <input
                type="checkbox"
                checked={filters.categories.includes(c.id)}
                onChange={() => toggleCat(c.id)}
              />
              {c.icon} {c.name}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h5>Max Budget: ₹{Number(filters.maxBudget).toLocaleString('en-IN')}</h5>
        <input
          type="range"
          min="5000"
          max="1000000"
          step="5000"
          value={filters.maxBudget}
          onChange={(e) => setFilters((f) => ({ ...f, maxBudget: Number(e.target.value) }))}
          style={{ width: '100%', accentColor: 'var(--brand-500)' }}
        />
      </div>

      <div className="filter-group">
        <h5>Status</h5>
        <select
          className="select"
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button
        className="btn btn-ghost btn-sm"
        onClick={() => setFilters({ categories: [], maxBudget: 1000000, status: 'all' })}
      >
        Reset Filters
      </button>
    </div>
  )
}
