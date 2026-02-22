import { Card } from '@/components/ui'
import { Skeleton, SkeletonAvatar, SkeletonText } from './Skeleton'

export const ProfileHeaderSkeleton = () => {
  return (
    <Card>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <SkeletonAvatar size="lg" className="h-20 w-20" />

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" variant="text" />
            <Skeleton className="h-4 w-24" variant="text" />
          </div>
          <SkeletonText lines={2} />
          
          {/* Stats */}
          <div className="flex gap-6 pt-2">
            <Skeleton className="h-4 w-20" variant="text" />
            <Skeleton className="h-4 w-20" variant="text" />
            <Skeleton className="h-4 w-20" variant="text" />
          </div>
        </div>

        {/* Action Button */}
        <Skeleton className="h-9 w-24" />
      </div>
    </Card>
  )
}
