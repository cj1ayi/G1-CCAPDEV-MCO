import { ReactNode, useState } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface MainLayoutProps {
  headerVariant?: 'default' | 'landing'
  leftSidebar?: ReactNode | ((props: { isCollapsed: boolean }) => ReactNode)
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
    const saved = localStorage.getItem('sidebar_collapsed')
    return saved === 'true'
  })
  
  const { isDark, toggleDarkMode } = useDarkMode()
  const { user, logout, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

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
        user={isLoading ? undefined : user
          ? { 
              name: user.name, 
              id: Number(user.id), 
              avatarUrl: user.avatar,
              username: user.username 
            }
          : undefined
        }
        isLoading={isLoading}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktopSidebar={toggleDesktopSidebar}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 w-full relative">
        {leftSidebar && (
          <>
            {!isDesktopSidebarCollapsed && (
              <aside className={cn(
                "hidden xl:block w-64 sticky top-16 h-[calc(100vh-4rem)]",
                "overflow-y-auto border-r dark:border-gray-800 pt-4"
              )}>
                {typeof leftSidebar === 'function' 
                  ? leftSidebar({ isCollapsed: false })
                  : leftSidebar
                }
              </aside>
            )}
            {isMobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-40 xl:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <aside className={cn(
                  "fixed left-0 top-16 bottom-0 w-64 z-50 xl:hidden",
                  "bg-surface-light dark:bg-surface-dark border-r",
                  "dark:border-gray-800 overflow-y-auto pt-4"
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
        <main className="flex-1 p-4 md:p-6 min-w-0">
          <div className={cn("mx-auto", maxWidth)}>
            {children}
          </div>
        </main>
        {rightSidebar && (
          <aside className="hidden xl:block w-80 sticky top-16 h-fit p-4">
            {rightSidebar}
          </aside>
        )}
      </div>
      {headerVariant === 'landing' && <Footer />}
    </div>
  )
}
