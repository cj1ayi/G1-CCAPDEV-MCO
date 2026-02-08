import { ReactNode } from 'react'
import { Footer } from './Footer'
import { cn } from '@/lib/utils'
import { Header } from './Header'
import { useDarkMode } from '@/hooks/useDarkMode'

interface HomeLayoutProps {   
  children: ReactNode
}

export const HomeLayout = ({   
  children,
}: HomeLayoutProps) => {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-background-light",
      "dark:bg-background-dark"
    )}>
      {/* Header */}
      <Header 
        variant="landing"
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}