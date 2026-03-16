import {
  ConfirmDeleteModal,
} from '@/components/ui/ConfirmDeleteModal'
import { DeletePostModalProps } from '../types'

const MESSAGE =
  'This post will be permanently deleted.' +
  ' This action cannot be undone.'

export const DeletePostModal = ({
  isOpen,
  onConfirm,
  onClose,
}: DeletePostModalProps) => (
  <ConfirmDeleteModal
    isOpen={isOpen}
    title="Delete post?"
    message={MESSAGE}
    errorMessage="Failed to delete post. Please try again."
    onConfirm={onConfirm}
    onClose={onClose}
  />
)
