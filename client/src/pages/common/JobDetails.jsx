import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProposalForm from '../../components/proposals/ProposalForm'
import { AuthContext } from '../../context/AuthContext'
import { fetchJobById } from '../../services/jobService'
import { createProposal } from '../../services/proposalService'

const formatDate = (value) => {
  if (!value) return 'Not specified'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Not specified'
  return parsed.toLocaleDateString()
}

const JobDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [proposalError, setProposalError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showProposalForm, setShowProposalForm] = useState(false)

  useEffect(() => {
    if (!id) return

    let active = true

    const loadJob = async () => {
      try {
        setIsLoading(true)
        setError('')

        const data = await fetchJobById(id)
        if (!active) return

        setJob(data)
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load job')
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadJob()

    return () => {
      active = false
    }
  }, [id])

  const isFreelancer = useMemo(() => user?.role === 'freelancer', [user?.role])

  const handleSubmitProposal = async ({ jobId, text }) => {
    try {
      setIsSubmitting(true)
      setProposalError('')
      setSuccessMessage('')

      await createProposal({ jobId, text })
      setSuccessMessage('Proposal sent successfully.')
      setShowProposalForm(false)
    } catch (err) {
      setProposalError(err?.message || 'Failed to send proposal')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-brand-border bg-brand-background p-6 text-brand-subtext">
        Loading job details...
      </section>
    )
  }

  if (error || !job) {
    return (
      <section className="rounded-2xl border border-brand-border bg-brand-background p-6">
        <h1 className="text-xl font-semibold text-brand-text">Job not found</h1>
        <p className="mt-2 text-sm text-brand-subtext">{error || 'This job is not available right now.'}</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-brand-border bg-brand-background p-4 text-brand-text sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <h1 className="break-words text-2xl font-semibold text-brand-text">{job.title}</h1>
            <p className="text-sm text-brand-subtext">Posted by {job.client?.name || 'Client'}</p>
          </div>

          <div className="space-y-3 rounded-2xl border border-brand-border bg-brand-background p-4">
            <h2 className="text-lg font-semibold text-brand-text">Description</h2>
            <p className="break-words whitespace-pre-line text-sm leading-7 text-brand-subtext">
              {job.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-4">
              <p className="text-sm text-brand-subtext">Budget</p>
              <p className="mt-1 text-base font-semibold text-brand-text">INR {Number(job.budget || 0).toLocaleString()}</p>
            </div>

            <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-4">
              <p className="text-sm text-brand-subtext">Deadline</p>
              <p className="mt-1 text-base font-semibold text-brand-text">{formatDate(job.deadline)}</p>
            </div>
          </div>

          {successMessage ? (
            <p className="rounded-xl border border-brand-border bg-brand-messageSent px-4 py-2 text-sm text-brand-text">
              {successMessage}
            </p>
          ) : null}
        </div>

        <aside className="space-y-3 rounded-2xl border border-brand-border bg-brand-background p-4 lg:sticky lg:top-24 lg:self-start">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-medium text-brand-text"
          >
            Back
          </button>

          {isFreelancer ? (
            <button
              type="button"
              onClick={() => {
                setSuccessMessage('')
                setProposalError('')
                setShowProposalForm((previous) => !previous)
              }}
              className="w-full rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white"
            >
              {showProposalForm ? 'Close Proposal Form' : 'Send Proposal'}
            </button>
          ) : null}

          {showProposalForm && isFreelancer ? (
            <ProposalForm
              jobId={job._id}
              onSubmit={handleSubmitProposal}
              submitting={isSubmitting}
              error={proposalError}
            />
          ) : null}
        </aside>
      </div>
    </section>
  )
}

export default JobDetails
