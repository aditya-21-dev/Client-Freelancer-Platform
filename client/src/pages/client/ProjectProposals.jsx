import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchClientProposals, updateProposalStatus } from '../../services/proposalService'

const ProjectProposals = () => {
  const { projectId } = useParams()

  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const [acceptingProposal, setAcceptingProposal] = useState(null)
  const [escrowAmount, setEscrowAmount] = useState('')

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
        console.error('[ProjectProposals.loadProposals] error', err)
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

  const acceptingDefaultBudget = useMemo(() => {
    return Number(acceptingProposal?.job?.budget || 0)
  }, [acceptingProposal])

  const openAcceptModal = (proposal) => {
    setAcceptingProposal(proposal)
    setEscrowAmount(String(Number(proposal?.job?.budget || 0)))
  }

  const closeAcceptModal = () => {
    setAcceptingProposal(null)
    setEscrowAmount('')
  }

  const handleStatusUpdate = async ({ proposalId, status, amount }) => {
    try {
      setUpdatingId(proposalId)
      setError('')

      const response = await updateProposalStatus({ proposalId, status, amount })
      const updated = response?.proposal || response

      setProposals((previous) =>
        previous.map((proposal) => (proposal._id === proposalId ? updated : proposal)),
      )

      if (status === 'accepted') {
        closeAcceptModal()
      }
    } catch (err) {
      console.error('[ProjectProposals.handleStatusUpdate] error', err)
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
                    onClick={() => openAcceptModal(proposal)}
                    disabled={updatingId === proposal._id}
                    className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Accept Proposal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate({ proposalId: proposal._id, status: 'rejected' })}
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

      {acceptingProposal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-background/80 px-4">
          <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-background p-5">
            <h2 className="text-lg font-semibold text-brand-text">Pay & Start Project</h2>
            <p className="mt-1 text-sm text-brand-subtext">Set escrow amount before project starts.</p>

            <label htmlFor="project-escrow-amount" className="mt-4 block text-sm font-medium text-brand-text">
              Amount
            </label>
            <input
              id="project-escrow-amount"
              type="number"
              min="0"
              value={escrowAmount}
              onChange={(event) => setEscrowAmount(event.target.value)}
              placeholder={String(acceptingDefaultBudget)}
              className="mt-2 w-full rounded-xl border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-text"
            />

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeAcceptModal}
                className="rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-medium text-brand-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleStatusUpdate({
                    proposalId: acceptingProposal._id,
                    status: 'accepted',
                    amount: Number(escrowAmount),
                  })
                }
                disabled={updatingId === acceptingProposal._id}
                className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Pay & Start Project
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default ProjectProposals
