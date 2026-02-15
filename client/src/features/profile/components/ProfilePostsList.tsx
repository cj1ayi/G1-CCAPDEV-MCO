import { 
  Card, 
  CardContent 
} from '@/components/ui'

import { PostPreviewCard } from '../components'
import { FileX } from 'lucide-react'
import { ProfilePostsListProps } from '../types'
import { cn } from '@/lib/utils'

export const ProfilePostsList = (
  { 
    posts, 
    isOwnProfile 
  }: ProfilePostsListProps) => {

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className={cn(
          "py-12 flex flex-col items-center gap-3 text-center")}>
          <div className={cn(
            "w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex",
            "items-center justify-center")}>
            <FileX className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {isOwnProfile ? "You haven't posted yet" : 'No posts yet'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isOwnProfile
                ? 'Share something with your spaces!'
                : 'Check back later for new activity.'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostPreviewCard key={post.id} post={post} />
      ))}
    </div>
  )
}
