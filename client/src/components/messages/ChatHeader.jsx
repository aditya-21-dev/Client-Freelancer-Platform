const ChatHeader = ({ conversation, isMobile, onBack }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
            aria-label="Back to conversations"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div>
          <h2 className="text-base font-semibold text-gray-900">{conversation.name}</h2>
          <p className="text-sm text-gray-600">{conversation.status === 'online' ? 'Online' : 'Offline'}</p>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
        aria-label="More options"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 7V7.01M12 12V12.01M12 17V17.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default ChatHeader
