import { useEffect, useState } from 'react'
import Loader from '../../components/Loader'
import { fetchClientProposals, updateProposalStatus } from '../../services/proposalService'

const AllProposals = () => {
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

        setProposals(Array.isArray(data) ? data : [])
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
  }, [])

  const handleStatusUpdate = async (proposalId, status) => {
    try {
      setUpdatingId(proposalId)
      setError('')

      const updated = await updateProposalStatus({ proposalId, status })

      setProposals((previous) =>
        previous.map((proposal) =>
          proposal._id === proposalId ? updated : proposal,
        ),
      )
    } catch (err) {
      setError(err?.message || 'Failed to update proposal status')
    } finally {
      setUpdatingId('')
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">Proposals</h1>
        <p className="mt-1 text-sm text-brand-subtext">Review freelancer proposals for your jobs.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived px-4 py-3 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {proposals.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          No proposals yet.
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => {
            const isPending = proposal.status === 'pending'
            const isUpdating = updatingId === proposal._id

            return (
              <article
                key={proposal._id}
                className="rounded-2xl border border-brand-border bg-brand-background p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-brand-text">
                      {proposal.job?.title || 'Untitled Job'}
                    </h2>
                    <p className="text-sm text-brand-subtext">
                      Freelancer: {proposal.freelancer?.name || 'Unknown'}
                    </p>
                  </div>

                  <span className="rounded-xl border border-brand-border bg-brand-messageReceived px-3 py-1 text-xs font-medium text-brand-text capitalize">
                    {proposal.status}
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-brand-text">{proposal.text}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-brand-subtext">
                  <span>Budget: INR {Number(proposal.job?.budget || 0).toLocaleString()}</span>
                </div>

                {isPending ? (
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(proposal._id, 'accepted')}
                      className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(proposal._id, 'rejected')}
                      className="rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-medium text-brand-text disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default AllProposals
