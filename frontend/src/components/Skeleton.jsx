import './components.css'

export function Skeleton({ width = '100%', height = 16, radius = 8, style }) {
  return (
    <span
      className="skeleton"
      style={{ display: 'block', width, height, borderRadius: radius, ...style }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card card-pad">
      <Skeleton height={20} width="60%" />
      <Skeleton height={12} width="100%" style={{ marginTop: 14 }} />
      <Skeleton height={12} width="80%" style={{ marginTop: 8 }} />
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <Skeleton height={36} width={90} radius={12} />
        <Skeleton height={36} width={90} radius={12} />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="grid cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
