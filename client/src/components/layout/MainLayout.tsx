import { ReactNode, useState } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/lib/utils'

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
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      "bg-background-light dark:bg-background-dark"
    )}>
      <Header
        variant={headerVariant}
        user={headerVariant === 'landing'
          ? undefined
          : { name: 'Diane Panganiban' }
        }
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex flex-1 w-full relative">
        {/* Left Sidebar Slot */}
        {leftSidebar && (
          <>
            {/* Desktop Sidebar */}
            <aside className={cn(
              "hidden xl:block w-64 sticky top-16 h-[calc(100vh-4rem)]",
              "overflow-y-auto border-r dark:border-gray-800"
            )}>
              {leftSidebar}
            </aside>

            {/* Mobile Sidebar */}
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
                  "dark:border-gray-800 overflow-y-auto"
                )}>
                  {leftSidebar}
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
