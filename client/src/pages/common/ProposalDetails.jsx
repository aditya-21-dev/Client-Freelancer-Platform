import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Loader from '../../components/Loader'

const ProposalDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [proposal, setProposal] = useState(null)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔥 Load data
  useEffect(() => {
    const allProposals = JSON.parse(localStorage.getItem('proposals')) || []
    const foundProposal = allProposals.find((p) => p.id === id)

    const allProjects = JSON.parse(localStorage.getItem('projects')) || []
    const foundProject = allProjects.find(
      (p) => p._id === foundProposal?.projectId
    )

    setProposal(foundProposal)
    setProject(foundProject)
    setLoading(false)
  }, [id])

  // 🔥 Create transaction (safe - no duplicates)
  const createTransaction = () => {
    const transactions =
      JSON.parse(localStorage.getItem('transactions')) || []

    const alreadyExists = transactions.some(
      (t) => t.proposalId === proposal.id
    )

    if (alreadyExists) return

    const newTransaction = {
      id: Date.now().toString(),
      projectId: proposal.projectId,
      proposalId: proposal.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deadline: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }

    localStorage.setItem(
      'transactions',
      JSON.stringify([newTransaction, ...transactions])
    )
  }

  // 🔥 Update proposal status
  const updateStatus = (status) => {
    const all = JSON.parse(localStorage.getItem('proposals')) || []

    const updated = all.map((p) =>
      p.id === id ? { ...p, status } : p
    )

    localStorage.setItem('proposals', JSON.stringify(updated))

    setProposal((prev) => ({ ...prev, status }))

    // 🔥 If accepted → create transaction + update project
    if (status === 'accepted') {
      createTransaction()

      const allProjects = JSON.parse(localStorage.getItem('projects')) || []

      const updatedProjects = allProjects.map((p) =>
        p._id === proposal.projectId
          ? { ...p, status: 'in_progress' }
          : p
      )

      localStorage.setItem('projects', JSON.stringify(updatedProjects))
    }
  }

  if (loading) return <Loader />

  if (!proposal) return <p>Proposal not found</p>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Proposal Details</h1>

      {project && (
        <p className="mb-4 text-gray-600">
          For project:{' '}
          <span className="font-medium">{project.title}</span>
        </p>
      )}

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <div>
          <h2 className="font-semibold">Title</h2>
          <p>{proposal.title}</p>
        </div>

        <div>
          <h2 className="font-semibold">Description</h2>
          <p>{proposal.description}</p>
        </div>

        <div>
          <h2 className="font-semibold">Status</h2>
          <p className="capitalize">{proposal.status}</p>
        </div>

      </div>

      {/* 🔥 Client Actions */}
      {user?.role === 'client' && (
        <div className="mt-6 flex gap-3">

          <button
            onClick={() => updateStatus('accepted')}
            disabled={proposal.status === 'accepted'}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Accept
          </button>

          <button
            onClick={() => updateStatus('rejected')}
            disabled={proposal.status === 'rejected'}
            className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Reject
          </button>

        </div>
      )}
    </div>
  )
}

export default ProposalDetails