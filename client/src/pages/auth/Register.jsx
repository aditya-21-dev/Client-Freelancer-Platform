import { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { registerWithEmail } from '../../services/authService'

const roles = [
  {
    type: 'client',
    title: 'Client',
    desc: 'Post tasks and hire skilled freelancers.',
  },
  {
    type: 'freelancer',
    title: 'Freelancer',
    desc: 'Find work and complete projects.',
  },
]

const Register = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedRole) {
      setError('Please select a role first')
      return
    }

    const payload = {
      role: selectedRole,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    }

    if (!payload.name || !payload.email || !payload.password) {
      setError('Name, email, and password are required')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('[register] sending request', {
        name: payload.name,
        email: payload.email,
        role: payload.role,
      })

      const authResponse = await registerWithEmail(payload)
      login(authResponse)

      const role = authResponse?.user?.role || selectedRole

      if (role === 'freelancer') {
        navigate('/freelancer/dashboard')
      } else {
        navigate('/client/dashboard')
      }
    } catch (err) {
      console.error('[register] failed', err)
      setError(err.message || 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-background px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-brand-border bg-brand-background p-5 sm:p-6 md:p-8">

        <h2 className="text-center text-2xl font-bold text-brand-text sm:text-3xl">
          Create Your Account
        </h2>

        <p className="mt-2 text-center text-sm text-brand-subtext sm:text-base">
          Join FreelanceHub and start your journey
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {roles.map((role) => (
            <div
              key={role.type}
              onClick={() => setSelectedRole(role.type)}
              className={`cursor-pointer rounded-xl border p-4 transition sm:p-5 ${
                selectedRole === role.type
                  ? 'border-brand-border bg-brand-primary'
                  : 'border-brand-border bg-brand-background'
              }`}
            >
              <h3 className="text-lg font-semibold text-brand-text">
                {role.title}
              </h3>
              <p className="mt-2 text-sm text-brand-subtext">
                {role.desc}
              </p>
            </div>
          ))}
        </div>

        {selectedRole && (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 w-full max-w-md space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-brand-border bg-brand-background px-3 py-3 text-base text-brand-text"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-brand-border bg-brand-background px-3 py-3 text-base text-brand-text"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-brand-border bg-brand-background px-3 py-3 text-base text-brand-text"
              required
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : `Register as ${selectedRole}`}
            </button>

          </form>
        )}
      </div>
    </div>
  )
}

export default Register
