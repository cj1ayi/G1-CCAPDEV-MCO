import { ReactNode, useState } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  header?: ReactNode
  leftSidebar?: ReactNode
  rightSidebar?: ReactNode
  footer?: ReactNode
  children: ReactNode
  maxWidth?: string
}

export const MainLayout = ({
  header,
  leftSidebar,
  rightSidebar,
  footer,
  children,
  maxWidth = "max-w-4xl"
}: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {header || (
        <Header 
          user={{ name: 'Diane Panganiban' }} 
          isDark={isDark} 
          onToggleDarkMode={toggleDarkMode}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      )}

      <div className="flex flex-1 w-full max-w-[1440px] mx-auto relative">
        {/* Left Sidebar Slot */}
        {leftSidebar && (
          <aside className={cn(
            "hidden xl:block w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r dark:border-gray-800",
            isMobileMenuOpen && "block fixed inset-0 z-50 bg-white dark:bg-surface-dark w-64 pt-16"
          )}>
            {leftSidebar}
          </aside>
        )}

        {/* Main Content */}
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

      {footer || <Footer />}
    </div>
  )
}
