import { useState, useRef, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const node = event.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-max min-w-[12rem] max-w-xs',
            'rounded-lg bg-white dark:bg-surface-dark shadow-lg',
            'ring-1 ring-black/5 dark:ring-white/10',
            'animate-in fade-in slide-in-from-top-2 duration-200',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          <div className="py-1" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  destructive?: boolean
  disabled?: boolean
  className?: string
}

export const DropdownItem = ({
  children,
  onClick,
  icon,
  destructive,
  disabled,
  className
}: DropdownItemProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left',
        'transition-colors hover:bg-gray-100 dark:hover:bg-white/10',
        destructive && [
          'text-red-600 dark:text-red-400',
          'hover:bg-red-50 dark:hover:bg-red-900/20'
        ],
        !destructive && 'text-gray-700 dark:text-gray-200',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  )
}

export const DropdownSeparator = () => (
  <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
)

interface DropdownLabelProps {
  children: ReactNode
  className?: string
}

export const DropdownLabel = ({
  children,
  className
}: DropdownLabelProps) => (
  <div
    className={cn(
      'px-4 py-2 text-xs font-semibold uppercase tracking-wider',
      'text-gray-500 dark:text-gray-400',
      className
    )}
  >
    {children}
  </div>
)
