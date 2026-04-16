import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import ProposalForm from '../../components/proposals/ProposalForm'
import { AuthContext } from '../../context/AuthContext'
import { getJson, sendJson } from '../../utils/api'
import { createProposal, getProposalsByFreelancer } from '../../services/proposalService'

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [proposalError, setProposalError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getJson(`/api/projects/${id}`)
        setProject(data)
      } catch (err) {
        setError(err.message || 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      load()
    }
  }, [id])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  const client = project.client_id || {}
  const canSubmitProposal =
    user && user.role === 'freelancer' && project.status === 'open'

  const hasExistingProposal = () => {
    if (!user?._id || !id) return false
    const proposals = getProposalsByFreelancer(user._id)
    return proposals.some((p) => p.projectId === id && p.status !== 'withdrawn')
  }

  const handleSubmitProposal = async (values) => {
    if (!user?._id || !id) return
    setSubmitting(true)
    setProposalError(null)
    try {
      const proposal = createProposal({
        projectId: id,
        freelancerId: user._id,
        coverLetter: values.coverLetter,
        bidAmount: values.bidAmount,
        deliveryTime: values.deliveryTime,
        attachments: values.attachments,
      })

      const newCount = (project.proposalsCount || 0) + 1
      await sendJson(`/api/projects/${project._id}`, {
        method: 'PUT',
        body: {
          ...project,
          client_id: project.client_id?._id || project.client_id,
          proposalsCount: newCount,
        },
      })
      setProject((prev) => ({ ...prev, proposalsCount: newCount }))
      navigate('/freelancer/my-proposals')
      return proposal
    } catch (err) {
      setProposalError(err.message || 'Failed to submit proposal')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Posted on {new Date(project.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Project Description</h2>
            <p className="text-sm text-gray-800 whitespace-pre-line">{project.description}</p>
          </section>

          {project.skills && project.skills.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Project Overview</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Budget</dt>
                <dd className="font-medium text-gray-900">
                  {project.budget_type === 'hourly' ? 'Hourly' : 'Fixed'} ${project.budget_min} - $
                  {project.budget_max}
                </dd>
              </div>
              {project.duration && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Duration</dt>
                  <dd className="font-medium text-gray-900">{project.duration}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Experience</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {project.experience_level || 'Not specified'}
                </dd>
              </div>
              {project.category && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Category</dt>
                  <dd className="font-medium text-gray-900">{project.category}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {project.status === 'in_progress'
                    ? 'In Progress'
                    : project.status || 'Open'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">About the Client</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-gray-900">{client.name || 'Client'}</p>
              <p className="text-gray-500 text-xs">
                Rating:{' '}
                {typeof client.rating === 'number' ? `${client.rating.toFixed(1)} / 5` : 'N/A'} (
                {client.totalReviews ?? 0} reviews)
              </p>
            </div>
          </section>

          {canSubmitProposal && !hasExistingProposal() && (
            <button
              type="button"
              className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              onClick={() => setShowProposalForm((prev) => !prev)}
            >
              {showProposalForm ? 'Hide Proposal Form' : 'Submit Proposal'}
            </button>
          )}

          {canSubmitProposal && hasExistingProposal() && (
            <button
              type="button"
              onClick={() => navigate('/freelancer/my-proposals')}
              className="w-full inline-flex items-center justify-center rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-200"
            >
              View Your Proposal
            </button>
          )}

          {showProposalForm && canSubmitProposal && !hasExistingProposal() && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Submit Proposal</h2>
              <ProposalForm
                onSubmit={handleSubmitProposal}
                submitting={submitting}
                error={proposalError}
              />
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

export default ProjectDetails

