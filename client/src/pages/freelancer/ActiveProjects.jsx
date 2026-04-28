import { useEffect, useMemo, useState } from 'react'
import { uploadSubmission } from '../../api/submissionApi'
import { fetchFreelancerJobs } from '../../services/jobService'

const statusClassMap = {
  pending: 'text-red-500',
  submitted: 'text-green-500',
  revision: 'text-yellow-500',
  approved: 'text-green-600 font-bold',
}

const ActiveProjects = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFiles, setSelectedFiles] = useState({})
  const [replyMap, setReplyMap] = useState({})
  const [busyJobId, setBusyJobId] = useState('')
  const [submissionFeedback, setSubmissionFeedback] = useState({})

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
        console.error('[ActiveProjects.loadJobs] error', err)
        setError(err?.message || 'Failed to load active jobs')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadJobs()
    return () => {
      active = false
    }
  }, [])

  const activeJobs = useMemo(() => jobs, [jobs])

  const setCardFeedback = (jobId, type, message) => {
    setSubmissionFeedback((prev) => ({
      ...prev,
      [jobId]: { type, message },
    }))

    setTimeout(() => {
      setSubmissionFeedback((prev) => {
        if (!prev[jobId] || prev[jobId].message !== message) {
          return prev
        }
        const next = { ...prev }
        delete next[jobId]
        return next
      })
    }, 3500)
  }

  const handleSubmit = async (jobId, { isRevision = false } = {}) => {
    const file = selectedFiles[jobId]
    const replyText = replyMap[jobId]?.trim() || ''

    if (!file) {
      setCardFeedback(jobId, 'error', 'Submission failed')
      return
    }

    try {
      setBusyJobId(jobId)
      setError('')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('jobId', jobId)
      formData.append('message', isRevision ? replyText : '')

      const token = localStorage.getItem('token')
      if (!token) {
        setError('User not authenticated')
        setCardFeedback(jobId, 'error', 'Submission failed')
        return
      }

      await uploadSubmission(formData, token)
      setCardFeedback(jobId, 'success', 'Project submitted successfully')

      const refreshedJobs = await fetchFreelancerJobs()
      setJobs(Array.isArray(refreshedJobs) ? refreshedJobs : [])
      setSelectedFiles((prev) => ({ ...prev, [jobId]: null }))
      setReplyMap((prev) => ({ ...prev, [jobId]: '' }))
    } catch (err) {
      console.error('[ActiveProjects.handleSubmit] error', err)
      setError(err?.message || 'Failed to submit project')
      setCardFeedback(jobId, 'error', 'Submission failed')
    } finally {
      setBusyJobId('')
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold">Active Projects</h1>
        <p className="text-sm text-brand-subtext">Submit your completed work to clients</p>
      </div>

      {loading && <div className="p-4">Loading projects...</div>}
      {!loading && error && <div className="p-4 text-red-500">{error}</div>}
      {!loading && !error && activeJobs.length === 0 && (
        <div className="p-4 text-brand-subtext">No active projects</div>
      )}

      {!loading && !error && activeJobs.length > 0 && (
        <div className="space-y-4">
          {activeJobs.map((job) => {
            const submissionStatus = (job?.submissionStatus || 'pending').toLowerCase()
            const statusClassName = statusClassMap[submissionStatus] || statusClassMap.pending
            const isBusy = busyJobId === job._id
            const feedback = submissionFeedback[job._id]

            return (
              <div
                key={job._id}
                className="rounded-xl border border-brand-border bg-brand-background p-4"
              >
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-brand-subtext">Budget: INR {job.budget}</p>
                <p className="text-sm">
                  Status: <span className={statusClassName}>{submissionStatus}</span>
                </p>

                <input
                  type="file"
                  onChange={(event) =>
                    setSelectedFiles((prev) => ({
                      ...prev,
                      [job._id]: event.target.files?.[0] || null,
                    }))
                  }
                  className="mt-3"
                />

                <button
                  disabled={isBusy}
                  onClick={() =>
                    handleSubmit(job._id, {
                      isRevision: submissionStatus === 'revision',
                    })
                  }
                  className="mt-2 rounded bg-brand-primary px-4 py-2 text-white"
                >
                  {isBusy ? 'Submitting...' : submissionStatus === 'revision' ? 'Resubmit' : 'Submit Project'}
                </button>

                {feedback ? (
                  <p
                    className={`mt-2 text-sm ${
                      feedback.type === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {feedback.message}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default ActiveProjects
