import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJob } from '../../services/jobService'

const initialFormState = {
  title: '',
  description: '',
  budget: '',
  deadline: '',
}

const PostJob = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialFormState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await createJob({
        title: form.title.trim(),
        description: form.description.trim(),
        budget: Number(form.budget),
        deadline: form.deadline,
      })

      navigate('/client/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to post job')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <div className="rounded-xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold text-brand-text">Post Job</h1>
        <p className="mt-1 text-sm text-brand-subtext">
          Create a job and publish it for freelancers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-brand-border bg-brand-background p-5">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-brand-text">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-brand-border bg-brand-background p-3 text-brand-text"
            />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium text-brand-text">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-brand-border bg-brand-background p-3 text-brand-text"
            />
          </div>

          <div>
            <label htmlFor="budget" className="text-sm font-medium text-brand-text">
              Budget
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="0"
              step="0.01"
              value={form.budget}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-brand-border bg-brand-background p-3 text-brand-text"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="text-sm font-medium text-brand-text">
              Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-brand-border bg-brand-background p-3 text-brand-text"
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-brand-border bg-brand-messageReceived p-3">
              <p className="text-sm text-brand-text">{error}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg border border-brand-border bg-brand-primary p-3 text-sm font-semibold text-brand-text"
          >
            {submitting ? 'Posting Job...' : 'Post Job'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default PostJob

