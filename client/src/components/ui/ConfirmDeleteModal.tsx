import { useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Modal, Button } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

export interface ConfirmDeleteModalProps {
  isOpen: boolean
  title: string
  message: ReactNode
  confirmLabel?: string
  errorMessage?: string
  onConfirm: () => void | Promise<void>
  onClose: () => void
}

export const ConfirmDeleteModal = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  errorMessage = 'Something went wrong. Please try again.',
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await onConfirm()
      onClose()
    } catch (err) {
      setError(errorMessage)
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
            <AlertTriangle
              className={cn(
                'h-8 w-8',
                'text-red-600 dark:text-red-400',
              )}
            />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <h3
            className={cn(
              'text-lg font-semibold',
              'text-gray-900 dark:text-white',
            )}
          >
            {title}
          </h3>
          <div
            className={cn(
              'text-sm',
              'text-gray-500 dark:text-gray-400',
            )}
          >
            {message}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className={cn(
              'bg-red-50 dark:bg-red-900/20',
              'border border-red-200',
              'dark:border-red-800',
              'rounded-lg p-3 text-center',
            )}
          >
            <p
              className={cn(
                'text-sm',
                'text-red-600 dark:text-red-400',
              )}
            >
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
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
