import { useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const SubmitProposal = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [form, setForm] = useState({
    title: '',
    description: '',
    bidAmount: '',
    deliveryTime: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newProposal = {
      id: Date.now().toString(),
      projectId,                    // 🔥 VERY IMPORTANT
      freelancerId: user._id,       // 🔥 link to freelancer
      title: form.title,
      description: form.description,
      bidAmount: form.bidAmount,
      deliveryTime: form.deliveryTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    const existing =
      JSON.parse(localStorage.getItem('proposals')) || []

    const updated = [newProposal, ...existing]

    localStorage.setItem('proposals', JSON.stringify(updated))

    // redirect back to freelancer dashboard
    navigate('/freelancer/dashboard')
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Submit Proposal</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Proposal Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Describe your proposal"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="bidAmount"
          placeholder="Bid Amount"
          value={form.bidAmount}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="deliveryTime"
          placeholder="Delivery Time (days)"
          value={form.deliveryTime}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Submit Proposal
        </button>

      </form>
    </div>
  )
}

export default SubmitProposal