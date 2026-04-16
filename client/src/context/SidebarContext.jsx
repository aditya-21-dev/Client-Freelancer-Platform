import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const SidebarContext = createContext(null)

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      if (mobile) {
        setIsCollapsed(true)
        setIsMobileOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev)
      return
    }

    setIsCollapsed((prev) => !prev)
  }

  const closeMobileSidebar = () => {
    setIsMobileOpen(false)
  }

  const value = useMemo(
    () => ({
      isCollapsed,
      isMobile,
      isMobileOpen,
      toggleSidebar,
      closeMobileSidebar,
    }),
    [isCollapsed, isMobile, isMobileOpen],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }

  return context
}
