import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from '../../context/AuthContext'
import { getJson } from '../../utils/api'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const getMessageId = (message) => {
  if (!message) return null

  if (message._id || message.id) {
    return message._id || message.id
  }

  const senderKey =
    typeof message.sender === 'string'
      ? message.sender
      : message.sender?._id || message.sender?.id || 'unknown'

  return `${senderKey}-${message.createdAt ?? ''}-${message.text ?? ''}`
}

const getSenderId = (sender) => {
  if (!sender) return ''
  if (typeof sender === 'string') return sender
  return sender._id || sender.id || ''
}

const sortByCreatedAt = (items) =>
  [...items].sort(
    (a, b) =>
      new Date(a.createdAt || 0).getTime() -
      new Date(b.createdAt || 0).getTime(),
  )

const mergeUniqueMessages = (existing, incoming) => {
  const map = new Map()

  existing.forEach((message) => {
    map.set(getMessageId(message), message)
  })

  incoming.forEach((message) => {
    map.set(getMessageId(message), message)
  })

  return sortByCreatedAt(Array.from(map.values()))
}

const formatTime = (createdAt) => {
  if (!createdAt) return ''

  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const Chat = ({ conversationId, receiverId }) => {
  const { user } = useContext(AuthContext)
  const currentUserId = useMemo(() => user?._id || user?.id || '', [user])

  const socketRef = useRef(null)
  const activeConversationRef = useRef(conversationId || '')
  const endRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    activeConversationRef.current = conversationId || ''

    const socket = socketRef.current
    if (socket && socket.connected && conversationId) {
      socket.emit('joinRoom', conversationId)
    }
  }, [conversationId])

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      setIsLoading(false)
      setError('')
      return
    }

    let active = true

    const fetchMessages = async () => {
      try {
        setIsLoading(true)
        setError('')

        const data = await getJson(`/api/messages/${encodeURIComponent(conversationId)}`)
        if (!active) return

        setMessages(sortByCreatedAt(Array.isArray(data) ? data : []))
      } catch (fetchError) {
        if (!active) return
        setError(fetchError?.message || 'Failed to load messages')
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    fetchMessages()

    return () => {
      active = false
    }
  }, [conversationId])

  useEffect(() => {
    if (socketRef.current) return

    const socket = io(SOCKET_URL, { withCredentials: true })
    socketRef.current = socket

    const handleConnect = () => {
      const activeConversationId = activeConversationRef.current
      if (activeConversationId) {
        socket.emit('joinRoom', activeConversationId)
      }
    }

    const handleReceiveMessage = (message) => {
      const activeConversationId = activeConversationRef.current
      if (!message || message.conversationId !== activeConversationId) return

      setMessages((previous) => mergeUniqueMessages(previous, [message]))
    }

    const handleMessageError = (socketError) => {
      setError(socketError?.message || 'Message failed')
    }

    socket.on('connect', handleConnect)
    socket.on('receiveMessage', handleReceiveMessage)
    socket.on('messageError', handleMessageError)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('receiveMessage', handleReceiveMessage)
      socket.off('messageError', handleMessageError)
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const handleSend = (event) => {
    event.preventDefault()

    const text = draft.trim()
    if (!text || !conversationId || !receiverId || !currentUserId) return

    setError('')

    socketRef.current?.emit('sendMessage', {
      senderId: currentUserId,
      receiverId,
      conversationId,
      text,
    })

    setDraft('')
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-background text-brand-text">
      <header className="border-b border-brand-border px-5 py-4">
        <h2 className="text-lg font-semibold text-brand-text">Conversation</h2>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <p className="text-sm text-brand-subtext">Loading messages...</p>
        ) : null}

        {!isLoading && error ? (
          <p className="text-sm text-brand-subtext">{error}</p>
        ) : null}

        {!isLoading && !error && messages.length === 0 ? (
          <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-brand-subtext">
            Start conversation
          </div>
        ) : null}

        {!isLoading && !error && messages.length > 0 ? (
          <div className="space-y-3 pb-2">
            {messages.map((message) => {
              const isMine = getSenderId(message.sender) === currentUserId

              return (
                <div
                  key={getMessageId(message)}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <article
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-brand-text ${
                      isMine
                        ? 'bg-brand-messageSent text-right'
                        : message.type === 'revision'
                          ? 'bg-yellow-50 text-left'
                          : 'bg-brand-messageReceived text-left'
                    }`}
                  >
                    {message.type === 'revision' ? (
                      <p className="mb-1 text-xs font-bold text-yellow-500">🔁 Revision Requested</p>
                    ) : null}
                    <p className="whitespace-pre-wrap break-words text-sm text-brand-text">
                      {message.text}
                    </p>
                    <p className="mt-1 text-xs text-brand-subtext">{formatTime(message.createdAt)}</p>
                  </article>
                </div>
              )
            })}
          </div>
        ) : null}

        <div ref={endRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="sticky bottom-0 border-t border-brand-border bg-brand-background px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message..."
            className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-2 text-sm text-brand-text outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            className="rounded-2xl bg-brand-primary px-5 py-2 text-sm font-semibold text-white"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default Chat
