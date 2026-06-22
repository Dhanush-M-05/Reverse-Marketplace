import { Link } from 'react-router-dom'
import { FiRefreshCw } from 'react-icons/fi'
import './components.css'

export default function Logo({ to = '/', sub = true }) {
  return (
    <Link to={to} className="logo" aria-label="Reverse Marketplace home">
      <span className="logo-mark">
        <FiRefreshCw />
      </span>
      <span>
        Reverse<b>{sub ? '' : ''}</b>
        {sub && <span className="logo-sub"> Marketplace</span>}
      </span>
    </Link>
  )
}
