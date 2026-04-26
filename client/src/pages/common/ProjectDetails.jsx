import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import ProposalForm from '../../components/proposals/ProposalForm'
import { getJson } from '../../utils/api'
import { createProposal, fetchFreelancerProposals } from '../../services/proposalService'

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [hasExistingProposal, setHasExistingProposal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [proposalError, setProposalError] = useState('')

  useEffect(() => {
    if (!id) return

    let active = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const [projectData, freelancerProposals] = await Promise.all([
          getJson(`/api/projects/${id}`),
          fetchFreelancerProposals().catch(() => []),
        ])

        if (!active) return

        setProject(projectData)
        const proposalExists = Array.isArray(freelancerProposals)
          ? freelancerProposals.some((proposal) => proposal.job?._id === id)
          : false
        setHasExistingProposal(proposalExists)
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load project')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [id])

  const canSubmitProposal = useMemo(
    () => Boolean(project && project.status === 'open' && !hasExistingProposal),
    [project, hasExistingProposal],
  )

  const handleSubmitProposal = async ({ jobId, text }) => {
    try {
      setSubmitting(true)
      setProposalError('')

      await createProposal({ jobId, text })
      setHasExistingProposal(true)
      setShowProposalForm(false)
      navigate('/freelancer/my-proposals')
    } catch (err) {
      setProposalError(err?.message || 'Failed to submit proposal')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-brand-border bg-brand-messageReceived p-4 text-sm text-brand-text">
        {error}
      </section>
    )
  }

  if (!project) {
    return null
  }

  return (
    <section className="mx-auto max-w-4xl space-y-4 rounded-2xl border border-brand-border bg-brand-background p-6 text-brand-text">
      <div>
        <h1 className="text-2xl font-semibold text-brand-text">{project.title}</h1>
        <p className="mt-1 text-sm text-brand-subtext">
          Posted on {new Date(project.created_at || Date.now()).toLocaleDateString()}
        </p>
      </div>

      <div className="rounded-2xl border border-brand-border bg-brand-background p-4">
        <h2 className="text-base font-semibold text-brand-text">Project Description</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-brand-subtext">{project.description}</p>
      </div>

      {canSubmitProposal ? (
        <button
          type="button"
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setShowProposalForm((previous) => !previous)}
        >
          {showProposalForm ? 'Hide Proposal Form' : 'Submit Proposal'}
        </button>
      ) : null}

      {hasExistingProposal ? (
        <button
          type="button"
          onClick={() => navigate('/freelancer/my-proposals')}
          className="rounded-xl border border-brand-border bg-brand-background px-4 py-2 text-sm font-semibold text-brand-text"
        >
          View Your Proposal
        </button>
      ) : null}

      {showProposalForm && canSubmitProposal ? (
        <ProposalForm
          jobId={id}
          onSubmit={handleSubmitProposal}
          submitting={submitting}
          error={proposalError}
        />
      ) : null}
    </section>
  )
}

export default ProjectDetails
