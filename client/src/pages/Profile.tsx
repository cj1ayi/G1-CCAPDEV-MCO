import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { YourSpacesWidget } from '@/features/spaces/components'
import { useProfileView } from '@/features/profile/hooks/useProfileView'
import { userService } from '@/features/profile/services/userService'
import { useEffect, useState } from 'react'
import { ErrorState, ProfileHeaderSkeleton, FeedSkeleton } from '@/components/shared'

import { 
  ProfileHeader,
  ProfileNavbar,
  ProfileSidebar,
  ProfileActivity,
} from '@/features/profile/components'

const Profile = () => {
  const { 
    user, 
    posts,
    comments,
    spaces,
    upvotedPosts,
    isLoading, 
    activeTab, 
    setActiveTab 
  } = useProfileView()

  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    userService.getCurrentUser().then(setCurrentUser)
  }, [])

  const isOwnProfile = !!(
    currentUser && 
    user && 
    (currentUser.id === user.id || currentUser.username === user.username)
  )

  if (isLoading) {
    return (
      <MainLayout
        maxWidth="max-w-full"
        leftSidebar={
          <div className="flex flex-col gap-6 px-4">
            <SidebarNav />
            <div className="h-px bg-gray-200 dark:bg-gray-800" />
            <YourSpacesWidget />
          </div>
        }
      >
        <ProfileHeaderSkeleton />
        <div className="h-6" />
        <FeedSkeleton count={3} />
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <ErrorState
          title="User not found"
          message="This user does not exist or has been deleted."
        />
      </MainLayout>
    )
  }

  return (
    <MainLayout
      maxWidth="max-w-full"
      leftSidebar={
        <div className="flex flex-col gap-6 px-4">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </div>
      }
    >
      <div className="relative -mx-4 md:-mx-6">
        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
        <ProfileNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="h-6 lg:h-8" />

      <div className="grid grid-cols-12 gap-6">
        <ProfileSidebar 
          user={user}
          postCount={posts.length}
          commentCount={comments.length}
          spaces={spaces}
        />

        <main className="col-span-12 lg:col-span-9">
          <ProfileActivity 
            activeTab={activeTab} 
            posts={posts}
            comments={comments}
            spaces={spaces}
            upvotedPosts={upvotedPosts}
          />
        </main>
      </div>
    </MainLayout>
  )
}

export default Profile
