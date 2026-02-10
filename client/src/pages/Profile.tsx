import { MainLayout } from '@/components/layout/MainLayout'
import { ProfileHeader } from '@/features/profile/components/ProfileHeader'

const Profile = () => {
  return (
		<MainLayout 
    	headerVariant="profile" 
      maxWidth="max-w-7xl" 
    >
      <ProfileHeader />
    </MainLayout>
  )
}

export default Profile
