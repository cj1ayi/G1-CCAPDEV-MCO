import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Bell, MessageSquare } from 'lucide-react'
import { Button, Avatar, Input } from '@/components/ui'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'

import AnimoForumsLogoHat from '@/assets/AnimoForumsLogoHat.svg'

interface HeaderProps {
  // User Section
  user?: {
    name: string
    avatarUrl?: string
  }

  // Search Functionality
  onSearch?: (query: string) => void

  // Create post action
  onCreatePost?: () => void

  // Notification counts (if any)
  notifCount?: number
  messageCount?: number
}

export const Header = ({ 
  user, 
  onSearch, 
  onCreatePost,
  notifCount = 0,
  messageCount = 0 
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch?.(searchQuery)
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Handle create post click
  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost()
    } else {
      navigate('/create-post')
    }
  }

  return (
    <header className={cn(
      'sticky top-0 z-50',
      'h-16 px-4 lg:px-6',
      'flex items-center justify-between gap-4',
      'bg-white dark:bg-surface-dark',
      'border-b border-gray-200 dark:border-gray-700'
    )}>
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <img 
          src={AnimoForumsLogoHat} 
          alt="AnimoForums" 
          className="h-9 w-9"
        />
        <span className={cn(
          'hidden sm:block',
          'text-xl font-black',
          'text-primary'
        )}>
          AnimoForums
        </span>
      </Link>

      {/* Search Bar */}
      <form 
        onSubmit={handleSearch}
        className="relative flex-1 max-w-xl"
      >
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search AnimoForums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full h-10 pl-10 pr-4 rounded-full',
              'bg-gray-100 dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'focus:border-primary focus:bg-white dark:focus:bg-gray-900',
              'outline-none ring-0 focus:ring-0',
              'text-sm text-gray-900 dark:text-white',
              'placeholder:text-gray-500 dark:placeholder:text-gray-400',
              'transition-all duration-200'
            )}
          />
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {user ? (
          <>
            {/* Create Post Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreatePost}
              leftIcon={<Plus className="h-4 w-4" />}
              className="hidden sm:inline-flex"
            >
              Create
            </Button>
            {/* Mobile create button (icon only) */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreatePost}
              className="sm:hidden !px-2"
              aria-label="Create post"
            >
              <Plus className="h-4 w-4" />
            </Button>

            {/* Notifications Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative !px-2"
              aria-label={`Notifications${notifCount > 0 ? ` (${notifCount} new)` : ''}`}
            >
              <Bell className="h-5 w-5" />
              {notifCount > 0 && (
                <span className={cn(
                  'absolute -top-0.5 -right-0.5',
                  'min-w-[18px] h-[18px] px-1',
                  'flex items-center justify-center',
                  'bg-red-500 text-white text-xs font-bold rounded-full'
                )}>
                  {notifCount > 99 ? '99+' : notifCount}
                </span>
              )}
            </Button>

            {/* Messages Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative !px-2"
              aria-label={`Messages${messageCount > 0 ? ` (${messageCount} new)` : ''}`}
            >
              <MessageSquare className="h-5 w-5" />
              {messageCount > 0 && (
                <span className={cn(
                  'absolute -top-0.5 -right-0.5',
                  'min-w-[18px] h-[18px] px-1',
                  'flex items-center justify-center',
                  'bg-red-500 text-white text-xs font-bold rounded-full'
                )}>
                  {messageCount > 99 ? '99+' : messageCount}
                </span>
              )}
            </Button>

            {/* User Avatar */}
            <Link to="/profile" className="ml-1">
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                fallback={user.name.charAt(0).toUpperCase()}
                size="sm"
                className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
              />
            </Link>
          </>
        ) : (
          <>
            {/* Login/Signup for non-authenticated users */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </header>
  )
}

