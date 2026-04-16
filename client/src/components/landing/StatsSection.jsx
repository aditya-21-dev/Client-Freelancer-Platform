const stats = [
  { label: 'Freelancers', value: '5,000+' },
  { label: 'Clients', value: '2,000+' },
  { label: 'Projects', value: '10,000+' },
]

const StatsSection = () => {
  return (
    <section className="bg-white py-16 -mt-16">
      <div className="max-w-5xl mx-auto px-4">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white shadow-xl rounded-2xl p-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <h3 className="text-3xl font-bold text-blue-600">
                {stat.value}
              </h3>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default StatsSection