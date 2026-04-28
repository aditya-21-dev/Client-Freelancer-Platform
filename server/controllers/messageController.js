import Message from '../models/Message.js'

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, conversationId, text, jobId, type } = req.body || {}
    const senderId = req.user?.id || req.user?._id
    const normalizedConversationId =
      typeof conversationId === 'string' ? conversationId.trim() : ''
    const normalizedText = typeof text === 'string' ? text.trim() : ''

    if (!senderId || !receiverId || !normalizedConversationId || !normalizedText) {
      return res.status(400).json({ message: 'receiverId, conversationId and text are required' })
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      conversationId: normalizedConversationId,
      text: normalizedText,
      jobId: jobId || null,
      type: type === 'revision' ? 'revision' : 'normal',
    })

    return res.status(201).json(message)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' })
  }
}

export const getMessages = async (req, res) => {
  try {
    const conversationId =
      typeof req.params.conversationId === 'string' ? req.params.conversationId.trim() : ''

    if (!conversationId) {
      return res.status(400).json({ message: 'conversationId is required' })
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 })

    return res.status(200).json(messages)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' })
  }
}
