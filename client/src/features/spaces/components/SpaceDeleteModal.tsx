import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface SpaceDeleteModalProps {
  spaceName: string
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const SpaceDeleteModal = ({
  spaceName,
  isDeleting,
  onConfirm,
  onCancel,
}: SpaceDeleteModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div
      className={cn(
        'bg-white dark:bg-surface-dark rounded-xl shadow-xl',
        'p-6 max-w-md w-full mx-4'
      )}
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Space</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Are you sure you want to delete <span className="font-semibold">r/{spaceName}</span>?
        This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          isLoading={isDeleting}
          className="bg-red-500 hover:bg-red-600"
        >
          Delete Space
        </Button>
      </div>
    </div>
  </div>
)
