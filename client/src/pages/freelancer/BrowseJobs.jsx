import { useEffect, useMemo, useState } from 'react'
import JobCard from '../../components/JobCard'
import Card from '../../components/ui/Card'
import { fetchJobs } from '../../services/jobService'

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
    <section className="mx-auto w-full max-w-7xl space-y-8 p-2 sm:p-4">
      <Card className="p-6">
        <p className="text-sm font-medium text-brand-subtext">Freelancer Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-brand-text">Browse Jobs</h1>
        <p className="mt-2 text-sm text-brand-subtext">Find projects that match your skills and submit proposals quickly.</p>
      </Card>

      <Card className="p-4">
        <label htmlFor="job-search" className="mb-2 block text-sm font-medium text-brand-text">
          Search Jobs
        </label>
        <input
          id="job-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title or description"
          className="w-full rounded-2xl border border-brand-border bg-brand-background p-3 text-sm text-brand-text shadow-md transition focus:outline-none focus:shadow-lg"
        />
      </Card>

      {loading ? (
        <Card className="bg-brand-messageReceived p-5">
          <p className="text-sm text-brand-subtext">Loading jobs...</p>
        </Card>
      ) : null}

      {!loading && error ? (
        <Card className="bg-brand-messageReceived p-5">
          <p className="text-sm text-brand-text">{error}</p>
        </Card>
      ) : null}

      {!loading && !error && filteredJobs.length === 0 ? (
        <Card className="bg-brand-messageReceived p-5">
          <p className="text-sm text-brand-subtext">No jobs found for your search.</p>
        </Card>
      ) : null}

      {!loading && !error && filteredJobs.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-brand-text">Open Opportunities</h2>
            <p className="text-sm text-brand-subtext">{filteredJobs.length} jobs</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <JobCard key={job._id || job.id} job={job} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default BrowseJobs
