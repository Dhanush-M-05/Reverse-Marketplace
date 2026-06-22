import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import DashboardTopbar from '../components/DashboardTopbar'
import './dashboard-layout.css'

export default function DashboardLayout({ navItems, basePath }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="dash">
      <Sidebar items={navItems} open={open} onClose={() => setOpen(false)} />
      <div className="dash-main">
        <DashboardTopbar onMenu={() => setOpen(true)} basePath={basePath} />
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
