import { Outlet, Link } from 'react-router-dom'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import './auth-layout.css'

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-side">
        <div className="auth-side-top">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="auth-side-content">
          <span className="eyebrow">Reverse Marketplace</span>
          <h1>Buyers Post. <span className="gradient-text">Sellers Compete.</span> You Choose Best.</h1>
          <p className="muted">
            Join thousands of buyers and sellers building amazing things together.
            Post your requirement and let verified sellers send you their best offers.
          </p>
          <ul className="auth-points">
            <li>✓ 25K+ verified sellers</li>
            <li>✓ AI price recommendations</li>
            <li>✓ Real-time chat &amp; secure orders</li>
          </ul>
        </div>
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>
      <div className="auth-main">
        <div className="auth-main-top">
          <Link to="/" className="muted">← Back to home</Link>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
