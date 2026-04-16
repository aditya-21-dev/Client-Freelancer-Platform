const ConversationList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
}) => {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-600">Recent conversations</p>
      </div>

      <div className="space-y-2 p-3 sm:p-4">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-blue-700 bg-brand-primary text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{conversation.name}</p>
                  <p
                    className={`mt-1 truncate text-xs ${isActive ? 'text-blue-100' : 'text-gray-600'}`}
                  >
                    {conversation.lastMessage}
                  </p>
                </div>
                <span className={`shrink-0 text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                  {conversation.time}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ConversationList
