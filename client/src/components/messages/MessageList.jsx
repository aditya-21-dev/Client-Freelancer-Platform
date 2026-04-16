import MessageBubble from './MessageBubble'

const MessageList = ({ messages, currentUserId, bottomRef }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="space-y-3">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

export default MessageList
