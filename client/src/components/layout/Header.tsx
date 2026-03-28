import { Link, useNavigate, useLocation } from 'react-router-dom'

import {
  Search,
  Plus,
  Bell,
  MessageSquare,
  Menu,
  X,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
  ArrowLeft,
} from 'lucide-react'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import { AvatarDropdown } from '@/components/ui/AvatarDropdown'
import { cn } from '@/lib/utils'
import AnimoForumsLogoHat from '@/assets/logo/AnimoForumsLogoHat.svg'

interface User {
  name: string
  avatarUrl?: string
  id: number
  username?: string
}

interface HeaderProps {
  variant?: 'default' | 'landing'
  user?: User
  onSearch?: (query: string) => void
  onCreatePost?: () => void
  onLogout?: () => void
  notifCount?: number
  messageCount?: number
  isMobileMenuOpen?: boolean
  onToggleMobileMenu?: () => void
  isDesktopSidebarCollapsed?: boolean
  onToggleDesktopSidebar?: () => void
  isDark?: boolean
  onToggleDarkMode?: () => void
}

export const Header = ({
  variant = 'default',
  user,
  onSearch,
  onCreatePost,
  onLogout,
  notifCount = 0,
  messageCount = 0,
  isMobileMenuOpen = false,
  onToggleMobileMenu,
  isDesktopSidebarCollapsed = false,
  onToggleDesktopSidebar,
  isDark = false,
  onToggleDarkMode,
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const spaceMatch = location.pathname.match(/^\/r\/([^/]+)/)
  const currentSpaceName = spaceMatch ? spaceMatch[1] : null

  // Focus the input when mobile search opens
  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 50)
    }
  }, [isMobileSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch?.(searchQuery)
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsMobileSearchOpen(false)
    }
  }

  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost()
    } else {
      const url = currentSpaceName
        ? `/post/create?space=${currentSpaceName}`
        : '/post/create'
      navigate(url)
    }
  }

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-16 px-4 lg:px-6',
        'flex items-center justify-between gap-2 sm:gap-4',
        'bg-surface-light dark:bg-surface-dark',
        'border-b border-border-light dark:border-border-dark',
      )}
    >
      {/* ── Mobile Search Overlay ── */}
      {isMobileSearchOpen && variant !== 'landing' && (
        <div className={cn(
          "absolute inset-0 z-10 flex items-center gap-2 px-3",
          "bg-surface-light dark:bg-surface-dark sm:hidden"
          )}
        >
          <button
            onClick={closeMobileSearch}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-darker shrink-0"
            aria-label="Close search"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          <form onSubmit={handleSearch} className="flex-1" aria-label="Mobile Search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={mobileSearchInputRef}
                id="mobile-search-input" // FIXED: Added ID
                name="q"                 // FIXED: Added Name
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
                  'transition-all',
                )}
              />
            </div>
          </form>
        </div>
      )}

      {/* ── Left Section ── */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {variant !== 'landing' && onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className={cn(
              'xl:hidden p-2 rounded-lg',
              'hover:bg-gray-100 dark:hover:bg-surface-darker',
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

        {variant !== 'landing' && onToggleDesktopSidebar && (
          <button
            onClick={onToggleDesktopSidebar}
            className={cn(
              'hidden xl:flex p-2 rounded-lg',
              'hover:bg-gray-100 dark:hover:bg-surface-darker',
            )}
            aria-label={isDesktopSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
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

      {/* ── Center: Search (desktop/tablet only) ── */}
      {variant !== 'landing' && (
        <form
          onSubmit={handleSearch}
          className="relative flex-1 max-w-xl hidden sm:block"
          aria-label="Desktop Search"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="desktop-search-input" // FIXED: Added ID
            name="q"                  // FIXED: Added Name
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
              'transition-all',
            )}
          />
        </form>
      )}

      {/* ── Right Section ── */}
      <div className="flex items-center gap-1 shrink-0">
        {variant !== 'landing' && (
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-darker"
            aria-label="Open search"
          >
            <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {onToggleDarkMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="!px-2"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}

        {user ? (
          <>
            {variant !== 'landing' && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreatePost}
                  leftIcon={<Plus className="h-4 w-4" />}
                  className="hidden sm:inline-flex"
                >
                  Create
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreatePost}
                  className="sm:hidden !px-2"
                  aria-label="Create post"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            )}

            <div className="ml-1">
              <AvatarDropdown
                user={{
                  name: user.name,
                  username: user.username,
                  avatarUrl: user.avatarUrl,
                }}
                onLogout={onLogout}
              />
            </div>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
              Join
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
