import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const ActiveProjects = () => {
  const { user } = useContext(AuthContext)

  const [projects, setProjects] = useState([])

  useEffect(() => {
    if (!user?._id) return

    const proposals =
      JSON.parse(localStorage.getItem('proposals')) || []

    const transactions =
      JSON.parse(localStorage.getItem('transactions')) || []

    // 🔥 get proposals of this freelancer
    const myProposals = proposals.filter(
      (p) => p.freelancerId === user._id
    )

    // 🔥 get active transactions (pending)
    const activeTransactions = transactions.filter(
      (t) =>
        t.status === 'pending' &&
        myProposals.some((p) => p.id === t.proposalId)
    )

    // 🔥 map to project details
    const allProjects =
      JSON.parse(localStorage.getItem('projects')) || []

    const result = activeTransactions.map((t) => {
      const project = allProjects.find(
        (p) => p._id === t.projectId
      )

      return {
        ...t,
        title: project?.title || 'Untitled Project',
        description: project?.description || '',
      }
    })

    setProjects(result)
  }, [user])

  const getRemainingTime = (deadline) => {
    const diff = new Date(deadline) - new Date()

    if (diff <= 0) return 'Expired'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    )

    return `${days}d ${hours}h left`
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-2xl font-semibold mb-6">
        Active Projects
      </h1>

      {projects.length === 0 ? (
        <p>No active projects</p>
      ) : (
        projects.map((p) => (
          <div key={p.id} className="p-4 border rounded mb-3">

            <h3 className="font-semibold">{p.title}</h3>

            <p className="text-sm text-gray-600">
              {p.description}
            </p>

            <div className="mt-2 flex justify-between items-center">
              <span className="text-orange-600 text-sm font-medium">
                In Progress
              </span>

              <span className="text-xs text-gray-500">
                {getRemainingTime(p.deadline)}
              </span>
            </div>

          </div>
        ))
      )}

    </div>
  )
}

export default ActiveProjects