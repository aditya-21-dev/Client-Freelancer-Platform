import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchClientProposals, updateProposalStatus } from '../../services/proposalService'

const ProjectProposals = () => {
  const { projectId } = useParams()

  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  useEffect(() => {
    let active = true

    const loadProposals = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await fetchClientProposals()
        if (!active) return

        const safe = Array.isArray(data) ? data : []
        setProposals(safe.filter((proposal) => proposal.job?._id === projectId))
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load proposals')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProposals()

    return () => {
      active = false
    }
  }, [projectId])

  const handleStatusUpdate = async (proposalId, status) => {
    try {
      setUpdatingId(proposalId)
      setError('')

      const updated = await updateProposalStatus({ proposalId, status })
      setProposals((previous) =>
        previous.map((proposal) => (proposal._id === proposalId ? updated : proposal)),
      )
    } catch (err) {
      setError(err?.message || 'Failed to update proposal status')
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">Project Proposals</h1>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          Loading proposals...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-5 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {!loading && !error && proposals.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          No proposals yet for this job.
        </div>
      ) : null}

      {!loading && !error && proposals.length > 0 ? (
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <article
              key={proposal._id}
              className="rounded-2xl border border-brand-border bg-brand-background p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-brand-text">
                    {proposal.freelancer?.name || 'Freelancer'}
                  </p>
                  <p className="text-sm text-brand-subtext">{proposal.freelancer?.email || 'No email'}</p>
                </div>

                <span className="rounded-xl border border-brand-border bg-brand-messageReceived px-3 py-1 text-xs font-medium capitalize text-brand-text">
                  {proposal.status}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm text-brand-text">{proposal.text}</p>

              {proposal.status === 'pending' ? (
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(proposal._id, 'accepted')}
                    disabled={updatingId === proposal._id}
                    className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(proposal._id, 'rejected')}
                    disabled={updatingId === proposal._id}
                    className="rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-medium text-brand-text disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default ProjectProposals
