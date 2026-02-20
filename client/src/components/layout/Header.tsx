import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Bell, MessageSquare, Menu, X, Moon, Sun, PanelLeftClose, PanelLeft } from 'lucide-react'
import { Button, Avatar } from '@/components/ui'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'

import AnimoForumsLogoHat from '@/assets/logo/AnimoForumsLogoHat.svg'

interface HeaderProps {
  variant?: 'default' | 'landing'
  user?: {
    name: string
    avatarUrl?: string
    id: number
  }
  onSearch?: (query: string) => void
  onCreatePost?: () => void
  notifCount?: number
  messageCount?: number
  isMobileMenuOpen?: boolean
  onToggleMobileMenu?: () => void
  
  // Desktop sidebar collapse
  isDesktopSidebarCollapsed?: boolean
  onToggleDesktopSidebar?: () => void
  
  // Dark mode
  isDark?: boolean
  onToggleDarkMode?: () => void
}

export const Header = ({ 
  variant = 'default',
  user, 
  onSearch, 
  onCreatePost,
  notifCount = 0,
  messageCount = 0,
  isMobileMenuOpen = false,
  onToggleMobileMenu,
  isDesktopSidebarCollapsed = false,
  onToggleDesktopSidebar,
  isDark = false,
  onToggleDarkMode
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch?.(searchQuery)
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost()
    } else {
      navigate('/post/create')
    }
  }

  return (
    <header className={cn(
      'sticky top-0 z-50 h-16 px-4 lg:px-6',
      'flex items-center justify-between gap-4',
      'bg-surface-light dark:bg-surface-dark',
      'border-b border-border-light dark:border-border-dark'
    )}>
      {/* Left: Hamburger + Logo + Desktop Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle - Only show if not landing page */}
        {variant !== 'landing' && onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className={cn(
              'xl:hidden p-2 rounded-lg',
              'hover:bg-gray-100 dark:hover:bg-surface-darker',
              'transition-colors'
            )}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        )}

        {/* Desktop Sidebar Toggle - Only show if not landing page */}
        {variant !== 'landing' && onToggleDesktopSidebar && (
          <button
            onClick={onToggleDesktopSidebar}
            className={cn(
              'hidden xl:flex p-2 rounded-lg',
              'hover:bg-gray-100 dark:hover:bg-surface-darker',
              'transition-colors',
              'tooltip-container'
            )}
            aria-label={isDesktopSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            title={isDesktopSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {isDesktopSidebarCollapsed ? (
              <PanelLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <PanelLeftClose className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        )}

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={AnimoForumsLogoHat} alt="AnimoForums" className="h-9 w-9" />
          <span className="hidden sm:block text-xl font-black text-primary">
            AnimoForums
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      {variant !== 'landing' && (
        <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search AnimoForums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full h-10 pl-10 pr-4 rounded-full',
              'bg-gray-100 dark:bg-surface-input',
              'border border-border-light dark:border-border-dark',
              'focus:border-primary focus:bg-white dark:focus:bg-surface-dark',
              'outline-none focus:ring-2 focus:ring-primary/20',
              'text-sm text-gray-900 dark:text-white',
              'placeholder:text-gray-500 dark:placeholder:text-gray-400',
              'transition-all'
            )}
          />
        </form>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Dark Mode Toggle - Always visible */}
        {onToggleDarkMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="hover:bg-gray-100 dark:hover:bg-surface-darker h-10 w-10 p-0"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </Button>
        )}

        {variant === 'landing' ? (
          // Landing page: Always show login/signup
          <>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Join Community
              </Button>
            </Link>
          </>
        ) : (
          // Default variant: Show user actions or login/signup
          <>
            {user ? (
              <>
                {/* Create Post Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCreatePost}
                  className="hover:bg-gray-100 dark:hover:bg-surface-darker h-10 w-10 p-0"
                >
                  <Plus className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-gray-100 dark:hover:bg-surface-darker h-10 w-10 p-0"
                >
                  <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  {notifCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </Button>

                {/* Messages */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-gray-100 dark:hover:bg-surface-darker h-10 w-10 p-0"
                >
                  <MessageSquare className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  {messageCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </Button>

                {/* User Avatar/Menu */}
                <Link to={`/profile/${user.id}`} className="ml-2">
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    fallback={user.name.charAt(0).toUpperCase()}
                    size="sm"
                    className="hover:ring-2 hover:ring-primary/50 transition-all"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Join Community
                  </Button>
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </header>
  )
}
