import { MainLayout } from '@/components/layout/MainLayout'
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar'

const Profile = () => {
  return (
    <MainLayout 
      headerVariant="profile" 
      maxWidth="max-w-7xl" 
    >
      <ProfileAvatar />
    </MainLayout>
  )
}

export default Profile
