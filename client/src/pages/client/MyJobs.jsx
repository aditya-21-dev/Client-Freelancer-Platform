import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader'
import {
  acceptJobProject,
  fetchClientJobs,
  requestJobRevision,
} from '../../services/jobService'

const formatDate = (value) => {
  if (!value) return 'Not specified'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Not specified'
  return parsed.toLocaleDateString()
}

const MyJobs = () => {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyJobId, setBusyJobId] = useState('')
  const [revisionDrafts, setRevisionDrafts] = useState({})

  useEffect(() => {
    let active = true

    const loadJobs = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await fetchClientJobs()
        if (!active) return

        setJobs(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!active) return
        console.error('[MyJobs.loadJobs] error', err)
        setError(err?.message || 'Failed to fetch jobs')
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

  const updateJobInState = (updatedJob) => {
    setJobs((previous) =>
      previous.map((job) => (job._id === updatedJob._id ? updatedJob : job)),
    )
  }

  const handleAcceptProject = async (jobId) => {
    try {
      setBusyJobId(jobId)
      setError('')

      const updated = await acceptJobProject(jobId)
      console.log('[MyJobs.handleAcceptProject] completed', { jobId })
      updateJobInState(updated)
    } catch (err) {
      console.error('[MyJobs.handleAcceptProject] error', err)
      setError(err?.message || 'Failed to accept project')
    } finally {
      setBusyJobId('')
    }
  }

  const handleRequestRevision = async (jobId) => {
    const text = revisionDrafts[jobId]?.trim()
    if (!text) return

    try {
      setBusyJobId(jobId)
      setError('')

      const updated = await requestJobRevision({ jobId, text })
      console.log('[MyJobs.handleRequestRevision] revision requested', { jobId })
      updateJobInState(updated)
      setRevisionDrafts((previous) => ({ ...previous, [jobId]: '' }))
    } catch (err) {
      console.error('[MyJobs.handleRequestRevision] error', err)
      setError(err?.message || 'Failed to request revision')
    } finally {
      setBusyJobId('')
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">My Jobs</h1>
        <p className="mt-1 text-sm text-brand-subtext">Track proposals and review submitted work.</p>
      </div>

      {loading ? <Loader /> : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-5 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {!loading && !error && jobs.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          No jobs posted yet.
        </div>
      ) : null}

      {!loading && !error && jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.map((job) => {
            const submissionStatus = job?.submission?.status || 'pending'
            const hasSubmission = Boolean(job?.submission?.file || submissionStatus !== 'pending')
            const isCompleted = submissionStatus === 'completed'
            const isBusy = busyJobId === job._id

            return (
              <article
                key={job._id}
                className="rounded-2xl border border-brand-border bg-brand-background p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-brand-text">{job.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-brand-subtext">{job.description}</p>
                  </div>

                  <span className="rounded-xl border border-brand-border bg-brand-messageReceived px-3 py-1 text-xs font-medium text-brand-text">
                    {job.proposalsCount || 0} Proposals
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-brand-subtext">
                  <span>Budget: INR {Number(job.budget || 0).toLocaleString()}</span>
                  <span>Deadline: {formatDate(job.deadline)}</span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/client/proposals/${job._id}`)}
                    className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white"
                  >
                    View Proposals
                  </button>
                </div>

                {hasSubmission ? (
                  <div className="mt-4 rounded-xl border border-brand-border bg-brand-messageReceived p-3">
                    <p className="text-sm text-brand-subtext">Submitted File</p>
                    <p className="text-sm font-medium text-brand-text">
                      {job?.submission?.file || 'No file uploaded yet'}
                    </p>
                    <p className="mt-1 text-sm text-brand-subtext capitalize">Status: {submissionStatus}</p>

                    {job?.submissionMessages?.length ? (
                      <div className="mt-3 space-y-2">
                        {job.submissionMessages.map((message) => (
                          <div
                            key={message._id}
                            className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                                message.sender === 'client'
                                  ? 'bg-brand-messageSent'
                                  : 'bg-brand-background border border-brand-border'
                              }`}
                            >
                              <p className="text-sm text-brand-text">{message.text}</p>
                              <p className="mt-1 text-xs text-brand-subtext capitalize">
                                {message.sender} • {formatDate(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {!isCompleted ? (
                      <div className="mt-4 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleAcceptProject(job._id)}
                            className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Accept Project
                          </button>
                        </div>

                        <textarea
                          rows={3}
                          value={revisionDrafts[job._id] || ''}
                          onChange={(event) =>
                            setRevisionDrafts((previous) => ({
                              ...previous,
                              [job._id]: event.target.value,
                            }))
                          }
                          placeholder="Request changes from freelancer..."
                          className="w-full rounded-xl border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-text"
                        />
                        <button
                          type="button"
                          disabled={!revisionDrafts[job._id]?.trim() || isBusy}
                          onClick={() => handleRequestRevision(job._id)}
                          className="rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-medium text-brand-text disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Request Change
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

export default MyJobs
