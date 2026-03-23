import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  userService,
} from '@/features/profile/services'
import {
  useAuth,
} from '@/features/auth/hooks'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { YourSpacesWidget } from '@/features/spaces/components'
import { Camera, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/ui/Toast'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { dispatchAuthChange } from '@/features/auth/AuthContext'

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Input,
  Button
} from '@/components/ui'

const EditProfile = () => {
  const navigate = useNavigate()
  const {
    toasts,
    error: showError,
    removeToast,
  } = useToast()
  const { user, isLoading: authLoading } =
    useAuth()
  const [isSaving, setIsSaving] =
    useState(false)
  const [didInit, setDidInit] =
    useState(false)

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

  // Redirect if not logged in
  if (!authLoading && !user) {
    navigate('/login')
  }

  // Populate form once user loads
  if (user && !didInit) {
    setDidInit(true)
    setFormData({
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
      location: user.location || '',
      avatar: user.avatar || '',
      twitter:
        ((user as unknown as Record<string, string>))
          .twitter || '',
      github:
        ((user as unknown as Record<string, string>))
          .github || '',
      linkedin:
        ((user as unknown as Record<string, string>))
          .linkedin || '',
    })
  }

  const isLoading = authLoading || !didInit

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSaving(true)
    try {
      await userService.updateUser(user.id, formData)
      dispatchAuthChange()
      navigate(`/profile/${formData.username}`)
    } catch (error) {
      console.error('Error updating profile:', error)
      showError('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <MainLayout><div className="flex items-center justify-center min-h-[50vh]"><p className="text-gray-500">Loading...</p></div></MainLayout>
  if (!user) return <MainLayout><div className="flex items-center justify-center min-h-[50vh]"><p className="text-gray-500">User not found</p></div></MainLayout>

  return (
    <MainLayout
      maxWidth="max-w-5xl"
      leftSidebar={<div className="flex flex-col gap-6 px-4"><SidebarNav /><div className="h-px bg-gray-200 dark:bg-gray-800" /><YourSpacesWidget /></div>}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Edit Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Update your profile information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Profile Picture</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img src={formData.avatar || '/default-avatar.png'} alt={formData.name} className="w-24 h-24 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
                  <button type="button" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition"><Camera className="w-4 h-4" /></button>
                </div>
                <div className="flex-1">
                  <Input label="Avatar URL" name="avatar" value={formData.avatar} onChange={handleInputChange} placeholder="https://example.com/avatar.jpg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="Display Name" name="name" value={formData.name} onChange={handleInputChange} maxLength={30} showCharCount required />
              <Input label="Username" name="username" value={formData.username} onChange={handleInputChange} maxLength={20} showCharCount required />

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Bio</label>
                <RichTextEditor
                  value={formData.bio}
                  onChange={(val) => setFormData(prev => ({ ...prev, bio: val }))}
                  placeholder="Tell us about yourself..."
                  minHeight="min-h-[150px]"
                  hideHeaders={true}
                  maxLength={200}
                />
              </div>

              <Input label="Location" name="location" value={formData.location} onChange={handleInputChange} placeholder="City, Country" maxLength={100} showCharCount />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate(`/profile/${user.username}`)} leftIcon={<X className="w-4 h-4" />}>Cancel</Button>
            <Button type="submit" disabled={isSaving} leftIcon={<Save className="w-4 h-4" />}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </div>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} duration={toast.duration} onClose={() => removeToast(toast.id)} />
      ))}
    </MainLayout>
  )
}

export default EditProfile
