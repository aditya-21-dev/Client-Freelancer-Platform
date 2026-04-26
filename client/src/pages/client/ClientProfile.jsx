import { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { sendJson } from '../../utils/api'

const ClientProfile = () => {
  const { user, updateUser, logout } = useContext(AuthContext)

  const [formState, setFormState] = useState({ name: '', email: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setFormState({
      name: user?.name || '',
      email: user?.email || '',
    })
  }, [user?.name, user?.email])

  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'Client'

  const hasChanges = useMemo(() => {
    const trimmedName = formState.name.trim()
    const trimmedEmail = formState.email.trim().toLowerCase()

    return (
      trimmedName !== (user?.name || '') ||
      trimmedEmail !== (user?.email || '').toLowerCase()
    )
  }, [formState.name, formState.email, user?.name, user?.email])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (statusMessage) setStatusMessage('')
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!hasChanges || isSaving) return

    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim().toLowerCase(),
    }

    try {
      setIsSaving(true)
      setStatusMessage('')
      setErrorMessage('')

      const response = await sendJson('/api/users/profile', {
        method: 'PUT',
        body: payload,
      })

      const updatedUser = response?.user
      if (updatedUser) {
        updateUser(updatedUser)
      }

      setStatusMessage('Profile updated successfully.')
    } catch (error) {
      setErrorMessage(error?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-brand-background px-4 py-8 text-brand-text">
      <div className="w-full max-w-2xl rounded-2xl border border-brand-border bg-brand-background p-6 shadow-panel sm:p-8">
        <h1 className="text-2xl font-semibold text-brand-text">Client Profile</h1>
        <p className="mt-1 text-sm text-brand-subtext">Manage your account details</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="client-name" className="mb-1 block text-sm font-medium text-brand-text">
              Name
            </label>
            <input
              id="client-name"
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-2 text-brand-text outline-none"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="client-email" className="mb-1 block text-sm font-medium text-brand-text">
              Email
            </label>
            <input
              id="client-email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-2 text-brand-text outline-none"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="client-role" className="mb-1 block text-sm font-medium text-brand-text">
              Role
            </label>
            <input
              id="client-role"
              type="text"
              value={roleLabel}
              readOnly
              className="w-full rounded-2xl border border-brand-border bg-brand-messageReceived px-4 py-2 text-brand-text"
            />
          </div>

          {statusMessage ? (
            <p className="rounded-xl border border-brand-border bg-brand-messageSent px-3 py-2 text-sm text-brand-text">
              {statusMessage}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="rounded-xl border border-brand-border bg-brand-messageReceived px-3 py-2 text-sm text-brand-text">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!hasChanges || isSaving}
              className="rounded-2xl bg-brand-primary px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="rounded-2xl border border-brand-border bg-brand-background px-5 py-2 text-sm font-semibold text-brand-text"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ClientProfile
