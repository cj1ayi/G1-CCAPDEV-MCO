import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//service
import { userService } from '@/features/profile/services/userService'
import { postService } from '@/features/posts/services'

//components
import { MainLayout } from '@/components/layout/MainLayout'
import { ProfileHeader } from '@/features/profile/components/ProfileHeader'
import { ProfileNavbar } from '@/features/profile/components/ProfileNavbar'
import { AboutWidget } from '@/features/profile/components/AboutWidget'
import { StatsWidget } from '@/features/profile/components/StatsWidget'
import { SpacesWidget } from '@/features/profile/components/SpacesWidget'
import { PostPreviewCard } from '@/features/profile/components/PostPreviewCard'

const Profile = () => {
	const { id } = useParams<{ id: string }>()
	const [user, setUser] = useState<any>(null)
	const [posts, setPosts] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	
  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        let fetchedUser = await userService.getUserById(id)

        if (!fetchedUser) {
          fetchedUser = getMockUser(id)
        }

        setUser(fetchedUser)

				const allPosts = await postService.getAllPosts()
        const userPosts = allPosts.filter(p => p.author.id === fetchedUser.id)

				setPosts(userPosts)
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

  return (
		<MainLayout 
    	headerVariant="profile" 
      maxWidth="max-w-7xl" 
    >
			<div className="relative">
				{/* HEADER */}
				<ProfileHeader user={user}/>
				<ProfileNavbar />

				{/* ACTIVITY */}
				<div className="h-6 lg:h-8"></div>
				<div className="grid grid-cols-12 gap-6">
					<aside className="col-span-3 space-y-4">
						<AboutWidget user={user}/>				
						<StatsWidget />
						<SpacesWidget />
					</aside>
					<main className="col-span-9 space-y-4">
						<h2 className="text-lg font-bold dark:text-white">Recent Activity</h2>
						{posts.map((post) => (
							<PostPreviewCard key={post.id} post={post} />
						))}
					</main>
				</div>
			</div>
    </MainLayout>
  )
}

export default Profile
