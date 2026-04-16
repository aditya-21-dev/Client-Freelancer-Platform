import { ShieldCheck, Users, MessageCircle } from 'lucide-react'

const features = [
  {
    title: 'Secure Payments',
    desc: 'Your payments are protected and safe.',
    icon: ShieldCheck,
  },
  {
    title: 'Top Talent',
    desc: 'Hire the best freelancers globally.',
    icon: Users,
  },
  {
    title: 'Real-time Chat',
    desc: 'Communicate instantly with built-in chat.',
    icon: MessageCircle,
  },
]

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-center text-gray-900">
          Why Choose FreelanceHub?
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
                  <Icon size={22} />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-4">
                  {f.title}
                </h3>

                <p className="text-gray-600 mt-2 text-sm">
                  {f.desc}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FeaturesSection