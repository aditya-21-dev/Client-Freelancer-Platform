import { useState } from 'react'

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('')
  const [attachment, setAttachment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const attachments = attachment
      ? attachment
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean)
      : []
    onSend(text, attachments)
    setText('')
    setAttachment('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white px-4 py-3 space-y-2"
    >
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
      <input
        type="text"
        value={attachment}
        onChange={(e) => setAttachment(e.target.value)}
        placeholder="Attachment URLs (comma separated, optional)"
        className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </form>
  )
}

export default MessageInput

