import { useEffect, useState } from 'react'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [activeTab, setActiveTab] = useState('pending')

  // 🔥 Load transactions
  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem('transactions')) || []
    setTransactions(data)
  }, [])

  // 🔥 Live countdown updater
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions((prev) => [...prev])
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getRemainingTime = (deadline) => {
    const diff = new Date(deadline) - new Date()

    if (diff <= 0) return 'Expired'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    )

    return `${days}d ${hours}h left`
  }

  const markAsCompleted = (id) => {
    const all =
      JSON.parse(localStorage.getItem('transactions')) || []

    const updated = all.map((t) =>
      t.id === id ? { ...t, status: 'completed' } : t
    )

    localStorage.setItem('transactions', JSON.stringify(updated))
    setTransactions(updated)
  }

  const pending = transactions.filter((t) => t.status === 'pending')
  const completed = transactions.filter((t) => t.status === 'completed')

  const dataToShow =
    activeTab === 'pending' ? pending : completed

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-2xl font-semibold mb-6">
        Transactions
      </h1>

      {/* 🔥 Tabs */}
      <div className="flex border-b mb-6">

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
        >
          Pending Transactions
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'completed'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
        >
          Completed Transactions
        </button>

      </div>

      {/* 🔥 Content */}
      {dataToShow.length === 0 ? (
        <p className="text-gray-500">No transactions</p>
      ) : (
        dataToShow.map((t) => (
          <div key={t.id} className="p-4 border rounded mb-3">

            <p><strong>Project ID:</strong> {t.projectId}</p>

            {activeTab === 'pending' ? (
              <>
                <p className="text-orange-600 font-medium">
                  {getRemainingTime(t.deadline)}
                </p>

                <button
                  onClick={() => markAsCompleted(t.id)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              </>
            ) : (
              <p className="text-green-600 font-medium">
                Completed
              </p>
            )}

          </div>
        ))
      )}

    </div>
  )
}

export default Transactions