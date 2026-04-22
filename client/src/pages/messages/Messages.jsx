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
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center rounded-xl border border-brand-border bg-brand-background text-brand-text">
        Loading user session...
      </div>
    )
  }

  return (
    <section className="grid h-[calc(100vh-10rem)] grid-cols-1 overflow-hidden rounded-xl border border-brand-border bg-brand-background text-brand-text md:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-brand-border p-4 md:border-b-0 md:border-r">
        <h2 className="mb-4 text-lg font-semibold">Users</h2>

        {isLoadingUsers ? <p className="text-sm text-brand-subtext">Loading users...</p> : null}

        {!isLoadingUsers && usersError ? (
          <p className="text-sm text-red-600">{usersError}</p>
        ) : null}

        {!isLoadingUsers && !usersError && users.length === 0 ? (
          <p className="text-sm text-brand-subtext">No users available to chat.</p>
        ) : null}

        <div className="space-y-2">
          {users.map((listUser) => (
            <button
              key={listUser._id}
              type="button"
              onClick={() => setReceiverId(listUser._id)}
              className={`w-full rounded-lg border border-brand-border px-3 py-2 text-left transition ${
                receiverId === listUser._id
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-background hover:bg-slate-100'
              }`}
            >
              <p className="truncate text-sm font-semibold">{listUser.name}</p>
              <p className="truncate text-xs opacity-80">{listUser.email}</p>
            </button>
          ))}
        </div>
      </aside>

      <main className="min-h-0 min-w-0 p-4">
        {receiverId && conversationId ? (
          <Chat conversationId={conversationId} receiverId={receiverId} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-brand-border bg-brand-background p-6 text-sm text-brand-subtext">
            Select a user to start chatting.
          </div>
        )}
      </main>
    </section>
  )
}

export default Messages
