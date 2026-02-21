import { Card } from '@/components/ui'
import { Skeleton, SkeletonAvatar, SkeletonText } from './Skeleton'

export const PostCardSkeleton = () => {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex">
        {/* Vote Column Skeleton */}
        <div className="w-10 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 p-2 flex flex-col items-center gap-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-4 w-8" variant="text" />
          <Skeleton className="h-6 w-6" />
        </div>

        {/* Content Column Skeleton */}
        <div className="flex-1 p-4 space-y-3">
          {/* Header Skeleton */}
          <div className="flex items-center gap-2">
            <SkeletonAvatar size="sm" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-32" variant="text" />
              <Skeleton className="h-3 w-24" variant="text" />
            </div>
          </div>

          {/* Title Skeleton */}
          <Skeleton className="h-5 w-3/4" variant="text" />

          {/* Content Skeleton */}
          <SkeletonText lines={2} />

          {/* Actions Skeleton */}
          <div className="flex items-center gap-4 pt-2">
            <Skeleton className="h-4 w-20" variant="text" />
            <Skeleton className="h-4 w-16" variant="text" />
            <Skeleton className="h-4 w-16" variant="text" />
          </div>
        </div>
      </div>
    </Card>
  )
}
