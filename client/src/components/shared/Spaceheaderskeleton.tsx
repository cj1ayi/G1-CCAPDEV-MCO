import { Card } from '@/components/ui'
import { Skeleton, SkeletonAvatar, SkeletonText } from './Skeleton'

export const SpaceHeaderSkeleton = () => {
  return (
    <Card className="mb-6">
      <div className="flex items-start gap-4">
        {/* Space Icon */}
        <SkeletonAvatar size="lg" className="h-16 w-16" />

        {/* Space Info */}
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" variant="text" />
            <Skeleton className="h-4 w-32" variant="text" />
          </div>
          <SkeletonText lines={2} />
          
          {/* Stats */}
          <div className="flex gap-6 pt-2">
            <Skeleton className="h-4 w-24" variant="text" />
            <Skeleton className="h-4 w-24" variant="text" />
          </div>
        </div>

        {/* Join Button */}
        <Skeleton className="h-10 w-24" />
      </div>
    </Card>
  )
}
