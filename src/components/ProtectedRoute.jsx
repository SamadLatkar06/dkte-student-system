import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import LoadingSpinner from './LoadingSpinner'

function ProtectedRoute({ children }) {
  const { loading, session, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner label="Checking admin access..." />
  if (!session) return <Navigate to="/admin/login" state={{ from: location }} replace />
  if (!isAdmin) return <Navigate to="/admin/login" replace />

  return children
}

export default ProtectedRoute
