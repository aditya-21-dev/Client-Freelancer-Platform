import { useEffect, useMemo, useState } from 'react'
import { fetchJobs } from '../../services/jobService'

const formatDeadline = (dateValue) => {
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return 'Invalid deadline'
  return parsed.toLocaleDateString()
}

const shortText = (value, max = 120) => {
  if (!value) return ''
  return value.length > max ? `${value.slice(0, max)}...` : value
}

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await fetchJobs()
        setJobs(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return jobs

    return jobs.filter((job) => {
      const haystack = `${job.title || ''} ${job.description || ''}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [jobs, search])

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">Browse Jobs</h1>
        <p className="mt-1 text-sm text-brand-subtext">Latest jobs posted by clients.</p>
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-background p-4">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title or description"
          className="w-full rounded-lg border border-brand-border bg-brand-background p-3 text-sm text-brand-text"
        />
      </div>

      {loading ? (
        <div className="rounded-xl border border-brand-border bg-brand-messageReceived p-4">
          <p className="text-sm text-brand-subtext">Loading jobs...</p>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-xl border border-brand-border bg-brand-messageReceived p-4">
          <p className="text-sm text-brand-text">{error}</p>
        </div>
      ) : null}

      {!loading && !error && filteredJobs.length === 0 ? (
        <div className="rounded-xl border border-brand-border bg-brand-messageReceived p-4">
          <p className="text-sm text-brand-subtext">No jobs found.</p>
        </div>
      ) : null}

      {!loading && !error && filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <article key={job._id} className="rounded-xl border border-brand-border bg-brand-background p-4">
              <h2 className="text-lg font-semibold text-brand-text">{job.title}</h2>
              <p className="mt-2 text-sm text-brand-subtext">{shortText(job.description)}</p>
              <div className="mt-4 space-y-1 rounded-lg border border-brand-border bg-brand-messageSent p-3">
                <p className="text-sm text-brand-text">Budget: {job.budget}</p>
                <p className="text-sm text-brand-subtext">Deadline: {formatDeadline(job.deadline)}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default BrowseJobs
