import { useEffect, useState } from 'react'
import {
  approveSubmission,
  getClientSubmissions,
  requestRevision,
} from '../api/submissionApi'

const formatDate = (value) => {
  if (!value) return 'N/A'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleString()
}

const normalizeStatus = (value) => {
  const status = (value || 'submitted').toLowerCase()
  if (status === 'approved') return 'Approved'
  if (status === 'revision') return 'Revision Requested'
  return 'Submitted'
}

const ClientProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const [revisionDrafts, setRevisionDrafts] = useState({})

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getClientSubmissions()
      setProjects(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('[ClientProjects.loadProjects] error', err)
      setError(err?.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleApprove = async (submissionId) => {
    const confirmed = window.confirm('Are you sure? This cannot be undone.')
    if (!confirmed) return

    try {
      setBusyId(submissionId)
      setError('')
      await approveSubmission(submissionId)
      setProjects((previous) =>
        previous.map((project) =>
          project._id === submissionId
            ? {
                ...project,
                status: 'approved',
              }
            : project,
        ),
      )
    } catch (err) {
      console.error('[ClientProjects.handleApprove] error', err)
      setError(err?.message || 'Failed to approve project')
    } finally {
      setBusyId('')
    }
  }

  const handleRevision = async (submissionId) => {
    const revisionMessage = revisionDrafts[submissionId]?.trim()

    if (!revisionMessage) {
      setError('Revision message is required')
      return
    }

    try {
      setBusyId(submissionId)
      setError('')
      await requestRevision({ submissionId, revisionMessage })
      setRevisionDrafts((previous) => ({ ...previous, [submissionId]: '' }))
      await loadProjects()
    } catch (err) {
      console.error('[ClientProjects.handleRevision] error', err)
      setError(err?.message || 'Failed to request revision')
    } finally {
      setBusyId('')
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">Projects</h1>
        <p className="mt-1 text-sm text-brand-subtext">Review and approve freelancer submissions.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          Loading projects...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-5 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {!loading && !error && projects.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          No submissions yet
        </div>
      ) : null}

      {!loading && !error && projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project) => {
            const status = (project?.status || 'submitted').toLowerCase()
            const isApproved = status === 'approved'
            const isBusy = busyId === project._id

            return (
              <article
                key={project._id}
                className="rounded-2xl border border-brand-border bg-brand-background p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-brand-text">
                      {project?.job?.title || 'Untitled Job'}
                    </h2>
                    <p className="text-sm text-brand-subtext">
                      Budget: INR {Number(project?.job?.budget || 0).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-xl border border-brand-border bg-brand-messageReceived px-3 py-1 text-xs font-medium text-brand-text">
                    {normalizeStatus(project?.status)}
                  </span>
                </div>

                <div className="mt-3 text-sm text-brand-subtext">
                  <p>
                    Freelancer:{' '}
                    <span className="font-medium text-brand-text">
                      {project?.freelancer?.name || 'Unknown'}
                    </span>
                  </p>
                  <p>Email: {project?.freelancer?.email || 'N/A'}</p>
                  <p>Submitted: {formatDate(project?.createdAt)}</p>
                </div>

                <div className="mt-3 rounded-xl border border-brand-border bg-brand-messageReceived p-3 text-sm text-brand-text">
                  {project?.message?.trim() || 'No message provided'}
                </div>

                {project?.revisionMessage ? (
                  <div className="mt-3 rounded-xl border border-brand-border bg-brand-messageReceived p-3 text-sm text-brand-text">
                    Revision Message: {project.revisionMessage}
                  </div>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={project.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-medium text-brand-text"
                  >
                    Open File
                  </a>

                  <button
                    type="button"
                    disabled={isApproved || isBusy}
                    onClick={() => handleApprove(project._id)}
                    className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isBusy ? 'Processing...' : 'Accept Project'}
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  <textarea
                    rows={3}
                    disabled={isApproved || isBusy}
                    value={revisionDrafts[project._id] || ''}
                    onChange={(event) =>
                      setRevisionDrafts((previous) => ({
                        ...previous,
                        [project._id]: event.target.value,
                      }))
                    }
                    placeholder="Write revision request..."
                    className="w-full rounded-xl border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-text disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  <button
                    type="button"
                    disabled={isApproved || isBusy}
                    onClick={() => handleRevision(project._id)}
                    className="rounded-xl border border-brand-border bg-brand-messageReceived px-4 py-2 text-sm font-medium text-brand-text disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Request Changes
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

export default ClientProjects
