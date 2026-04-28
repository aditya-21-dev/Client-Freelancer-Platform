import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createSubmission } from '../api/submissionApi'

const FreelancerSubmit = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!jobId) {
      setError('Job id is missing')
      return
    }

    if (!file) {
      setError('Please select a file to submit')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      await createSubmission({ jobId, file, message })

      setSuccess('Project file submitted successfully')
      setFile(null)
      setMessage('')
    } catch (err) {
      console.error('[FreelancerSubmit.handleSubmit] error', err)
      setError(err?.message || 'Failed to submit file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4 text-brand-text">
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">Submit Project File</h1>
        <p className="mt-1 text-sm text-brand-subtext">Upload completed work for this job.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-brand-border bg-brand-background p-5"
      >
        {error ? (
          <div className="rounded-xl border border-brand-border bg-brand-messageReceived px-3 py-2 text-sm text-brand-text">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-brand-border bg-brand-messageSent px-3 py-2 text-sm text-brand-text">
            {success}
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="submission-file" className="text-sm font-medium text-brand-text">
            Project File
          </label>
          <input
            id="submission-file"
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="w-full rounded-xl border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-text"
          />
          {file ? <p className="text-xs text-brand-subtext">{file.name}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="submission-message" className="text-sm font-medium text-brand-text">
            Message (Optional)
          </label>
          <textarea
            id="submission-message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Add delivery notes for the client..."
            className="w-full rounded-xl border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-text"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit File'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/freelancer/active-projects')}
            className="rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-medium text-brand-text"
          >
            Back
          </button>
        </div>
      </form>
    </section>
  )
}

export default FreelancerSubmit
