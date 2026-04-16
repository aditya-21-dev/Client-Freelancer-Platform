import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const getDashboardByRole = (role) => {
  if (role === 'client') return '/client/dashboard'
  if (role === 'freelancer') return '/freelancer/dashboard'
  return '/login'
}

const ProtectedRoute = ({ role, children }) => {
  const { token, user, isInitializing } = useContext(AuthContext)

  if (isInitializing) {
    return null
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    return <Navigate to={getDashboardByRole(user?.role)} replace />
  }

  if (role && !user?.role) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
