import Payment from '../models/Payment.js'

export const getClientPayments = async (req, res) => {
  try {
    const clientId = req.user?._id
    if (!clientId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const payments = await Payment.find({ client: clientId })
      .populate('job', 'title')
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 })

    return res.status(200).json(payments)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch transactions' })
  }
}
