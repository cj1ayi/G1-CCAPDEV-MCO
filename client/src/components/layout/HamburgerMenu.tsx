import { useState } from 'react'
import { cn } from '@/lib/utils'

interface HamburgerMenuProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export const HamburgerMenu = ({ 
  isOpen, 
  onToggle, 
  className 
}: HamburgerMenuProps) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg',
        'hover:shadow-xl hover:scale-105',
        'active:scale-95',
        'transition-all duration-200',
        'border border-gray-200 dark:border-gray-700',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
        {/* Top line */}
        <span 
          className={cn(
            "block w-full h-0.5 bg-gray-900 dark:bg-white",
            "transition-all duration-300 ease-out",
            isOpen && "rotate-45 translate-y-1.5"
          )}
        />
        {/* Middle line */}
        <span 
          className={cn(
            "block w-full h-0.5 bg-gray-900 dark:bg-white",
            "transition-all duration-300 ease-out",
            isOpen && "opacity-0"
          )}
        />
        {/* Bottom line */}
        <span 
          className={cn(
            "block w-full h-0.5 bg-gray-900 dark:bg-white",
            "transition-all duration-300 ease-out",
            isOpen && "-rotate-45 -translate-y-1.5"
          )}
        />
      </div>
    </button>
  )
}
