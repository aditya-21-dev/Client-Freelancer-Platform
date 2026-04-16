const MessageBubble = ({ message, isOwn }) => {
  const date = message.timestamp ? new Date(message.timestamp) : null
  const timeLabel = date
    ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : ''

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md px-3 py-2 rounded-2xl shadow-sm text-sm ${
          isOwn
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
        <div className="mt-1 flex items-center justify-end space-x-1 text-[10px]">
          <span className={isOwn ? 'text-blue-100' : 'text-gray-500'}>{timeLabel}</span>
          {isOwn && (
            <span className={message.readStatus === 'read' ? 'text-blue-100' : 'text-blue-200'}>
              {message.readStatus === 'read' ? 'Read' : 'Sent'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble

