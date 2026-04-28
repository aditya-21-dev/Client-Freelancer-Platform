import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSubmissionsByJob } from '../api/submissionApi'

const formatDateTime = (value) => {
  if (!value) return 'Not available'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Not available'
  return parsed.toLocaleString()
}

const ClientJobSubmissions = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()

  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadSubmissions = async () => {
      if (!jobId) {
        setError('Job id is missing')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const data = await getSubmissionsByJob(jobId)
        if (!active) return

        setSubmissions(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!active) return
        console.error('[ClientJobSubmissions.loadSubmissions] error', err)
        setError(err?.message || 'Failed to load submissions')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadSubmissions()

    return () => {
      active = false
    }
  }, [jobId])

  return (
    <section className="mx-auto w-full max-w-5xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">Job Submissions</h1>
        <p className="mt-1 text-sm text-brand-subtext">Review freelancer deliveries for this job.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          Loading submissions...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-5 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {!loading && !error && submissions.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          No submissions available for this job.
        </div>
      ) : null}

      {!loading && !error && submissions.length > 0 ? (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <article
              key={submission._id}
              className="rounded-2xl border border-brand-border bg-brand-background p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-brand-subtext">Freelancer</p>
                  <p className="text-base font-semibold text-brand-text">
                    {submission?.freelancerId?.name || 'Unknown'}
                  </p>
                </div>

                <p className="text-xs text-brand-subtext">
                  Submitted: {formatDateTime(submission.createdAt)}
                </p>
              </div>

              {submission?.message ? (
                <p className="mt-3 rounded-xl border border-brand-border bg-brand-messageReceived px-3 py-2 text-sm text-brand-text">
                  {submission.message}
                </p>
              ) : null}

              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-medium text-brand-text"
              >
                View / Download File
              </a>
            </article>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => navigate('/client/my-jobs')}
        className="rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-medium text-brand-text"
      >
        Back to My Jobs
      </button>
    </section>
  )
}

export default ClientJobSubmissions
