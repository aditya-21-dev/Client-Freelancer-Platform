import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
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
    <section className="mx-auto w-full max-w-4xl space-y-8 p-2 sm:p-4">
      <Card className="p-6">
        <p className="text-sm font-medium text-brand-subtext">Client Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-brand-text">Post a New Job</h1>
        <p className="mt-2 text-sm text-brand-subtext">Create a clear job brief so freelancers can send strong proposals.</p>
      </Card>

      <Card as="form" onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-brand-text">
              Job Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Build a modern portfolio website"
              className="mt-2 w-full rounded-2xl border border-brand-border bg-brand-background p-3 text-brand-text shadow-md transition focus:outline-none focus:shadow-lg"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-brand-text">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Share project scope, expectations, and key deliverables"
              className="mt-2 w-full rounded-2xl border border-brand-border bg-brand-background p-3 text-brand-text shadow-md transition focus:outline-none focus:shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-brand-text">
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
                placeholder="Enter total budget"
                className="mt-2 w-full rounded-2xl border border-brand-border bg-brand-background p-3 text-brand-text shadow-md transition focus:outline-none focus:shadow-lg"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-brand-text">
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-brand-border bg-brand-background p-3 text-brand-text shadow-md transition focus:outline-none focus:shadow-lg"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-3">
              <p className="text-sm text-brand-text">{error}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl border border-brand-border bg-brand-primary p-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-80"
          >
            {submitting ? 'Posting Job...' : 'Post Job'}
          </button>
        </div>
      </Card>
    </section>
  )
}

export default PostJob
