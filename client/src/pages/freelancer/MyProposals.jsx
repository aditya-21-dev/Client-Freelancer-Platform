import { useEffect, useState } from 'react'
import { fetchFreelancerProposals } from '../../services/proposalService'

const MyProposals = () => {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadProposals = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await fetchFreelancerProposals()
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

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold">My Proposals</h1>
        <p className="mt-1 text-sm text-brand-subtext">Track all proposals you have submitted.</p>
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
          No proposals submitted yet.
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
                  <h2 className="text-base font-semibold text-brand-text">
                    {proposal.job?.title || 'Untitled Job'}
                  </h2>
                  <p className="text-sm text-brand-subtext">
                    Client: {proposal.client?.name || 'Unknown'}
                  </p>
                </div>

                <span className="rounded-xl border border-brand-border bg-brand-messageReceived px-3 py-1 text-xs font-medium capitalize text-brand-text">
                  {proposal.status}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-brand-text">{proposal.text}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default MyProposals
