import { useEffect, useState } from 'react'
import { getMyEarnings } from '../../api/earningsApi'

const Earnings = () => {
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadEarnings = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getMyEarnings()
        if (!active) return
        setTotalEarnings(Number(data?.totalEarnings || 0))
      } catch (err) {
        if (!active) return
        console.error('[Earnings.loadEarnings] error', err)
        setError(err?.message || 'Failed to load earnings')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadEarnings()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">Earnings</h1>
        <p className="mt-1 text-sm text-brand-subtext">Track your approved project payouts.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-sm text-brand-subtext">
          Loading earnings...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-5 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageSent p-5">
          <p className="text-sm text-brand-subtext">Total Earnings</p>
          <h2 className="mt-1 text-3xl font-semibold text-brand-text">
            INR {totalEarnings.toLocaleString()}
          </h2>
        </div>
      ) : null}
    </section>
  )
}

export default Earnings
