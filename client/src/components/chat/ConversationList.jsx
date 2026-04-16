const ConversationList = ({
  conversations,
  projectsById,
  currentUserId,
  selectedId,
  onSelect,
}) => {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        No conversations yet.
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((c) => {
        const project = projectsById[c.projectId]
        const last = c.lastMessage
        const isUnread =
          last &&
          last.senderId !== currentUserId &&
          last.readStatus &&
          last.readStatus !== 'read'

        const updatedDate = c.updatedAt ? new Date(c.updatedAt) : null
        const timeLabel = updatedDate
          ? updatedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : ''

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c)}
            className={`flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 ${
              selectedId === c.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {project?.title || 'Project'}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 truncate">
                {last?.message || 'No messages yet'}
              </p>
            </div>
            <div className="ml-3 flex flex-col items-end space-y-1">
              <span className="text-[10px] text-gray-400">{timeLabel}</span>
              {isUnread && (
                <span className="h-2 w-2 rounded-full bg-blue-600 inline-block" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default ConversationList

