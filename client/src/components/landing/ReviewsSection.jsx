const reviews = [
  {
    text: 'Amazing platform, got clients instantly!',
    name: 'Rahul',
  },
  {
    text: 'Very smooth hiring experience.',
    name: 'Priya',
  },
  {
    text: 'Best freelancing platform I’ve used.',
    name: 'Arjun',
  },
]

const ReviewsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-center text-gray-900">
          What Users Say
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-gray-50 p-6 rounded-xl border border-gray-200"
            >
              <p className="text-gray-600 text-sm">“{r.text}”</p>
              <p className="mt-4 font-semibold text-gray-900">
                — {r.name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ReviewsSection