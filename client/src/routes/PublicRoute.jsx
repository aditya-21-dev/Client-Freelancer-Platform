import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const getDashboardByRole = (role) => {
  if (role === 'client') return '/client/dashboard'
  if (role === 'freelancer') return '/freelancer/dashboard'
  return '/'
}

const PublicRoute = ({ children }) => {
  const { user, token, isInitializing } = useContext(AuthContext)

  if (isInitializing) {
    return null
  }

  const storedUser = localStorage.getItem('user')
  let fallbackRole = null
  if (storedUser) {
    try {
      fallbackRole = JSON.parse(storedUser)?.role || null
    } catch {
      fallbackRole = null
    }
  }
  const resolvedRole = user?.role || fallbackRole

  if (token) {
    return <Navigate to={getDashboardByRole(resolvedRole)} replace />
  }

  return children
}

export default PublicRoute
