import { ReactNode, useState } from 'react'
import { Footer } from './Footer'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar, RightSidebarProps } from './RightSidebar'
import { HamburgerMenu } from './HamburgerMenu'
import { cn } from '@/lib/utils'

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
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Floating Hamburger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <HamburgerMenu 
          isOpen={leftSidebarOpen}
          onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        />
      </div>

      <div className="flex flex-1 relative">
        {/* LEFT Sidebar */}
        <aside
          className={cn(
            'lg:block lg:relative lg:translate-x-0 lg:w-64 lg:pt-0',
            'fixed inset-y-0 left-0 z-40 w-64',
            'pt-16', 
            'bg-white dark:bg-gray-900',
            'transition-transform duration-300 ease-out',
            'overflow-y-auto',
            leftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <LeftSidebar />
        </aside>

        {/* Backdrop - Mobile only */}
        {leftSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            onClick={() => setLeftSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content Wrapper */}
        <div className="flex flex-1 min-w-0">
          <main className="flex-1 p-4 md:p-6">
            {/* Add top margin on mobile so content doesn't hide behind hamburger if sidebar is closed */}
            <div className="max-w-4xl mx-auto mt-12 lg:mt-0">{children}</div>
          </main>

          {/* RIGHT Sidebar */}
          {showRightSidebar && (
            <aside className="hidden xl:block w-80 shrink-0 sticky top-20 h-fit">
              <div className="p-4">
                <RightSidebar variant={rightSidebarVariant} spaceInfo={spaceInfo} />
              </div>
            </aside>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
