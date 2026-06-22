import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="container section text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 800, lineHeight: 1 }}>404</div>
        <h1 style={{ margin: '12px 0' }}>Page not found</h1>
        <p className="muted mb-24">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
      </motion.div>
    </div>
  )
}
