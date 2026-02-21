import { PostCardSkeleton } from './PostCardSkeleton'

interface FeedSkeletonProps {
  count?: number
}

export const FeedSkeleton = ({ count = 5 }: FeedSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
