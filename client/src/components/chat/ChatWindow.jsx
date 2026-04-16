import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

const ChatWindow = ({ conversation, project, messages, currentUserId, onSendMessage }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        Select a conversation to start chatting.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">
          {project?.title || 'Project Conversation'}
        </h2>
        <p className="text-xs text-gray-500">Project-based chat between client and freelancer</p>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 space-y-2">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} isOwn={m.senderId === currentUserId} />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={onSendMessage} />
    </div>
  )
}

export default ChatWindow

