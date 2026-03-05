import { AboutWidget } from './AboutWidget'
import { StatsWidget } from './StatsWidget'
import { SpacesWidget } from './SpacesWidget'

interface ProfileSidebarProps {
  user: any
  postCount: number
  commentCount: number
  spaces: any[]
}

export const ProfileSidebar = ({ 
  user, 
  postCount, 
  commentCount, 
  spaces 
}: ProfileSidebarProps) => {
  return (
    <aside className="col-span-12 lg:col-span-3 space-y-4">
      <AboutWidget user={user} />
      <StatsWidget 
        postCount={postCount}
        commentCount={commentCount}
        spacesCount={spaces.length}
      />
      <SpacesWidget spaces={spaces} />
    </aside>
  )
}
