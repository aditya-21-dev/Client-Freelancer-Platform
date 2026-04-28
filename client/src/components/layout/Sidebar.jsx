import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'

const Sidebar = () => {
  const { user } = useContext(AuthContext)
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar()

  const clientMenuItems = [
    {
      path: '/client/dashboard',
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    { path: '/client/post-job', label: 'Post Job', icon: 'M12 4v16m8-8H4' },
    {
      path: '/client/my-jobs',
      label: 'My Jobs',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
      path: '/client/proposals',
      label: 'Proposals',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
    {
      path: '/client/projects',
      label: 'Projects',
      icon: 'M3 7a2 2 0 012-2h3.5a1 1 0 01.8.4l1.4 1.8a1 1 0 00.8.4H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
    },
    {
      path: '/client/transactions',
      label: 'Transactions',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    },
    {
      path: '/messages',
      label: 'Messages',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    },
    {
      path: '/client/profile',
      label: 'Profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
  ]

  const freelancerMenuItems = [
    {
      path: '/freelancer/dashboard',
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      path: '/freelancer/browse-jobs',
      label: 'Browse Jobs',
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    },
    {
      path: '/freelancer/my-proposals',
      label: 'My Proposals',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
    {
      path: '/freelancer/active-projects',
      label: 'Active Projects',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    },
    {
      path: '/freelancer/earnings',
      label: 'Earnings',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      path: '/messages',
      label: 'Messages',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    },
    {
      path: '/freelancer/profile',
      label: 'Profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
  ]

  const menuItems = user?.role === 'client' ? clientMenuItems : freelancerMenuItems
  const desktopWidthClass = isCollapsed ? 'md:w-24' : 'md:w-72'

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        className="fixed bottom-4 left-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-border bg-brand-primary text-white shadow-md transition md:hidden"
        aria-label={isMobileOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isMobileOpen ? (
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-brand-background/80 md:hidden"
          aria-label="Close sidebar overlay"
        />
      ) : null}

      <div className={`hidden ${desktopWidthClass} md:block`} aria-hidden="true" />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-brand-border bg-brand-background text-brand-text transition-transform duration-300 ease-in-out md:top-16 md:z-30 md:h-[calc(100vh-4rem)] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${desktopWidthClass} md:translate-x-0`}
      >
        <div className="border-b border-brand-border p-5">
          <div className={`flex items-center ${isCollapsed ? 'md:justify-center' : 'justify-between'}`}>
            {!isCollapsed ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-brand-subtext">Workspace</p>
                <h2 className="text-lg font-semibold capitalize text-brand-text">{user?.role || 'User'} Panel</h2>
              </div>
            ) : (
              <h2 className="text-sm font-semibold text-brand-text">Menu</h2>
            )}

            <button
              type="button"
              onClick={closeMobileSidebar}
              className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-brand-border bg-brand-background text-brand-text transition hover:bg-brand-messageReceived md:hidden"
              aria-label="Close sidebar"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'border-brand-border bg-brand-primary text-white shadow-md'
                        : 'border-brand-border bg-brand-background text-brand-subtext hover:bg-brand-messageSent hover:text-brand-text'
                    } ${isCollapsed ? 'md:justify-center md:px-2' : ''}`
                  }
                >
                  <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} />
                  </svg>
                  {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
