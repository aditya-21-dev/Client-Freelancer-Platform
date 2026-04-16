// Frontend conversation model shape for future backend integration
export const createConversationModel = ({
  id,
  projectId,
  participants,
  lastMessage,
  updatedAt,
}) => ({
  id,
  projectId,
  participants, // [clientId, freelancerId]
  lastMessage, // { message, senderId, timestamp, readStatus }
  updatedAt,
})

