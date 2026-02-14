import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import { 
  YourSpacesWidget 
} from '@/features/spaces/components/YourSpacesWidget'
import { ProfileHeader } from '@/features/profile/components/ProfileHeader'
import { ProfileNavbar } from '@/features/profile/components/ProfileNavbar'
import { ProfileSidebar } from '@/features/profile/components/ProfileSidebar'
import { ProfileActivity } from '@/features/profile/components/ProfileActivity'
import { useProfileView } from '@/features/profile/hooks/useProfileView'

const Profile = () => {
  const { 
    user, 
    posts, 
    isLoading, 
    activeTab, 
    setActiveTab 
  } = useProfileView()

  if (isLoading) return <div className="p-10 text-center">Loading...</div>
  if (!user) return <div className="p-10 text-center">User not found</div>

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
        <ProfileHeader user={user} />
        <ProfileNavbar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>

      <div className="h-6 lg:h-8" />

      <div className="grid grid-cols-12 gap-6">
        <ProfileSidebar user={user} />

        <main className="col-span-12 lg:col-span-9 space-y-4">
          <h2 className="text-lg font-bold dark:text-white">
            {activeTab}
          </h2>
          <ProfileActivity 
            activeTab={activeTab} 
            posts={posts} 
          />
        </main>
      </div>
    </MainLayout>
  )
}

export default Profile
