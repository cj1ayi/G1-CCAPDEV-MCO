import { MainLayout } from '@/components/layout/MainLayout'
import { ProfileHeader } from '@/features/profile/components/ProfileHeader'
import { ProfileNavbar } from '@/features/profile/components/ProfileNavbar'

const Profile = () => {
  return (
		<MainLayout 
    	headerVariant="profile" 
      maxWidth="max-w-7xl" 
    >
			<div className="relative">
				<ProfileHeader />
				<ProfileNavbar />
			</div>
    </MainLayout>
  )
}

export default Profile
