import { cn } from '@/lib/utils'
import {
  ConfirmDeleteModal,
} from '@/components/ui/ConfirmDeleteModal'
import { DeleteCommentModalProps } from '../types'

const DEFAULT_MESSAGE =
  'This comment will be permanently deleted.' +
  ' This action cannot be undone.'

function RepliesWarning() {
  return (
    <div className="space-y-2">
      <p
        className={cn(
          'text-sm font-medium',
          'text-gray-600 dark:text-gray-300',
        )}
      >
        This comment has replies.
      </p>
      <p
        className={cn(
          'text-sm',
          'text-gray-500 dark:text-gray-400',
        )}
      >
        Your comment will be marked as
        <span
          className={cn(
            'font-mono',
            'text-gray-600 dark:text-gray-300',
          )}
        >
          {' '}[deleted]{' '}
        </span>
        and your username will be removed, but
        replies will remain visible.
      </p>
    </div>
  )
}

export const DeleteCommentModal = ({
  isOpen,
  hasReplies,
  onConfirm,
  onClose,
}: DeleteCommentModalProps) => {
  const message = hasReplies
    ? <RepliesWarning />
    : DEFAULT_MESSAGE

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      title="Delete comment?"
      message={message}
      errorMessage={
        'Failed to delete comment. Please try again.'
      }
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
