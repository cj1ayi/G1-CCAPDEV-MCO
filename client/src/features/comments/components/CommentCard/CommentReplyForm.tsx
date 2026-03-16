import { CommentInput } from '../CommentInput'
import type { CommentReplyFormProps } from './types'

export const CommentReplyForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CommentReplyFormProps) => {
  return (
    <div className="mt-3">
      <CommentInput
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        placeholder="Write a reply..."
        autoFocus
      />
    </div>
  )
}
