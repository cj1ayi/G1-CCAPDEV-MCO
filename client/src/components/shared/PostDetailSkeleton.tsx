import { Card } from '@/components/ui'
import { Skeleton, SkeletonAvatar, SkeletonText } from './Skeleton'
import { cn } from '@/lib/utils'

export const PostDetailSkeleton = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" variant="text" />
        <Skeleton className="h-4 w-4" variant="text" />
        <Skeleton className="h-4 w-32" variant="text" />
      </div>

      {/* Main Post Card */}
      <Card padding="none">
        <div className="flex">
          {/* Vote Column */}
          <div className={cn(
            "w-10 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200",
            "dark:border-gray-700 p-2 flex flex-col items-center gap-2")}>
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-5 w-8" variant="text" />
            <Skeleton className="h-6 w-6" />
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
              <SkeletonAvatar size="sm" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-32" variant="text" />
                <Skeleton className="h-3 w-24" variant="text" />
              </div>
            </div>

            {/* Title */}
            <Skeleton className="h-7 w-3/4" variant="text" />

            {/* Content */}
            <SkeletonText lines={4} />

            {/* Image Placeholder */}
            <Skeleton className="h-64 w-full" />

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-4 w-20" variant="text" />
              <Skeleton className="h-4 w-16" variant="text" />
              <Skeleton className="h-4 w-16" variant="text" />
            </div>
          </div>
        </div>
      </Card>

      {/* Comments Section Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" variant="text" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}
