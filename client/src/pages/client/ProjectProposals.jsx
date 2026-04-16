import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Loader from '../../components/Loader'
import ProposalList from '../../components/proposals/ProposalList'

const ProjectProposals = () => {
  const { user } = useContext(AuthContext)
  const { projectId } = useParams()

  const [project, setProject] = useState(null)
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user || !projectId) return

    try {
      // 🔥 get project from localStorage
      const allProjects = JSON.parse(localStorage.getItem('projects')) || []
      const foundProject = allProjects.find((p) => p._id === projectId)

      setProject(foundProject)

      // 🔥 get proposals from localStorage
      const allProposals = JSON.parse(localStorage.getItem('proposals')) || []

      const filtered = allProposals.filter(
        (p) => p.projectId === projectId
      )

      setProposals(filtered)

    } catch (err) {
      setError('Failed to load proposals')
    } finally {
      setLoading(false)
    }
  }, [user, projectId])

  const getProjectById = () => project

  const getFreelancerById = () => ({
    name: 'Freelancer', // later replace with real user data
  })

  const updateStatus = (proposalId, status) => {
    const all = JSON.parse(localStorage.getItem('proposals')) || []

    const updated = all.map((p) =>
      p.id === proposalId ? { ...p, status } : p
    )

    localStorage.setItem('proposals', JSON.stringify(updated))

    setProposals(updated.filter((p) => p.projectId === projectId))
  }

  const handleShortlist = (proposal) =>
    updateStatus(proposal.id, 'shortlisted')

  const handleReject = (proposal) =>
    updateStatus(proposal.id, 'rejected')

  const handleAccept = (proposal) => {
    updateStatus(proposal.id, 'accepted')

    // 🔥 also update project status
    const allProjects = JSON.parse(localStorage.getItem('projects')) || []

    const updatedProjects = allProjects.map((p) =>
      p._id === projectId ? { ...p, status: 'in_progress' } : p
    )

    localStorage.setItem('projects', JSON.stringify(updatedProjects))

    setProject((prev) => ({ ...prev, status: 'in_progress' }))
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Project Proposals
        </h1>

        {project && (
          <p className="text-gray-600 mt-1">
            Reviewing proposals for{' '}
            <span className="font-medium">{project.title}</span>
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : proposals.length === 0 ? (
        <p>No proposals yet</p>
      ) : (
        <ProposalList
          proposals={proposals}
          getProjectById={getProjectById}
          getFreelancerById={getFreelancerById}
          context="client"
          onShortlist={handleShortlist}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  )
}

export default ProjectProposals