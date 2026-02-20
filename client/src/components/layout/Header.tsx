import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Bell, MessageSquare, Menu, X, Moon, Sun } from 'lucide-react'
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
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
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
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={AnimoForumsLogoHat} alt="AnimoForums" className="h-9 w-9" />
          <span className="hidden sm:block text-xl font-black text-primary">
            AnimoForums
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      { variant !== 'landing' && (
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
            className="!px-2"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}

        {variant !== 'landing' && user ? (
          <>
            {/* Create Post Button */}
            <Button variant="primary" size="sm" onClick={handleCreatePost} 
              leftIcon={<Plus className="h-4 w-4" />} className="hidden sm:inline-flex">
              Create
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreatePost} 
              className="sm:hidden !px-2">
              <Plus className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative !px-2">
              <Bell className="h-5 w-5" />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                  {notifCount > 99 ? '99+' : notifCount}
                </span>
              )}
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="sm" className="relative !px-2">
              <MessageSquare className="h-5 w-5" />
              {messageCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                  {messageCount > 99 ? '99+' : messageCount}
                </span>
              )}
            </Button>

            {/* User Avatar */}
            <Link to={`/profile/${user.username}`}className="ml-1">
              <Avatar src={user.avatarUrl} alt={user.name} 
                fallback={user.name.charAt(0).toUpperCase()} size="sm"
                className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all" />
            </Link>
          </>
        ) : (
          <>
            {/* Login/Signup */}
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
              Join Community
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
