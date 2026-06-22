import {
  FiGrid, FiFileText, FiPlusCircle, FiLayers, FiInbox, FiBarChart2,
  FiShoppingBag, FiMessageSquare, FiBell, FiUser, FiSettings, FiCpu,
  FiSearch, FiStar, FiUsers, FiClipboard, FiAlertTriangle, FiDollarSign,
} from 'react-icons/fi'

export const buyerNav = [
  { to: '/buyer', label: 'Dashboard', icon: <FiGrid />, end: true },
  { to: '/buyer/post', label: 'Post Requirement', icon: <FiPlusCircle /> },
  { to: '/buyer/requirements', label: 'My Requirements', icon: <FiFileText /> },
  { to: '/buyer/quotes', label: 'Quotes Received', icon: <FiInbox /> },
  { to: '/buyer/orders', label: 'Orders', icon: <FiShoppingBag /> },
  { to: '/buyer/ai', label: 'AI Features', icon: <FiCpu /> },
  { to: '/buyer/messages', label: 'Messages', icon: <FiMessageSquare /> },
  { to: '/buyer/notifications', label: 'Notifications', icon: <FiBell /> },
  { to: '/buyer/profile', label: 'Profile', icon: <FiUser /> },
  { to: '/buyer/settings', label: 'Settings', icon: <FiSettings /> },
]

export const sellerNav = [
  { to: '/seller', label: 'Dashboard', icon: <FiGrid />, end: true },
  { to: '/seller/browse', label: 'Browse Requirements', icon: <FiSearch /> },
  { to: '/seller/quotes', label: 'Submitted Quotes', icon: <FiLayers /> },
  { to: '/seller/orders', label: 'Orders', icon: <FiShoppingBag /> },
  { to: '/seller/messages', label: 'Messages', icon: <FiMessageSquare /> },
  { to: '/seller/reviews', label: 'Reviews', icon: <FiStar /> },
  { to: '/seller/profile', label: 'Profile', icon: <FiUser /> },
]

export const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid />, end: true },
  { to: '/admin/users', label: 'User Management', icon: <FiUsers /> },
  { to: '/admin/requirements', label: 'Requirements', icon: <FiClipboard /> },
  { to: '/admin/quotes', label: 'Quotes', icon: <FiFileText /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
  { to: '/admin/reviews', label: 'Reviews', icon: <FiStar /> },
  { to: '/admin/disputes', label: 'Disputes', icon: <FiAlertTriangle /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
]

export { FiDollarSign }
