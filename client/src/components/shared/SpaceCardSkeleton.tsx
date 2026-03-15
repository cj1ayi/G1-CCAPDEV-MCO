import { Card } from '@/components/ui'
import { Skeleton, SkeletonAvatar, SkeletonText } from './Skeleton'
import { cn } from '@/lib/utils'
export const SpaceCardSkeleton = () => {
  return (
    <Card className={cn(
      "hover:border-gray-300 dark:hover:border-gray-700 transition-colors")}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <SkeletonAvatar size="md" />

        {/* Content */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" variant="text" />
          <SkeletonText lines={2} />
          
          {/* Stats */}
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-3 w-24" variant="text" />
            <Skeleton className="h-3 w-24" variant="text" />
          </div>
        </div>

        {/* Join Button */}
        <Skeleton className="h-8 w-16" />
      </div>
    </Card>
  )
}

export const SpaceCardsSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, j) => (
        <SpaceCardSkeleton key={j} />
      ))}
    </div>
  )
}
