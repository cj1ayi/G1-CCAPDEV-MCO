import { 
  ProfilePostsList 
} from '@/features/profile/components/ProfilePostsList'

interface ActivityFeedProps {
  posts: any[]
  isOwnProfile?: boolean
}

export const ActivityFeed = ({ posts, isOwnProfile }: ActivityFeedProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold dark:text-white">Recent Activity</h2>
      <ProfilePostsList posts={posts} isOwnProfile={isOwnProfile} />
    </div>
  )
}
