import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CommentActionsProps } from './types'

export const CommentActions = ({
  isDeleted = false,
  isReplying,
  onReplyClick,
}: CommentActionsProps) => {
  if (isDeleted) {
    return null
  }

  return (
    <button
      onClick={onReplyClick}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded',
        'text-xs font-medium transition-colors',
        isReplying
          ? 'text-primary bg-primary/10'
          : 'text-gray-500 hover:text-primary ' +
              'hover:bg-gray-100 dark:hover:bg-gray-800',
      )}
    >
      <MessageSquare className="h-3.5 w-3.5" />
      <span>Reply</span>
    </button>
  )
}
