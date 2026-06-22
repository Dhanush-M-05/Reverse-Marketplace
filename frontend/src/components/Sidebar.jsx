import { NavLink, useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import './sidebar.css'

export default function Sidebar({ items, open, onClose }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Logo />
        </div>

        <div className="sidebar-role chip" style={{ margin: '0 16px 8px', textTransform: 'capitalize' }}>
          {user?.role} Panel
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-link logout" onClick={handleLogout}>
          <span className="sidebar-icon"><FiLogOut /></span>
          Logout
        </button>
      </aside>
    </>
  )
}
