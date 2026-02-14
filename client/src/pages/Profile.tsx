import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import { YourSpacesWidget } from '@/features/spaces/components/YourSpacesWidget'
import { ProfileHeader } from '@/features/profile/components/ProfileHeader'
import { ProfileNavbar } from '@/features/profile/components/ProfileNavbar'
import { ProfileSidebar } from '@/features/profile/components/ProfileSidebar'
import { ProfileActivity } from '@/features/profile/components/ProfileActivity'
import { ProfileLoadingState } from '@/features/profile/components/ProfileLoadingState'
import { ProfileNotFound } from '@/features/profile/components/ProfileNotFound'
import { useProfileView } from '@/features/profile/hooks/useProfileView'
import { userService } from '@/features/profile/services/userService'
import { useEffect, useState } from 'react'

const Profile = () => {
  const { user, posts, isLoading, activeTab, setActiveTab } = useProfileView()
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    userService.getCurrentUser().then(setCurrentUser)
  }, [])

  const isOwnProfile = currentUser && user && currentUser.id === user.id

  if (isLoading) return <ProfileLoadingState />
  if (!user) return <ProfileNotFound />

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
        <ProfileSidebar user={user} />

        <main className="col-span-12 lg:col-span-9">
          <ProfileActivity activeTab={activeTab} posts={posts} />
        </main>
      </div>
    </MainLayout>
  )
}

export default Profile
