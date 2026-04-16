import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProposalForm from '../../components/proposals/ProposalForm'
import { mockJobs } from '../../data/mockJobs'

const JobDetails = () => {
  const { id } = useParams()
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const job = useMemo(() => mockJobs.find((item) => item.id === id), [id])

  const handleSubmitProposal = (proposalData) => {
    console.log(proposalData)
    setSuccessMessage('Proposal submitted successfully.')
    setShowProposalForm(false)
  }

  if (!job) {
    return (
      <section className="rounded-xl border border-brand-border bg-brand-background p-6">
        <h1 className="text-brand-text text-xl font-semibold">Job not found</h1>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-brand-border bg-brand-background p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <h1 className="break-words text-2xl font-semibold text-brand-text">{job.title}</h1>
            <p className="text-brand-subtext text-sm">Posted {job.postedTime}</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-brand-text text-lg font-semibold">Description</h2>
            <p className="text-brand-subtext text-sm leading-7 break-words whitespace-pre-line">
              {job.fullDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-brand-border bg-brand-background p-4">
              <p className="text-brand-subtext text-sm">Budget</p>
              <p className="text-brand-text text-base font-semibold mt-1 break-words">{job.budget}</p>
            </div>

            <div className="rounded-xl border border-brand-border bg-brand-background p-4">
              <p className="text-brand-subtext text-sm">Posted Time</p>
              <p className="text-brand-text text-base font-semibold mt-1 break-words">{job.postedTime}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-brand-text text-lg font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="max-w-full truncate rounded-xl border border-brand-border bg-brand-background px-3 py-1 text-sm text-brand-subtext"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-xl border border-brand-border bg-brand-background p-4 lg:sticky lg:top-24 lg:self-start">
          <button
            type="button"
            onClick={() => {
              setSuccessMessage('')
              setShowProposalForm((prev) => !prev)
            }}
            className="w-full rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showProposalForm ? 'Hide Proposal Form' : 'Send Proposal'}
          </button>

          {showProposalForm && (
            <ProposalForm
              jobId={job.id}
              onSubmit={handleSubmitProposal}
            />
          )}

          {successMessage && (
            <p className="text-brand-subtext text-sm break-words">{successMessage}</p>
          )}
        </aside>
      </div>
    </section>
  )
}

export default JobDetails
