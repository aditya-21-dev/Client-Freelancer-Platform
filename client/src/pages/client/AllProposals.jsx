import { useEffect, useState } from 'react'
import Loader from '../../components/Loader'

const AllProposals = () => {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('proposals')) || []
    setProposals(all)
    setLoading(false)
  }, [])

  if (loading) return <Loader />

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">All Proposals</h1>

      {proposals.length === 0 ? (
        <p>No proposals yet</p>
      ) : (
        proposals.map((p) => (
          <div key={p.id} className="p-4 border rounded mb-3">
            <h3 className="font-semibold">{p.title}</h3>
            <p>{p.description}</p>
            <p className="text-sm text-gray-500">
              Project ID: {p.projectId}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default AllProposals