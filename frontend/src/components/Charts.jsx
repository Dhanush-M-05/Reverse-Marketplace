import { motion } from 'framer-motion'

// Simple SVG line/area chart (no chart libs)
export function LineChart({ data, height = 180, color = '#7c4dff' }) {
  const w = 100
  const h = 100
  const max = Math.max(...data.map((d) => d.v), 1)
  const step = w / (data.length - 1)
  const points = data.map((d, i) => [i * step, h - (d.v / max) * (h - 10) - 5])
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="line-chart" style={{ height }}>
        <defs>
          <linearGradient id="lc-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#lc-grad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />
      </svg>
      <div className="flex justify-between dim" style={{ fontSize: '0.7rem', marginTop: 6 }}>
        {data.map((d) => <span key={d.m}>{d.m}</span>)}
      </div>
    </div>
  )
}

export function BarChart({ data, color }) {
  const max = Math.max(...data, 1)
  return (
    <div className="bar-chart">
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="bar"
          style={{ background: color || 'var(--gradient-brand)' }}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: i * 0.04, type: 'spring', stiffness: 120, damping: 16 }}
        />
      ))}
    </div>
  )
}

export function DonutChart({ data, size = 160 }) {
  const radius = 42
  const circ = 2 * Math.PI * radius
  let offset = 0
  return (
    <div className="flex items-center gap-24 wrap">
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--surface-3)" strokeWidth="14" />
        {data.map((d, i) => {
          const len = (d.percent / 100) * circ
          const dash = `${len} ${circ - len}`
          const el = (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="14"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          )
          offset += len
          return el
        })}
        <text x="50" y="48" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--text)">100%</text>
        <text x="50" y="60" textAnchor="middle" fontSize="6" fill="var(--text-3)">total</text>
      </svg>
      <ul className="donut-legend">
        {data.map((d) => (
          <li key={d.name}>
            <span className="dot" style={{ background: d.color }} />
            {d.name} <strong style={{ marginLeft: 'auto' }}>{d.percent}%</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
