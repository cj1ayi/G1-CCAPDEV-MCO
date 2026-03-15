import { cn } from '@/lib/utils'
import { Skeleton, SkeletonAvatar, SkeletonText } from './Skeleton'

interface CommentSkeletonProps {
  depth?: number
  withReplies?: boolean
}

export const CommentSkeleton = ({ 
  depth = 0,
  withReplies = false 
}: CommentSkeletonProps) => {
  return (
    <div
      className={cn(
        depth > 0 && [
          'ml-6 md:ml-8 pl-4',
          'border-l-2 border-gray-200 dark:border-gray-800',
        ]
      )}
    >
      <div className="py-3 space-y-3">
        {/* Header Skeleton */}
        <div className="flex items-center gap-2">
          <SkeletonAvatar size="sm" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-24" variant="text" />
            <Skeleton className="h-3 w-16" variant="text" />
          </div>
        </div>

        {/* Content Skeleton */}
        <SkeletonText lines={2} className="ml-0" />

        {/* Actions Skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-12" variant="text" />
          <Skeleton className="h-4 w-12" variant="text" />
          <Skeleton className="h-4 w-12" variant="text" />
        </div>
      </div>

      {/* Optional nested replies skeleton */}
      {withReplies && depth < 2 && (
        <div className="space-y-0">
          <CommentSkeleton depth={depth + 1} />
        </div>
      )}
    </div>
  )
}

// Skeleton for multiple comments
export const CommentsSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, j) => (
        <CommentSkeleton 
          key={j} 
          withReplies={j === 0}         
        />
      ))}
    </div>
  )
}
