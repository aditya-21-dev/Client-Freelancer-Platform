import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (!storedToken) {
        setIsInitializing(false)
        return
      }

      setToken(storedToken)

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          localStorage.removeItem('user')
          setUser(null)
        }
      }

      try {
        const meResponse = await getCurrentUser()
        const meUser = meResponse?.user ?? null

        if (meUser) {
          setUser(meUser)
          localStorage.setItem('user', JSON.stringify(meUser))
        }
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeAuth()
  }, [])

  const logout = useCallback(
    ({ redirectToLogin = true } = {}) => {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      setUser(null)
      setToken(null)

      if (redirectToLogin) {
        navigate('/login', { replace: true })
      }
    },
    [navigate],
  )

  const login = useCallback((authData) => {
    const payloadUser = authData?.user ?? null
    const payloadToken = authData?.token ?? null

    if (payloadToken) {
      localStorage.setItem('token', payloadToken)
      setToken(payloadToken)
    }

    if (payloadUser) {
      localStorage.setItem('user', JSON.stringify(payloadUser))
    }
    setUser(payloadUser)
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [logout])

  const value = useMemo(
    () => ({
      user,
      token,
      isInitializing,
      login,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [user, token, isInitializing, login, logout],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
