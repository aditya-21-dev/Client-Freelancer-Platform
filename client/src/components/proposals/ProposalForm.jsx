import { useState } from 'react'

const ProposalForm = ({ jobId, onSubmit, submitting = false, error = '' }) => {
  const [coverLetter, setCoverLetter] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedCoverLetter = coverLetter.trim()
    const trimmedBidAmount = String(bidAmount).trim()
    const trimmedDeliveryTime = String(deliveryTime).trim()

    if (!trimmedCoverLetter || !trimmedBidAmount || !trimmedDeliveryTime) {
      setValidationError('Please fill all required fields.')
      return
    }

    setValidationError('')

    onSubmit({
      jobId,
      coverLetter: trimmedCoverLetter,
      bidAmount: Number(trimmedBidAmount),
      deliveryTime: Number(trimmedDeliveryTime),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-lg space-y-5 rounded-xl border border-brand-border bg-brand-background p-4 sm:p-5"
    >
      {(validationError || error) && (
        <p className="text-brand-subtext text-sm">{validationError || error}</p>
      )}

      <div className="space-y-2">
        <label className="text-brand-text text-sm font-medium">Cover Letter</label>
        <textarea
          value={coverLetter}
          onChange={(event) => setCoverLetter(event.target.value)}
          rows={6}
          className="w-full rounded-xl border border-brand-border bg-brand-background p-3 text-sm text-brand-text"
          placeholder="Write your proposal"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-brand-text text-sm font-medium">Bid Amount</label>
          <input
            type="number"
            min="1"
            value={bidAmount}
            onChange={(event) => setBidAmount(event.target.value)}
            className="w-full rounded-xl border border-brand-border bg-brand-background p-3 text-sm text-brand-text"
            placeholder="Enter amount"
          />
        </div>

        <div className="space-y-2">
          <label className="text-brand-text text-sm font-medium">Delivery Time (days)</label>
          <input
            type="number"
            min="1"
            value={deliveryTime}
            onChange={(event) => setDeliveryTime(event.target.value)}
            className="w-full rounded-xl border border-brand-border bg-brand-background p-3 text-sm text-brand-text"
            placeholder="Enter days"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? 'Submitting...' : 'Submit Proposal'}
      </button>
    </form>
  )
}

export default ProposalForm
