import { 
  CommentCard, 
  CommentCardProps 
} from '../components'

import { CommentSectionProps } from '../types'

import { cn } from '@/lib/utils'

export const CommentSection = ({ 
  comments, 
  totalCount
}: CommentSectionProps) => {
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
        {comments.map((comment) => (
          <CommentCard key={comment.id} {...comment} />
        ))}
      </div>

      <div className="py-8 text-center text-sm text-gray-400">
        <p>End of comments</p>
      </div>
    </>
  )
}

