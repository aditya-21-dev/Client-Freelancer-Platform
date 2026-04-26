import { useState } from 'react'

const ProposalForm = ({ jobId, onSubmit, submitting = false, error = '' }) => {
  const [text, setText] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedText = text.trim()

    if (!trimmedText) {
      setValidationError('Proposal text is required.')
      return
    }

    setValidationError('')

    onSubmit({
      jobId,
      text: trimmedText,
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
        <label className="text-brand-text text-sm font-medium">Proposal</label>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={6}
          className="w-full rounded-xl border border-brand-border bg-brand-background p-3 text-sm text-brand-text"
          placeholder="Write why you are a good fit for this job..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}

export default ProposalForm
