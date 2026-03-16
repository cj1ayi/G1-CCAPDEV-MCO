import {
  ConfirmDeleteModal,
} from '@/components/ui/ConfirmDeleteModal'

interface SpaceDeleteModalProps {
  isOpen: boolean
  spaceName: string
  onConfirm: () => void | Promise<void>
  onClose: () => void
}

export const SpaceDeleteModal = ({
  isOpen,
  spaceName,
  onConfirm,
  onClose,
}: SpaceDeleteModalProps) => (
  <ConfirmDeleteModal
    isOpen={isOpen}
    title="Delete Space"
    message={
      <>
        Are you sure you want to delete{' '}
        <span className="font-semibold">
          r/{spaceName}
        </span>
        ? This action cannot be undone.
      </>
    }
    confirmLabel="Delete Space"
    errorMessage="Failed to delete space. Please try again."
    onConfirm={onConfirm}
    onClose={onClose}
  />
)
