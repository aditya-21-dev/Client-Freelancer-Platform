import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProposal } from '../../services/proposalService'

const SubmitProposal = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const normalizedText = text.trim()
    if (!normalizedText) {
      setError('Proposal text is required')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      await createProposal({ jobId: projectId, text: normalizedText })
      navigate('/freelancer/my-proposals')
    } catch (err) {
      setError(err?.message || 'Failed to submit proposal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-brand-border bg-brand-background p-6 text-brand-text">
      <h1 className="text-xl font-semibold text-brand-text">Send Proposal</h1>
      <p className="mt-1 text-sm text-brand-subtext">Share your approach for this job.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="proposal-text" className="mb-2 block text-sm font-medium text-brand-text">
            Proposal
          </label>
          <textarea
            id="proposal-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={8}
            className="w-full rounded-2xl border border-brand-border bg-brand-background p-3 text-sm text-brand-text"
            placeholder="Write your proposal"
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-brand-border bg-brand-messageReceived px-3 py-2 text-sm text-brand-text">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </section>
  )
}

export default SubmitProposal
