
import { useAuth } from '@/contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  if (!user) {
    // If user is trying to access root, redirect to landing
    if (location.pathname === '/') {
      return <Navigate to="/landing" replace />
    }
    // For all other protected routes, redirect to auth
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
