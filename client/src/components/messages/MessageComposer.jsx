const MessageComposer = ({ value, onChange, onSend }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSend()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200"
          aria-label="Attach file"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
              d="M21.44 11.05L12.25 20.24C10.79 21.7 8.42 21.7 6.95 20.24C5.49 18.78 5.49 16.4 6.95 14.94L15.43 6.46C16.4 5.49 17.98 5.49 18.95 6.46C19.92 7.43 19.92 9.01 18.95 9.98L11.17 17.76C10.69 18.24 9.9 18.24 9.41 17.76C8.93 17.27 8.93 16.48 9.41 16L16.48 8.93"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Type your message"
          className="h-11 w-full flex-1 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={!value.trim()}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          Send
        </button>
      </div>
    </form>
  )
}

export default MessageComposer
