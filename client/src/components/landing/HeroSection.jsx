import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            Hire Talent or Get Hired Faster
          </h1>

          <p className="mt-6 text-lg text-blue-100">
            FreelanceHub connects clients with skilled freelancers to get work done efficiently and professionally.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hidden md:block">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <div className="space-y-4">

              <div className="bg-white text-gray-800 p-4 rounded-lg shadow">
                <p className="font-semibold">UI Design Project</p>
                <p className="text-sm text-gray-500">$500 • 5 days</p>
              </div>

              <div className="bg-white text-gray-800 p-4 rounded-lg shadow">
                <p className="font-semibold">React Website</p>
                <p className="text-sm text-gray-500">$1200 • 10 days</p>
              </div>

              <div className="bg-white text-gray-800 p-4 rounded-lg shadow">
                <p className="font-semibold">Mobile App</p>
                <p className="text-sm text-gray-500">$2000 • 20 days</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection
