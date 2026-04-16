// Frontend message model shape for future backend integration
export const createMessageModel = ({
  id,
  conversationId,
  projectId,
  senderId,
  receiverId,
  message,
  attachments = [],
  timestamp,
  readStatus = 'sent',
}) => ({
  id,
  conversationId,
  projectId,
  senderId,
  receiverId,
  message,
  attachments,
  timestamp,
  readStatus,
})

