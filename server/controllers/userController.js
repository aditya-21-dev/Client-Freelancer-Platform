import User from '../models/User.js'

export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id

    const users = await User.find({
      _id: { $ne: currentUserId },
    })
      .select('_id name email role')
      .sort({ name: 1 })

    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users' })
  }
}
