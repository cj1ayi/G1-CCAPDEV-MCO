import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from '@/components/ui'

export interface PostOwnerMenuProps {
  onEdit?: () => void
  onDelete?: () => void
  /** Prevents click from bubbling (card). */
  stopPropagation?: boolean
  className?: string
}

export const PostOwnerMenu = ({
  onEdit,
  onDelete,
  stopPropagation = false,
  className,
}: PostOwnerMenuProps) => {
  const handleClick = (
    e: React.MouseEvent | undefined,
    handler?: () => void,
  ) => {
    if (stopPropagation) e?.stopPropagation()
    handler?.()
  }

  const trigger = (
    <button
      className={cn(
        'p-2 rounded-full transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'text-gray-500 dark:text-gray-400',
      )}
      aria-label="Post options"
    >
      <MoreHorizontal className="h-5 w-5" />
    </button>
  )

  const menu = (
    <Dropdown align="right" trigger={trigger}>
      <DropdownItem
        icon={<Edit className="h-4 w-4" />}
        onClick={(e) => handleClick(e, onEdit)}
      >
        Edit Post
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem
        icon={<Trash2 className="h-4 w-4" />}
        destructive
        onClick={(e) => handleClick(e, onDelete)}
      >
        Delete Post
      </DropdownItem>
    </Dropdown>
  )

  if (!stopPropagation) {
    return (
      <div className={className}>{menu}</div>
    )
  }

  return (
    <div
      className={cn(
        'relative z-20 shrink-0',
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {menu}
    </div>
  )
}
