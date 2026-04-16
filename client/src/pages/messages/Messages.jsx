import { useMemo, useState } from 'react'
import ChatWindow from '../../components/messages/ChatWindow'
import ConversationList from '../../components/messages/ConversationList'

const CURRENT_USER_ID = 'user-0'

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    name: 'Sarah Williams',
    status: 'online',
    time: '10:42 AM',
    lastMessage: 'Please share the first wireframe tonight.',
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        text: 'Hi, I reviewed your proposal and it looks strong.',
        timestamp: '9:46 AM',
      },
      {
        id: 'msg-2',
        senderId: CURRENT_USER_ID,
        text: 'Thanks Sarah. I can start with dashboard wireframes today.',
        timestamp: '9:49 AM',
      },
      {
        id: 'msg-3',
        senderId: 'user-1',
        text: 'Perfect. Please share the first wireframe tonight.',
        timestamp: '10:42 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    name: 'Michael Chen',
    status: 'online',
    time: 'Yesterday',
    lastMessage: 'Looks good. Let us lock the milestone.',
    messages: [
      {
        id: 'msg-4',
        senderId: CURRENT_USER_ID,
        text: 'I pushed the landing page polish and mobile tweaks.',
        timestamp: '7:02 PM',
      },
      {
        id: 'msg-5',
        senderId: 'user-2',
        text: 'Looks good. Let us lock the milestone.',
        timestamp: '7:12 PM',
      },
    ],
  },
  {
    id: 'conv-3',
    name: 'Olivia Martinez',
    status: 'offline',
    time: 'Mon',
    lastMessage: 'Can we discuss final QA checklist?',
    messages: [
      {
        id: 'msg-6',
        senderId: 'user-3',
        text: 'Can we discuss final QA checklist before deployment?',
        timestamp: '4:35 PM',
      },
      {
        id: 'msg-7',
        senderId: CURRENT_USER_ID,
        text: 'Yes, I am available after 6 PM and can walk through each point.',
        timestamp: '4:39 PM',
      },
    ],
  },
  {
    id: 'conv-4',
    name: 'David Anderson',
    status: 'online',
    time: 'Sun',
    lastMessage: 'Payment released for phase one. Great work.',
    messages: [
      {
        id: 'msg-8',
        senderId: 'user-4',
        text: 'Payment released for phase one. Great work.',
        timestamp: '11:08 AM',
      },
      {
        id: 'msg-9',
        senderId: CURRENT_USER_ID,
        text: 'Thank you. I will begin planning phase two now.',
        timestamp: '11:12 AM',
      },
    ],
  },
]

const getCurrentTimeLabel = () => {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const Messages = () => {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [activeConversationId, setActiveConversationId] = useState(
    INITIAL_CONVERSATIONS[0]?.id ?? null,
  )
  const [messageInput, setMessageInput] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)

  const activeConversation = useMemo(() => {
    return conversations.find((conversation) => conversation.id === activeConversationId) ?? null
  }, [conversations, activeConversationId])

  const activeMessages = activeConversation?.messages ?? []

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId)
    setShowMobileChat(true)
  }

  const handleBackToList = () => {
    setShowMobileChat(false)
  }

  const handleSendMessage = () => {
    const trimmedMessage = messageInput.trim()
    if (!trimmedMessage || !activeConversation) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      text: trimmedMessage,
      timestamp: getCurrentTimeLabel(),
    }

    setConversations((previousConversations) =>
      previousConversations.map((conversation) => {
        if (conversation.id !== activeConversation.id) return conversation

        return {
          ...conversation,
          time: newMessage.timestamp,
          lastMessage: newMessage.text,
          messages: [...conversation.messages, newMessage],
        }
      }),
    )

    setMessageInput('')
  }

  return (
    <section className="h-full min-h-[calc(100vh-8rem)] w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-md">
      <div className="grid h-full grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside
          className={`min-w-0 border-r border-gray-200 bg-white ${
            showMobileChat ? 'hidden md:block' : 'block'
          }`}
        >
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </aside>

        <main className={`${showMobileChat ? 'block' : 'hidden md:block'} min-w-0 h-full bg-white`}>
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            currentUserId={CURRENT_USER_ID}
            messageInput={messageInput}
            onInputChange={setMessageInput}
            onSendMessage={handleSendMessage}
            isMobile={showMobileChat}
            onBack={handleBackToList}
          />
        </main>
      </div>
    </section>
  )
}

export default Messages
