import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { CommentContentProps } from './types'

export const CommentContent = ({
  content,
  isDeleted = false,
  isEditing,
  editContent,
  isSaving,
  onEditContentChange,
  onSaveEdit,
  onCancelEdit,
}: CommentContentProps) => {
  if (isEditing) {
    return (
      <div className="space-y-2 mb-2">
        <textarea
          value={editContent}
          onChange={(e) => onEditContentChange(e.target.value)}
          className={cn(
            'w-full min-h-[80px] text-sm rounded-lg border',
            'bg-white dark:bg-gray-900 px-4 py-3',
            'text-gray-900 dark:text-white',
            'border-gray-200 dark:border-gray-700',
            'focus:outline-none focus:ring-2 focus:ring-primary/20',
            'focus:border-primary'
          )}
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onSaveEdit}
            disabled={isSaving || !editContent.trim()}
            leftIcon={<Check className="h-4 w-4" />}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelEdit}
            disabled={isSaving}
            leftIcon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'text-sm leading-relaxed mb-2',
        isDeleted
          ? 'text-gray-400 dark:text-gray-500 italic'
          : 'text-gray-900 dark:text-gray-100'
      )}
    >
      {isDeleted ? '[deleted]' : content}
    </div>
  )
}
