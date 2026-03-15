import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CommentMenuProps } from './types'

export const CommentMenu = ({
  isOwner = false,
  isEditing,
  isDeleted = false,
  showMenu,
  menuRef,
  onToggleMenu,
  onEditClick,
  onDeleteClick,
}: CommentMenuProps) => {
  if (!isOwner || isEditing || isDeleted) {
    return null
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggleMenu}
        className={cn(
          'p-1 rounded',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'opacity-0 group-hover:opacity-100',
          'transition-all duration-200',
          'active:scale-95',
          showMenu && 'opacity-100 bg-gray-100 dark:bg-gray-800'
        )}
      >
        <MoreHorizontal className="h-4 w-4 text-gray-500" />
      </button>

      {showMenu && (
        <div
          className={cn(
            'absolute right-0 top-full mt-1 z-50',
            'w-48 py-1 rounded-lg shadow-lg',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'animate-in fade-in slide-in-from-top-1 duration-150'
          )}
        >
          <button
            onClick={onEditClick}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2',
              'text-sm text-gray-700 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'transition-colors'
            )}
          >
            <Edit className="h-4 w-4" />
            Edit Comment
          </button>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          <button
            onClick={onDeleteClick}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2',
              'text-sm text-red-600 dark:text-red-400',
              'hover:bg-red-50 dark:hover:bg-red-900/20',
              'transition-colors'
            )}
          >
            <Trash2 className="h-4 w-4" />
            Delete Comment
          </button>
        </div>
      )}
    </div>
  )
}
