import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Loader from '../../components/Loader'
import { useNavigate } from 'react-router-dom'

const statusBadgeClasses = {
  open: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  in_progress: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  completed: 'bg-gray-100 text-gray-700 ring-gray-500/10',
}

const MyJobs = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(
    location.state?.created ? 'Project created successfully.' : ''
  )

  useEffect(() => {
    // wait until user is available
    if (!user) return
  
    const allProjects = JSON.parse(localStorage.getItem('projects')) || []
  
    const myProjects = allProjects.filter(
      (p) => p.client_id === user._id
    )
  
    if (location.state?.project) {
      const newProject = location.state.project
    
      const filtered = myProjects.filter(
        (p) => p._id !== newProject._id
      )
    
      setProjects([newProject, ...filtered])
    } else {
      setProjects(myProjects)
    }
  
    setLoading(false) // ✅ ALWAYS runs after user is ready
  }, [user])

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure?')) return
  
    const all = JSON.parse(localStorage.getItem('projects')) || []
  
    const updated = all.filter((p) => p._id !== id)
  
    localStorage.setItem('projects', JSON.stringify(updated))
  
    setProjects((prev) => prev.filter((p) => p._id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">
            Track all the projects you've posted and manage proposals.
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-1">No projects yet</h2>
          <p className="text-gray-600 text-sm">
            Start by posting your first project to hire top freelancers.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Proposals
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {projects.map((project) => (
                <tr key={project._id}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {project.title}
                      </span>
                      <span className="text-xs text-gray-500 line-clamp-1">
                        {project.description}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {project.budget_type === 'hourly' ? 'Hourly' : 'Fixed'}{' '}
                    <span className="font-semibold text-gray-900">
                      ${project.budget_min} - ${project.budget_max}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {(() => {
                      const status = project.status || 'open'

                      return (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                            statusBadgeClasses[status] || statusBadgeClasses.open
                          }`}
                        >
                          {status === 'in_progress'
                            ? 'In Progress'
                            : status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      )
                    })()}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {project.proposalsCount ?? 0}
                  </td>

                  <td className="px-6 py-4 text-right text-sm">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/client/proposals/${project._id}`)}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          Proposals
                        </button>

                        <button
                          onClick={() => handleDelete(project._id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                        >
                          Delete
                        </button>

                      </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  )
}

export default MyJobs