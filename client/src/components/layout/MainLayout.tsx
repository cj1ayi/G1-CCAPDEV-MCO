import { ReactNode, useState } from 'react'
import { Footer } from './Footer'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar, RightSidebarProps } from './RightSidebar'
import { cn } from '@/lib/utils'
import { Header } from './Header'
import { useDarkMode } from '@/hooks/useDarkMode'

interface MainLayoutProps {
  children: ReactNode
  rightSidebarVariant?: RightSidebarProps['variant']
  spaceInfo?: RightSidebarProps['spaceInfo']
  showRightSidebar?: boolean
}

export const MainLayout = ({
  children,
  rightSidebarVariant = 'home',
  spaceInfo,
  showRightSidebar = true,
}: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const myDefaultUser = { name: 'Diane Panganiban' }
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-background-light",
      "dark:bg-background-dark"
      )}
    >
      {/* Header */}
      <Header 
        user={myDefaultUser}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main container */}
      <div className="flex flex-1">
        {/* Desktop Left Sidebar */}
        <aside className={cn(
          'hidden xl:flex xl:flex-col xl:w-64',
          'xl:border-r xl:border-border-light xl:dark:border-border-dark',
          'xl:sticky xl:top-16 xl:h-[calc(100vh-4rem)]',
          'xl:overflow-y-auto'
        )}>
          <LeftSidebar />
        </aside>

        {/* Mobile Sidebar Overlay - FIXED: Start below header */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop - below header */}
            <div
              className={cn(
                "xl:hidden fixed top-16 left-0 right-0 bottom-0",
                "bg-black/50 z-40"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Sidebar - below header */}
            <aside className={cn(
              'xl:hidden fixed top-16 left-0 bottom-0 z-50',
              'w-64 overflow-y-auto',
              'bg-surface-light dark:bg-surface-dark',
              'border-r border-border-light dark:border-border-dark'
            )}>
              <LeftSidebar />
            </aside>
          </>
        )}

        {/* Main Content + Right Sidebar */}
        <div className="flex flex-1 min-w-0">
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>

          {/* Right Sidebar */}
          {showRightSidebar && (
            <aside 
              className="hidden xl:block w-80 shrink-0 sticky top-20 h-fit"
            >
              <div className="p-4">
                <RightSidebar variant={rightSidebarVariant} spaceInfo={spaceInfo} />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
