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
      {/* Top Bar with Hamburger Menu (Mobile Only) */}
      <div className="lg:hidden sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
        <HamburgerMenu 
          isOpen={leftSidebarOpen}
          onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        />
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          AnimoForums
        </h1>
      </div>

      {/* Main Content Area with Sidebars */}
      <div className="flex flex-1 relative">
        {/* LEFT Sidebar */}
        <aside
          className={cn(
            // Desktop (≥ lg): Normal sidebar, always visible
            'lg:block lg:relative lg:translate-x-0 lg:w-64',
            // Mobile (< lg): Fixed overlay
            'fixed inset-y-0 left-0 z-40 lg:z-auto w-64',
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
          {/* Content Area */}
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">{children}</div>
          </main>

          {/* RIGHT Sidebar - Desktop only */}
          {showRightSidebar && (
            <aside className="hidden xl:block w-80 shrink-0 sticky top-20 h-fit">
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
