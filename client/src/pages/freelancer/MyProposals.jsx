import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const MyProposals = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [proposals, setProposals] = useState([])

  useEffect(() => {
    if (!user?._id) return

    const all =
      JSON.parse(localStorage.getItem('proposals')) || []

    const my = all.filter(
      (p) => p.freelancerId === user._id
    )

    setProposals(my)
  }, [user])

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600'
      case 'rejected':
        return 'text-red-600'
      default:
        return 'text-orange-600'
    }
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-2xl font-semibold mb-6">
        My Proposals
      </h1>

      {proposals.length === 0 ? (
        <p>No proposals submitted</p>
      ) : (
        proposals.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/proposals/${p.id}`)}
            className="p-4 border rounded mb-3 cursor-pointer hover:bg-gray-50"
          >

            <h3 className="font-semibold">{p.title}</h3>

            <p className="text-sm text-gray-600">
              {p.description}
            </p>

            <div className="mt-2 flex justify-between items-center">
              <span
                className={`text-sm font-medium ${getStatusStyle(p.status)}`}
              >
                {p.status.toUpperCase()}
              </span>

              <span className="text-xs text-gray-500">
                ₹ {p.bidAmount}
              </span>
            </div>

          </div>
        ))
      )}

    </div>
  )
}

export default MyProposals