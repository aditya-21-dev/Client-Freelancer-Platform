const EmptyChatState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-blue-700 bg-brand-primary text-white">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <path
            d="M7 10H17M7 14H13M21 12C21 16.4183 16.9706 20 12 20C10.0418 20 8.22958 19.4403 6.75 18.4884L3 19.5L4.06066 16.318C3.38903 15.0887 3 13.5992 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900">No conversation selected</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-600">
        Choose a conversation from the left panel to review project updates and continue messaging.
      </p>
    </div>
  )
}

export default EmptyChatState
