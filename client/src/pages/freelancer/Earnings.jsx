import { useEffect, useMemo, useState } from 'react'
import { fetchFreelancerJobs } from '../../services/jobService'

const Earnings = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadJobs = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await fetchFreelancerJobs()
        if (!active) return

        setJobs(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!active) return
        console.error('[Earnings.loadJobs] error', err)
        setError(err?.message || 'Failed to load earnings')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadJobs()

    return () => {
      active = false
    }
  }, [])

  const completedJobs = useMemo(
    () => jobs.filter((job) => job?.submission?.status === 'completed'),
    [jobs],
  )

  const totalEarnings = useMemo(
    () => completedJobs.reduce((sum, job) => sum + Number(job.budget || 0), 0),
    [completedJobs],
  )

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">Earnings</h1>
        <p className="mt-1 text-sm text-brand-subtext">Frontend simulation from completed submitted jobs.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          Loading earnings...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-5 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageSent p-5">
          <p className="text-sm text-brand-subtext">Total Earnings</p>
          <h2 className="mt-1 text-3xl font-semibold text-brand-text">INR {totalEarnings.toLocaleString()}</h2>
        </div>
      ) : null}

      {!loading && !error && completedJobs.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          No completed jobs yet.
        </div>
      ) : null}

      {!loading && !error && completedJobs.length > 0 ? (
        <div className="space-y-3">
          {completedJobs.map((job) => (
            <article
              key={job._id}
              className="rounded-2xl border border-brand-border bg-brand-background p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-brand-text">{job.title}</h2>
                  <p className="text-sm text-brand-subtext">Client: {job.client?.name || 'Unknown'}</p>
                </div>

                <p className="text-sm font-medium text-brand-text">
                  INR {Number(job.budget || 0).toLocaleString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default Earnings
