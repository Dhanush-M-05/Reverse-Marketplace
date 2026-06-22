import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  // Role guard is soft for the demo — admin can access everything.
  if (role && user.role !== role && user.role !== 'admin') {
    const home = user.role === 'seller' ? '/seller' : '/buyer'
    return <Navigate to={home} replace />
  }
  return children
}
