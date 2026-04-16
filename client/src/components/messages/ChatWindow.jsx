import { useEffect, useMemo, useRef } from 'react'
import ChatHeader from './ChatHeader'
import EmptyChatState from './EmptyChatState'
import MessageComposer from './MessageComposer'
import MessageList from './MessageList'

const ChatWindow = ({
  conversation,
  messages,
  currentUserId,
  messageInput,
  onInputChange,
  onSendMessage,
  isMobile,
  onBack,
}) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, conversation?.id])

  const canSend = useMemo(() => Boolean(conversation), [conversation])

  if (!conversation) {
    return <EmptyChatState />
  }

  return (
    <div className="flex h-full min-w-0 flex-col bg-white">
      <ChatHeader conversation={conversation} isMobile={isMobile} onBack={onBack} />
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        bottomRef={bottomRef}
      />
      <MessageComposer
        value={messageInput}
        onChange={onInputChange}
        onSend={canSend ? onSendMessage : () => {}}
      />
    </div>
  )
}

export default ChatWindow
