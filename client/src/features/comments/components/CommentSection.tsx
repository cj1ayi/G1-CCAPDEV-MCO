import { useCommentVoting } from '@/features/comments/hooks'
import { CommentCard, CommentCardProps } from '@/features/comments/components'
import { cn } from '@/lib/utils'

interface CommentSectionProps {
  comments: CommentCardProps[]
  totalCount: number
  onEdit?: (commentId: string, newContent: string) => void | Promise<void>
  onDelete?: (commentId: string) => void | Promise<void>
  onReply?: (content: string, parentId?: string) => void | Promise<void>
}

export const CommentSection = ({ 
  comments, 
  totalCount,
  onEdit,
  onDelete,
  onReply
}: CommentSectionProps) => {
  const { addVoteHandlers } = useCommentVoting()

  // Wire up all handlers (voting + edit/delete + reply)
  const commentsWithHandlers = comments.map(comment =>
    addVoteHandlers(comment, onEdit, onDelete, onReply)
  )

  if (comments.length === 0) {
    return null
  }

  return (
    <>
      <div className="flex items-center justify-between px-2 mt-4">
        <h3 className="font-bold text-slate-800 dark:text-white">
          Comments ({totalCount})
        </h3>
        <div
          className={cn(
            'text-xs text-gray-500 uppercase',
            'tracking-wide font-semibold'
          )}
        >
          Sorted by Best
        </div>
      </div>

      <div className="space-y-6">
        {commentsWithHandlers.map((comment) => (
          <CommentCard key={comment.id} {...comment} />
        ))}
      </div>

      <div className="py-8 text-center text-sm text-gray-400">
        <p>End of comments</p>
      </div>
    </>
  )
}
