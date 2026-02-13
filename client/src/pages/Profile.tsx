import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userService } from '@/features/profile/services/userService'
import { postService } from '@/features/posts/services'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProfileHeader } from '@/features/profile/components/ProfileHeader'
import { ProfileNavbar } from '@/features/profile/components/ProfileNavbar'
import { AboutWidget } from '@/features/profile/components/AboutWidget'
import { StatsWidget } from '@/features/profile/components/StatsWidget'
import { SpacesWidget } from '@/features/profile/components/SpacesWidget'
import { PostPreviewCard } from '@/features/profile/components/PostPreviewCard'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import { YourSpacesWidget } from '@/features/spaces/components/YourSpacesWidget'

const Profile = () => {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        // Fetch current user for comparison
        const current = await userService.getCurrentUser()
        setCurrentUser(current)

        const fetchedUser = await userService.getUserById(id)

        if (fetchedUser) {
          setUser(fetchedUser)

          const allPosts = await postService.getAllPosts()
          const userPosts = allPosts
            .filter((p) => p.author.id === fetchedUser.id)
          setPosts(userPosts)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndPosts()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>User not found</div>

  const isOwnProfile = currentUser && currentUser.id === user.id

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
        <ProfileNavbar />
      </div>

      {/* ACTIVITY */}
      <div className="h-6 lg:h-8"></div>
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <AboutWidget user={user} />
          <StatsWidget />
          <SpacesWidget />
        </aside>
        <main className="col-span-12 lg:col-span-9 space-y-4">
          <h2 className="text-lg font-bold dark:text-white">
            Recent Activity
          </h2>
          {posts.map((post) => (
            <PostPreviewCard key={post.id} post={post} />
          ))}
        </main>
      </div>
    </MainLayout>
  )
}

export default Profile
