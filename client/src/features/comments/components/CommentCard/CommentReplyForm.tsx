import { CommentInput } from '../CommentInput'
import type { CommentReplyFormProps } from './types'

export const CommentReplyForm = ({
  onSubmit,
  onCancel,
}: CommentReplyFormProps) => {
  return (
    <div className="mt-3">
      <CommentInput
        onSubmit={onSubmit}
        onCancel={onCancel}
        placeholder="Write a reply..."
        autoFocus
      />
    </div>
  )
}
