import { useEffect, useState } from 'react'
import { fetchClientTransactions } from '../../services/paymentService'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadTransactions = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await fetchClientTransactions()
        if (!active) return

        setTransactions(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load transactions')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadTransactions()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="mt-1 text-sm text-brand-subtext">Escrow records for accepted proposals.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          Loading transactions...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-5 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {!loading && !error && transactions.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          No transactions yet.
        </div>
      ) : null}

      {!loading && !error && transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <article
              key={transaction._id}
              className="rounded-2xl border border-brand-border bg-brand-background p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-brand-text">
                    {transaction.job?.title || 'Job'}
                  </h2>
                  <p className="text-sm text-brand-subtext">
                    Freelancer: {transaction.freelancer?.name || 'Unknown'}
                  </p>
                </div>

                <span className="rounded-xl border border-brand-border bg-brand-messageSent px-3 py-1 text-xs font-medium capitalize text-brand-text">
                  {transaction.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-brand-subtext">
                Amount: INR {Number(transaction.amount || 0).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default Transactions
