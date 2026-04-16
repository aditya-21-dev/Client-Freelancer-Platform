import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

const Earnings = () => {
  const { user } = useContext(AuthContext)

  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('lifetime')
  const [earnings, setEarnings] = useState(0)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (!user?._id) return

    const proposals =
      JSON.parse(localStorage.getItem('proposals')) || []

    const transactions =
      JSON.parse(localStorage.getItem('transactions')) || []

    const myProposals = proposals.filter(
      (p) => p.freelancerId === user._id
    )

    const myTransactions = transactions.filter(
      (t) =>
        t.status === 'completed' &&
        myProposals.some((p) => p.id === t.proposalId)
    )

    setTransactions(myTransactions)
  }, [user])

  useEffect(() => {
    const now = new Date()

    const proposals =
      JSON.parse(localStorage.getItem('proposals')) || []

    const filtered = transactions.filter((t) => {
      const created = new Date(t.createdAt)

      if (filter === '24h') return now - created <= 86400000
      if (filter === 'week') return now - created <= 604800000
      if (filter === 'month') return now - created <= 2592000000
      if (filter === 'year') return now - created <= 31536000000

      return true
    })

    // 🔥 TOTAL EARNINGS
    const total = filtered.reduce((sum, t) => {
      const proposal = proposals.find(
        (p) => p.id === t.proposalId
      )
      return sum + Number(proposal?.bidAmount || 0)
    }, 0)

    setEarnings(total)

    // 🔥 CHART DATA (group by date)
    const grouped = {}

    filtered.forEach((t) => {
      const date = new Date(t.createdAt).toLocaleDateString()

      const proposal = proposals.find(
        (p) => p.id === t.proposalId
      )

      const amount = Number(proposal?.bidAmount || 0)

      if (!grouped[date]) grouped[date] = 0
      grouped[date] += amount
    })

    const formatted = Object.keys(grouped).map((date) => ({
      date,
      earnings: grouped[date],
    }))

    setChartData(formatted)
  }, [transactions, filter])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* 🔥 HEADER */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6">
        Earnings
      </h1>

      {/* 🔥 FILTER */}
      <div className="mb-6 w-full sm:w-auto">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-auto border p-2 rounded-md"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="week">Last 1 Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
          <option value="lifetime">Lifetime</option>
        </select>
      </div>

      {/* 🔥 TOTAL CARD */}
      <div className="p-4 sm:p-6 border rounded-xl mb-6 bg-green-50">
        <p className="text-sm text-gray-600">Total Earnings</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-700">
          ₹ {earnings}
        </h2>
      </div>

      {/* 🔥 CHART */}
      <div className="bg-white p-4 sm:p-6 border rounded-xl mb-6">

        <h2 className="text-base sm:text-lg font-semibold mb-4">
          Earnings Over Time
        </h2>

        {chartData.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No data to display
          </p>
        ) : (
          <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 🔥 TRANSACTIONS */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3">
          Completed Transactions
        </h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No earnings yet</p>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className="p-4 border rounded mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <p className="text-sm">
                <strong>Project ID:</strong> {t.projectId}
              </p>

              <p className="text-green-600 text-sm mt-1 sm:mt-0">
                Completed
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default Earnings