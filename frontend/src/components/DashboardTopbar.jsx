import { useNavigate } from 'react-router-dom'
import { FiMenu, FiSearch } from 'react-icons/fi'
import Avatar from './Avatar'
import ThemeToggle from './ThemeToggle'
import NotificationBell from './NotificationBell'
import { useAuth } from '../context/AuthContext'
import './topbar.css'

export default function DashboardTopbar({ onMenu, basePath }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="topbar glass">
      <button className="icon-btn topbar-burger" onClick={onMenu} aria-label="Open menu">
        <FiMenu />
      </button>

      <div className="searchbar topbar-search">
        <FiSearch />
        <input placeholder="Search anything..." />
      </div>

      <div className="topbar-actions">
        <ThemeToggle />
        <NotificationBell basePath={basePath} />
        <button className="topbar-user" onClick={() => navigate(`${basePath}/profile`)}>
          <Avatar name={user?.name} size="sm" />
          <div className="topbar-user-meta">
            <strong>{user?.name}</strong>
            <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
        </button>
      </div>
    </header>
  )
}
