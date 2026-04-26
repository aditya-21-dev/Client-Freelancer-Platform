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

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const updateUserProfile = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id
    const { name, email } = req.body || {}

    const normalizedName = typeof name === 'string' ? name.trim() : ''
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : ''

    if (!currentUserId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!normalizedName || !normalizedEmail) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: currentUserId },
    }).select('_id')

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      {
        $set: {
          name: normalizedName,
          email: normalizedEmail,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select('_id name email role')

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({ user: updatedUser })
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    return res.status(500).json({ message: 'Failed to update profile' })
  }
}
