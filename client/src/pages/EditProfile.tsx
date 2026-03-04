import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '@/features/profile/services'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { YourSpacesWidget } from '@/features/spaces/components'
import { Camera, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/ui/Toast'

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Input,
  Textarea,
  Button
} from '@/components/ui'

const EditProfile = () => {
  const navigate = useNavigate()
  const { toasts, error: showError, removeToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    avatar: '',
    twitter: '',
    github: '',
    linkedin: '',
  })

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser()

        if (!currentUser) {
          navigate('/login')
          return
        }

        setUser(currentUser)
        setFormData({
          name: currentUser.name || '',
          username: currentUser.username || '',
          bio: currentUser.bio || '',
          location: currentUser.location || '',
          avatar: currentUser.avatar || '',
          twitter: currentUser.twitter || '',
          github: currentUser.github || '',
          linkedin: currentUser.linkedin || '',
        })
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [navigate])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSaving(true)

    try {
      await userService.updateUser(user.id, formData)
      navigate(`/profile/${formData.username}`)
    } catch (error) {
      console.error('Error updating profile:', error)
      showError('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) navigate(`/profile/${user.username}`)
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-500 dark:text-gray-400">User not found</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      maxWidth="max-w-5xl"
      leftSidebar={
        <div className="flex flex-col gap-6 px-4">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your profile information and customize how others see you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={formData.avatar || '/default-avatar.png'}
                    alt={formData.name}
                    className={cn(
                      "w-24 h-24 rounded-full object-cover",
                      "bg-gray-200 dark:bg-gray-700")}
                  />
                  <button
                    type="button"
                    className={cn(
                      'absolute bottom-0 right-0',
                      'w-8 h-8 rounded-full',
                      'bg-primary text-white',
                      'flex items-center justify-center',
                      'hover:bg-primary/90 transition'
                    )}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <Input
                    label="Avatar URL"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter a URL for your profile picture
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Display Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="@username"
                required
              />
              <Textarea
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={4}
              />
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/username"
              />
              <Input
                label="GitHub"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
              />
              <Input
                label="LinkedIn"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              leftIcon={<X className="w-4 h-4" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </MainLayout>
  )
}

export default EditProfile
