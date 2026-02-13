import { 
  ProfileTab 
} from './ProfileNavbar'
import { 
  PostPreviewCard 
} from './PostPreviewCard'
import { 
  Card 
} from '@/components/ui'

interface ProfileActivityProps {
  activeTab: ProfileTab
  posts: any[]
}

export const ProfileActivity = ({ 
  activeTab, 
  posts 
}: ProfileActivityProps) => {
  
  if (activeTab === 'Comments') {
    return (
      <Card className="p-10 text-center text-gray-500">
        No comments to show.
      </Card>
    )
  }

  if (activeTab === 'Spaces') {
    return (
      <Card className="p-10 text-center text-gray-500">
        No spaces to show.
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostPreviewCard 
            key={post.id} 
            post={post} 
          />
        ))
      ) : (
        <Card className="p-10 text-center text-gray-500">
          No activity found.
        </Card>
      )}
    </div>
  )
}
