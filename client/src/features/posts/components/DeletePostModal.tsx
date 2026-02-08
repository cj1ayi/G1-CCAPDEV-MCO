import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Modal, Button } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

interface DeletePostModalProps {
  isOpen: boolean
  postTitle: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export const DeletePostModal = ({
  isOpen,
  postTitle,
  onConfirm,
  onCancel,
}: DeletePostModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await onConfirm()
    } catch (err) {
      setError('Failed to delete post. Please try again.')
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Delete Post"
    >
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div
            className={cn(
              'w-16 h-16 rounded-full',
              'bg-red-100 dark:bg-red-900/20',
              'flex items-center justify-center'
            )}
          >
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <h3
            className={cn(
              'text-lg font-semibold',
              'text-gray-900 dark:text-white'
            )}
          >
            Are you sure you want to delete this post?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            "{postTitle}"
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone. All comments and votes will also be
            removed.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={cn(
              'bg-red-50 dark:bg-red-900/20',
              'border border-red-200 dark:border-red-800',
              'rounded-lg p-3 text-center'
            )}
          >
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                Deleting...
              </span>
            ) : (
              'Delete Post'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
