import { useEffect, useMemo, useState } from 'react'
import Loader from '../../components/Loader'
import { fetchClientProposals, updateProposalStatus } from '../../services/proposalService'

const AllProposals = () => {
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

        setProposals(Array.isArray(data) ? data : [])
    } catch (err) {
      if (!active) return
      console.error('[AllProposals.loadProposals] error', err)
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

  const handleReject = async (proposalId) => {
    try {
      setUpdatingId(proposalId)
      setError('')

      const response = await updateProposalStatus({ proposalId, status: 'rejected' })
      const updatedProposal = response?.proposal || response

      setProposals((previous) =>
        previous.map((proposal) =>
          proposal._id === proposalId ? updatedProposal : proposal,
        ),
      )
    } catch (err) {
      console.error('[AllProposals.handleReject] error', err)
      setError(err?.message || 'Failed to update proposal status')
    } finally {
      setUpdatingId('')
    }
  }

  const handlePayAndStart = async () => {
    if (!acceptingProposal) return

    const proposalId = acceptingProposal._id
    const amountValue = Number(escrowAmount)

    if (Number.isNaN(amountValue) || amountValue < 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setUpdatingId(proposalId)
      setError('')

      const response = await updateProposalStatus({
        proposalId,
        status: 'accepted',
        amount: amountValue,
      })

      const updatedProposal = response?.proposal || response

      setProposals((previous) =>
        previous.map((proposal) =>
          proposal._id === proposalId ? updatedProposal : proposal,
        ),
      )

      closeAcceptModal()
    } catch (err) {
      console.error('[AllProposals.handlePayAndStart] error', err)
      setError(err?.message || 'Failed to accept proposal')
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
        <p className="mt-1 text-sm text-brand-subtext">Review freelancer proposals and start escrowed projects.</p>
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
                      onClick={() => openAcceptModal(proposal)}
                      className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Accept Proposal
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleReject(proposal._id)}
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

      {acceptingProposal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-background/80 px-4">
          <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-background p-5">
            <h2 className="text-lg font-semibold text-brand-text">Pay & Start Project</h2>
            <p className="mt-1 text-sm text-brand-subtext">
              Enter escrow amount for {acceptingProposal.job?.title || 'this job'}.
            </p>

            <label htmlFor="escrow-amount" className="mt-4 block text-sm font-medium text-brand-text">
              Amount
            </label>
            <input
              id="escrow-amount"
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
                onClick={handlePayAndStart}
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

export default AllProposals
