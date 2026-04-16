import { useState } from 'react'

const LoginForm = ({ role, onBack, onLogin }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // send data to parent (Login.jsx)
    onLogin(form)
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold text-gray-900 capitalize">
        {role} Login
      </h2>

      <p className="text-gray-600 text-sm mt-1">
        Enter your details to continue
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">

        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Continue
        </button>

      </form>
    </div>
  )
}

export default LoginForm