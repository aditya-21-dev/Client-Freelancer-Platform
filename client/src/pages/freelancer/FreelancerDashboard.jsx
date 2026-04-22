import { Link } from 'react-router-dom'

const browseProjects = [
  {
    id: 'f-301',
    title: 'SaaS Marketing Website',
    budget: '$700 - $1000',
  },
  {
    id: 'f-302',
    title: 'React + Node Booking App',
    budget: '$1200 - $1600',
  },
]

const myProposals = [
  {
    id: 'mp-1',
    projectTitle: 'SaaS Marketing Website',
    status: 'Pending',
  },
  {
    id: 'mp-2',
    projectTitle: 'React + Node Booking App',
    status: 'Shortlisted',
  },
]

const FreelancerDashboard = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">Freelancer Dashboard</h1>
        <p className="mt-1 text-sm text-brand-subtext">Browse projects, track proposals, and monitor earnings.</p>
      </div>

      <section className="rounded-xl border border-brand-border bg-brand-background p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-brand-text">Browse Projects</h2>
          <Link
            to="/freelancer/browse-jobs"
            className="inline-flex items-center justify-center rounded-lg border border-brand-border bg-brand-primary px-5 py-3 text-sm font-semibold text-white"
          >
            Browse Projects
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {browseProjects.map((project) => (
            <div key={project.id} className="rounded-lg border border-brand-border bg-brand-messageReceived p-4">
              <p className="text-base font-medium text-brand-text">{project.title}</p>
              <p className="mt-1 text-sm text-brand-subtext">{project.budget}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-brand-border bg-brand-background p-5">
        <h2 className="text-lg font-semibold text-brand-text">My Proposals</h2>
        <div className="mt-4 space-y-3">
          {myProposals.map((proposal) => (
            <div key={proposal.id} className="rounded-lg border border-brand-border bg-brand-messageSent p-4">
              <p className="text-base font-medium text-brand-text">{proposal.projectTitle}</p>
              <p className="mt-1 text-sm text-brand-subtext">{proposal.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-brand-border bg-brand-background p-5">
        <h2 className="text-lg font-semibold text-brand-text">Earnings</h2>
        <div className="mt-4 rounded-lg border border-brand-border bg-brand-messageReceived p-4">
          <p className="text-sm text-brand-subtext">Total Earnings</p>
          <p className="mt-1 text-2xl font-semibold text-brand-text">$0.00</p>
          <p className="mt-1 text-sm text-brand-subtext">Placeholder until payouts are connected.</p>
        </div>
      </section>
    </div>
  )
}

export default FreelancerDashboard
