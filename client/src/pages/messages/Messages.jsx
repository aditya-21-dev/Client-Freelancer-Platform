import { useContext, useEffect, useMemo, useState } from 'react'
import Chat from './Chat'
import { AuthContext } from '../../context/AuthContext'
import { getJson } from '../../utils/api'

const Messages = () => {
  const { user, isInitializing } = useContext(AuthContext)
  const currentUserId = user?.id || user?._id || ''

  const [users, setUsers] = useState([])
  const [receiverId, setReceiverId] = useState('')
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState('')

  useEffect(() => {
    if (!currentUserId) return

    let isActive = true

    const fetchUsers = async () => {
      setIsLoadingUsers(true)
      setUsersError('')

      try {
        const fetchedUsers = await getJson('/api/users')
        if (!isActive) return

        const safeUsers = Array.isArray(fetchedUsers) ? fetchedUsers : []
        setUsers(safeUsers)

        if (safeUsers.length > 0) {
          setReceiverId((previous) => {
            if (previous && safeUsers.some((item) => item._id === previous)) {
              return previous
            }
            return safeUsers[0]._id
          })
        } else {
          setReceiverId('')
        }
      } catch (error) {
        if (!isActive) return
        setUsersError(error?.message || 'Failed to load users')
      } finally {
        if (isActive) {
          setIsLoadingUsers(false)
        }
      }
    }

    fetchUsers()

    return () => {
      isActive = false
    }
  }, [currentUserId])

  const conversationId = useMemo(() => {
    if (!currentUserId || !receiverId) return ''
    return [currentUserId, receiverId].sort().join('*')
  }, [currentUserId, receiverId])

  if (isInitializing || !user) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center rounded-2xl border border-brand-border bg-brand-background text-brand-text">
        Loading user session...
      </div>
    )
  }

  return (
    <section className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-2xl border border-brand-border bg-brand-background text-brand-text">
      <aside className="flex min-h-0 w-[320px] flex-shrink-0 flex-col border-r border-brand-border bg-brand-background px-4 py-5">
        <h2 className="mb-4 text-lg font-semibold text-brand-text">Users</h2>

        {isLoadingUsers ? <p className="text-sm text-brand-subtext">Loading users...</p> : null}

        {!isLoadingUsers && usersError ? (
          <p className="text-sm text-brand-subtext">{usersError}</p>
        ) : null}

        {!isLoadingUsers && !usersError && users.length === 0 ? (
          <p className="text-sm text-brand-subtext">No users available to chat.</p>
        ) : null}

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {users.map((listUser) => {
            const isActive = receiverId === listUser._id

            return (
              <button
                key={listUser._id}
                type="button"
                onClick={() => setReceiverId(listUser._id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-brand-border bg-brand-primary text-white'
                    : 'border-brand-border bg-brand-background text-brand-text hover:bg-brand-messageReceived'
                }`}
              >
                <p className="truncate text-sm font-semibold">{listUser.name}</p>
                <p className={`truncate text-xs ${isActive ? 'text-white' : 'text-brand-subtext'}`}>
                  {listUser.email}
                </p>
              </button>
            )
          })}
        </div>
      </aside>

      <main className="flex-1 min-w-0 bg-brand-background p-4">
        {receiverId && conversationId ? (
          <Chat conversationId={conversationId} receiverId={receiverId} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-brand-border bg-brand-background px-6 text-sm text-brand-subtext">
            Start conversation
          </div>
        )}
      </main>
    </section>
  )
}

export default Messages
