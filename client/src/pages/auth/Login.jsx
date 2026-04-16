import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { loginWithEmail, loginWithGoogle } from '../../services/authService'

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'
const GOOGLE_SCRIPT_ID = 'google-identity-script'

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve()
  }

  if (window.__googleScriptPromise) {
    return window.__googleScriptPromise
  }

  window.__googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID)

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Failed to load Google Identity script')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = GOOGLE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Identity script'))
    document.head.appendChild(script)
  })

  return window.__googleScriptPromise
}

const Login = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const googleButtonRef = useRef(null)
  const isMountedRef = useRef(true)

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [googleReady, setGoogleReady] = useState(false)

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const redirectByRole = useCallback(
    (role) => {
      navigate(role === 'client' ? '/client/dashboard' : '/freelancer/dashboard')
    },
    [navigate],
  )

  const handleAuthSuccess = useCallback(
    (authResponse) => {
      login(authResponse)
      redirectByRole(authResponse?.user?.role)
    },
    [login, redirectByRole],
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await loginWithEmail(formData)
      handleAuthSuccess(response)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleCredential = useCallback(
    async (response) => {
      if (!response?.credential) {
        if (isMountedRef.current) {
          setError('Google Sign-In failed')
        }
        return
      }

      try {
        const authResponse = await loginWithGoogle(response.credential)
        handleAuthSuccess(authResponse)
      } catch (err) {
        if (isMountedRef.current) {
          setError(err.message || 'Google Sign-In failed')
        }
      }
    },
    [handleAuthSuccess],
  )

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const initializeGoogle = async () => {
      if (!googleClientId) {
        if (!cancelled) {
          setError('Google Client ID is not configured')
        }
        return
      }

      try {
        await loadGoogleScript()
        if (cancelled) return

        window.__googleCredentialHandler = handleGoogleCredential

        if (!window.__googleIdentityInitialized) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response) => window.__googleCredentialHandler?.(response),
            ux_mode: 'popup',
          })
          window.__googleIdentityInitialized = true
        }

        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = ''
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            shape: 'pill',
            width: 320,
            text: 'continue_with',
          })
        }

        setGoogleReady(true)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load Google Sign-In')
        }
      }
    }

    initializeGoogle()

    return () => {
      cancelled = true
    }
  }, [googleClientId, handleGoogleCredential])

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-background bg-gradient-to-br from-brand-background via-white to-brand-background px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-background p-6 shadow-lg">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-brand-text">Welcome Back</h1>
          <p className="text-sm text-brand-text/70">Sign in to continue to FreelanceHub</p>
        </div>

        <form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-brand-text">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-brand-border bg-brand-background px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-brand-text">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-brand-border bg-brand-background px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-primary py-3 text-lg font-semibold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 border-t border-brand-border" />
          <span className="text-xs font-medium uppercase tracking-wide text-brand-text/60">Or</span>
          <div className="h-px flex-1 border-t border-brand-border" />
        </div>

        <div className="flex min-h-11 items-center justify-center">
          <div ref={googleButtonRef} className="flex justify-center" />
        </div>

        {!googleReady && (
          <p className="mt-3 text-center text-xs text-brand-text/60">Loading Google Sign-In...</p>
        )}
      </div>
    </div>
  )
}

export default Login
