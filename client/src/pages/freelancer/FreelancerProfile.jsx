import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const FreelancerProfile = () => {
  const { user, logout } = useContext(AuthContext)

  const roleLabel = user?.role
    ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}`
    : 'Freelancer'

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-brand-border bg-brand-background p-6 text-brand-text sm:p-8">
      <h1 className="text-2xl font-semibold">Freelancer Profile</h1>
      <p className="mt-1 text-sm text-brand-text/70">Your account information</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-brand-border bg-brand-background p-4">
          <p className="text-xs uppercase tracking-wide text-brand-text/60">Name</p>
          <p className="mt-1 text-base font-medium">{user?.name || 'Not available'}</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-background p-4">
          <p className="text-xs uppercase tracking-wide text-brand-text/60">Email</p>
          <p className="mt-1 text-base font-medium">{user?.email || 'Not available'}</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-background p-4">
          <p className="text-xs uppercase tracking-wide text-brand-text/60">Role</p>
          <p className="mt-1 text-base font-medium">{roleLabel}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => logout()}
        className="mt-6 rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-slate-100"
      >
        Logout
      </button>
    </section>
  )
}

export default FreelancerProfile
