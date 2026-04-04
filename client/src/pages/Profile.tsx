import {
  MainLayout,
} from '@/components/layout/MainLayout'
import {
  SidebarNav,
} from '@/features/navigation/components'
import {
  YourSpacesWidget,
} from '@/features/spaces/components'
import {
  useProfileView,
} from '@/features/profile/hooks/useProfileView'
import { useAuth } from '@/features/auth/hooks'
import {
  ErrorState,
  ProfilePageSkeleton,
} from '@/components/shared'
import {
  ProfileHeader,
  ProfileNavbar,
  ProfileSidebar,
  ProfileActivity,
} from '@/features/profile/components'
import { cn } from '@/lib/utils'

import { useEffect } from 'react'

const LeftSidebar = () => (
  <div className="flex flex-col gap-6 px-4">
    <SidebarNav />
    <div
      className={cn(
        'h-px bg-gray-200',
        'dark:bg-gray-800',
      )}
    />
    <YourSpacesWidget />
  </div>
)

const Profile = () => {
  const {
    user,
    posts,
    comments,
    spaces,
    upvotedPosts,
    isLoading,
    activeTab,
    setActiveTab,
  } = useProfileView()

  const { user: currentUser } = useAuth()

  const isOwnProfile = !!(
    currentUser &&
    user &&
    (currentUser.id === user.id
      || currentUser.username
        === user.username)
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  if (isLoading) {
    return (
      <MainLayout
        maxWidth="max-w-6xl"
        leftSidebar={<LeftSidebar />}
      >
        <ProfilePageSkeleton />
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <ErrorState
          title="User not found"
          message={
            'This user does not exist'
            + ' or has been deleted.'
          }
        />
      </MainLayout>
    )
  }

  return (
    <MainLayout
      maxWidth="max-w-6xl"
      leftSidebar={<LeftSidebar />}
    >
      {/* Header — full bleed */}
      <div
        className="relative -mx-4 md:-mx-6"
      >
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
        />
      </div>

      {/* Pill tabs */}
      <ProfileNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Grid: sidebar first on mobile */}
      <div
        className={cn(
          'grid grid-cols-1',
          'lg:grid-cols-12',
          'gap-4 lg:gap-6',
        )}
      >
        {/* Sidebar — shows first on mobile */}
        <aside
          className={cn(
            'lg:col-span-4',
            'lg:col-start-9',
            'order-first lg:order-none',
          )}
        >
          <ProfileSidebar
            user={user}
            postCount={posts.length}
            commentCount={comments.length}
            spaces={spaces}
          />
        </aside>

        {/* Content — below sidebar on mobile,
            left column on desktop */}
        <main
          className={cn(
            'lg:col-span-8',
            'lg:col-start-1',
            'lg:row-start-1',
          )}
        >
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
