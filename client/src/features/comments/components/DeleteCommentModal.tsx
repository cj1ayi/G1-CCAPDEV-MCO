import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Modal, Button } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'
import { DeleteCommentModalProps } from '../types'

export const DeleteCommentModal = ({
  isOpen,
  hasReplies,
  onConfirm,
  onClose,
}: DeleteCommentModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await onConfirm()
      onClose()
    } catch (err) {
      setError('Failed to delete comment. Please try again.')
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6 space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div
            className={cn(
              'w-16 h-16 rounded-full',
              'bg-red-100 dark:bg-red-900/20',
              'flex items-center justify-center',
            )}
          >
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Message - Different based on replies */}
        <div className="text-center space-y-2">
          <h3
            className={cn(
              'text-lg font-semibold',
              'text-gray-900 dark:text-white',
            )}
          >
            Delete comment?
          </h3>

          {hasReplies ? (
            <div className="space-y-2">
              <p
                className={cn(
                  'text-sm text-gray-600 dark:text-gray-300',
                  'font-medium',
                )}
              >
                This comment has replies.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your comment will be marked as
                <span
                  className={cn(
                    'font-mono text-gray-600 dark:text-gray-300',
                  )}
                >
                  [deleted]
                </span>
                and your username will be removed, but
                replies will remain visible.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This comment will be permanently deleted.
              This action cannot be undone.
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={cn(
              'bg-red-50 dark:bg-red-900/20',
              'border border-red-200 dark:border-red-800',
              'rounded-lg p-3 text-center',
            )}
          >
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
            isLoading={isDeleting}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
