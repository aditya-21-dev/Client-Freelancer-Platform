import { createMessageModel } from '../models/Message'
import { createConversationModel } from '../models/Conversation'

const MESSAGES_KEY = 'messages'
const CONVERSATIONS_KEY = 'conversations'

const load = (key) => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const save = (key, value) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore storage errors in simulation mode
  }
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

export const getConversations = (userId) => {
  const conversations = load(CONVERSATIONS_KEY)
  return conversations
    .filter((c) => c.participants.includes(userId))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export const getMessagesByConversation = (conversationId) => {
  const messages = load(MESSAGES_KEY)
  return messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
}

export const createMessage = ({
  projectId,
  senderId,
  receiverId,
  message,
  attachments = [],
}) => {
  const now = new Date().toISOString()
  const allConversations = load(CONVERSATIONS_KEY)

  let conversation =
    allConversations.find(
      (c) =>
        c.projectId === projectId &&
        c.participants.includes(senderId) &&
        c.participants.includes(receiverId),
    ) || null

  if (!conversation) {
    conversation = createConversationModel({
      id: generateId(),
      projectId,
      participants: [senderId, receiverId],
      lastMessage: null,
      updatedAt: now,
    })
    allConversations.push(conversation)
  }

  const messageId = generateId()
  const newMessage = createMessageModel({
    id: messageId,
    conversationId: conversation.id,
    projectId,
    senderId,
    receiverId,
    message,
    attachments,
    timestamp: now,
    readStatus: 'sent',
  })

  const allMessages = load(MESSAGES_KEY)
  allMessages.push(newMessage)

  const updatedConversation = {
    ...conversation,
    lastMessage: {
      message,
      senderId,
      timestamp: now,
      readStatus: 'sent',
    },
    updatedAt: now,
  }

  const updatedConversations = allConversations.map((c) =>
    c.id === updatedConversation.id ? updatedConversation : c,
  )

  save(MESSAGES_KEY, allMessages)
  save(CONVERSATIONS_KEY, updatedConversations)

  return newMessage
}

export const markMessageRead = (messageId, userId) => {
  const messages = load(MESSAGES_KEY)
  const conversations = load(CONVERSATIONS_KEY)

  const idx = messages.findIndex((m) => m.id === messageId)
  if (idx === -1) return null

  const updatedMessage = { ...messages[idx] }
  if (updatedMessage.receiverId === userId) {
    updatedMessage.readStatus = 'read'
  }
  messages[idx] = updatedMessage

  const convIdx = conversations.findIndex((c) => c.id === updatedMessage.conversationId)
  if (convIdx !== -1 && conversations[convIdx].lastMessage) {
    conversations[convIdx] = {
      ...conversations[convIdx],
      lastMessage: {
        ...conversations[convIdx].lastMessage,
        readStatus:
          updatedMessage.receiverId === userId
            ? updatedMessage.readStatus
            : conversations[convIdx].lastMessage.readStatus,
      },
    }
  }

  save(MESSAGES_KEY, messages)
  save(CONVERSATIONS_KEY, conversations)

  return updatedMessage
}

