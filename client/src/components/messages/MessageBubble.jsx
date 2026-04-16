const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[90%] rounded-xl px-4 py-2.5 text-sm sm:max-w-[82%] md:max-w-xl ${
          isOwn
            ? 'bg-brand-primary text-white shadow-sm'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
        <p className="mt-1 text-xs text-gray-500">
          {message.timestamp}
        </p>
      </div>
    </div>
  )
}

export default MessageBubble
