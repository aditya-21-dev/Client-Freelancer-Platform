import { Link } from 'react-router-dom'

const myProjects = [
  {
    id: 'c-101',
    title: 'E-commerce Landing Page',
    status: 'Open',
  },
  {
    id: 'c-102',
    title: 'Dashboard API Integration',
    status: 'In Review',
  },
]

const proposals = [
  {
    id: 'cp-01',
    projectTitle: 'E-commerce Landing Page',
    count: 4,
  },
  {
    id: 'cp-02',
    projectTitle: 'Dashboard API Integration',
    count: 2,
  },
]

const ClientDashboard = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-xl border border-brand-border bg-brand-background p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-brand-text">Client Dashboard</h1>
            <p className="mt-1 text-sm text-brand-subtext">Manage projects and review incoming proposals.</p>
          </div>
          <Link
            to="/client/post-job"
            className="inline-flex items-center justify-center rounded-lg border border-brand-border bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-text"
          >
            Post Project
          </Link>
        </div>
      </div>

      <section className="rounded-xl border border-brand-border bg-brand-background p-5">
        <h2 className="text-lg font-semibold text-brand-text">My Projects</h2>
        <div className="mt-4 space-y-3">
          {myProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-brand-border bg-brand-messageReceived p-4"
            >
              <p className="text-base font-medium text-brand-text">{project.title}</p>
              <p className="mt-1 text-sm text-brand-subtext">{project.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-brand-border bg-brand-background p-5">
        <h2 className="text-lg font-semibold text-brand-text">View Proposals</h2>
        <div className="mt-4 space-y-3">
          {proposals.map((item) => (
            <div key={item.id} className="rounded-lg border border-brand-border bg-brand-messageSent p-4">
              <p className="text-base font-medium text-brand-text">{item.projectTitle}</p>
              <p className="mt-1 text-sm text-brand-subtext">{item.count} proposals</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ClientDashboard
