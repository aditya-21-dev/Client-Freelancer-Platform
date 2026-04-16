import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <h1 className="text-xl font-bold text-blue-600">
          FreelanceHub
        </h1>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600 text-sm font-medium"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </header>
  )
}

export default Navbar