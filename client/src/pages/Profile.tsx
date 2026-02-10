import { MainLayout } from '@/components/layout/MainLayout'
import { ProfileHeader } from '@/features/profile/components/ProfileHeader'
import { ProfileNavbar } from '@/features/profile/components/ProfileNavbar'
import { AboutWidget } from '@/features/profile/components/AboutWidget'
import { StatsWidget } from '@/features/profile/components/StatsWidget'
import { SpacesWidget } from '@/features/profile/components/SpacesWidget'

const Profile = () => {
  return (
		<MainLayout 
    	headerVariant="profile" 
      maxWidth="max-w-7xl" 
    >
			<div className="relative">
				{/* HEADER */}
				<ProfileHeader />
				<ProfileNavbar />

				{/* ACTIVITY */}
				<div className="h-6 lg:h-8"></div>
				<div className="grid grid-cols-12 gap-6">
					<aside className="col-span-3 space-y-4">
						<AboutWidget />				
						<StatsWidget />
						<SpacesWidget />
					</aside>
					<main className="col-span-6 space-y-4">
					</main>
				</div>
			</div>
    </MainLayout>
  )
}

export default Profile
