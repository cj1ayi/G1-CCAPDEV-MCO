import { ReactNode, useState } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface MainLayoutProps {
  headerVariant?: 'default' | 'landing'
  leftSidebar?: ReactNode
  rightSidebar?: ReactNode
  children: ReactNode
  maxWidth?: string
}

export const MainLayout = ({
  headerVariant = 'default',
  leftSidebar,
  rightSidebar,
  children,
  maxWidth = "max-w-4xl"
}: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('sidebar_collapsed')
    return saved === 'true'
  })
  
  const { isDark, toggleDarkMode } = useDarkMode()
  const { user } = useAuth()

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarCollapsed(prev => {
      const newValue = !prev
      localStorage.setItem('sidebar_collapsed', String(newValue))
      return newValue
    })
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      "bg-background-light dark:bg-background-dark"
    )}>
      <Header
        variant={headerVariant}
        user={ headerVariant === 'landing' ? undefined: user
        ? { name: user.name, id: Number(user.id), avatarUrl: user.avatar }
        : undefined
        }
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        // Pass desktop collapse state
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktopSidebar={toggleDesktopSidebar}
      />

      <div className="flex flex-1 w-full relative">
        {/* Left Sidebar Slot */}
        {leftSidebar && (
          <>
            {/* Desktop Sidebar - Fully Closeable */}
            {!isDesktopSidebarCollapsed && (
              <aside className={cn(
                "hidden xl:block w-64 sticky top-16 h-[calc(100vh-4rem)]",
                "overflow-y-auto border-r dark:border-gray-800",
                "pt-4"
              )}>
                {typeof leftSidebar === 'function' 
                  ? leftSidebar({ isCollapsed: false })
                  : leftSidebar
                }
              </aside>
            )}

            {/* Mobile Sidebar - Full drawer */}
            {isMobileMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/50 z-40 xl:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Sidebar Drawer */}
                <aside className={cn(
                  "fixed left-0 top-16 bottom-0 w-64 z-50 xl:hidden",
                  "bg-surface-light dark:bg-surface-dark border-r",
                  "dark:border-gray-800 overflow-y-auto",
                  "pt-4"
                )}>
                  {typeof leftSidebar === 'function' 
                    ? leftSidebar({ isCollapsed: false })
                    : leftSidebar
                  }
                </aside>
              </>
            )}
          </>
        )}

        {/* Main Content Slot */}
        <main className="flex-1 p-4 md:p-6 min-w-0">
          <div className={cn("mx-auto", maxWidth)}>
            {children}
          </div>
        </main>

        {/* Right Sidebar Slot */}
        {rightSidebar && (
          <aside className="hidden xl:block w-80 sticky top-16 h-fit p-4">
            {rightSidebar}
          </aside>
        )}
      </div>

      <Footer />
    </div>
  )
}
