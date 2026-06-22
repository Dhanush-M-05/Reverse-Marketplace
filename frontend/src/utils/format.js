export const formatINR = (n) => {
  if (n === null || n === undefined || n === '') return '₹0'
  const num = typeof n === 'string' ? Number(n.replace(/[^0-9.]/g, '')) : n
  if (Number.isNaN(num)) return '₹0'
  return '₹' + num.toLocaleString('en-IN')
}

export const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const daysLeft = (iso) => {
  if (!iso) return null
  const d = new Date(iso)
  const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return diff
}

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

// Build a fixed 8-point monthly series ending in the current month, counting
// items by their date field. Always returns points so charts never break.
export const monthlySeries = (items = [], dateKey = 'postedAt') => {
  const months = []
  const now = new Date()
  for (let i = 7; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, m: d.toLocaleString('en-US', { month: 'short' }), v: 0 })
  }
  const index = Object.fromEntries(months.map((mo, i) => [mo.key, i]))
  items.forEach((it) => {
    const raw = it[dateKey]
    if (!raw) return
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (key in index) months[index[key]].v += 1
  })
  return months
}

export const timeAgo = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  const intervals = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}
