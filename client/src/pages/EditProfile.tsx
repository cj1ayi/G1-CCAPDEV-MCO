import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  userService,
} from '@/features/profile/services'
import {
  MainLayout,
} from '@/components/layout/MainLayout'
import {
  SidebarNav,
} from '@/features/navigation/components'
import {
  YourSpacesWidget,
} from '@/features/spaces/components'
import { Camera, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/ToastContext'
import {
  RichTextEditor,
} from '@/components/ui/RichTextEditor'
import {
  dispatchAuthChange,
} from '@/features/auth/AuthContext'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Button,
} from '@/components/ui'

interface ProfileFormData {
  name: string
  username: string
  bio: string
  location: string
  avatar: string
}

const LeftSidebar = () => (
  <div className="flex flex-col gap-6 px-4">
    <SidebarNav />
    <div
      className={cn(
        'h-px bg-gray-200',
        'dark:bg-gray-800',
      )}
    />
    <YourSpacesWidget />
  </div>
)

function isUsernameTaken(msg: string): boolean {
  const lower = msg.toLowerCase()
  return (
    lower.includes('duplicate') ||
    lower.includes('e11000') ||
    lower.includes('username') ||
    lower.includes('already')
  )
}

function parseUpdateError(
  error: unknown,
): string {
  const msg =
    error instanceof Error
      ? error.message
      : String(error)

  if (isUsernameTaken(msg)) {
    return (
      'That username is already taken.'
      + ' Please choose a different one.'
    )
  }

  if (msg.includes('validation')) {
    return (
      'Some fields are invalid.'
      + ' Please check and try again.'
    )
  }

  return 'Failed to update profile.'
}

const EditProfile = () => {
  const navigate = useNavigate()
  const {
    error: showError,
    success: showSuccess,
  } = useToast()

  const [isLoading, setIsLoading] =
    useState(true)
  const [isSaving, setIsSaving] =
    useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] =
    useState<ProfileFormData>({
      name: '',
      username: '',
      bio: '',
      location: '',
      avatar: '',
    })

  useEffect(() => {
    const load = async () => {
      try {
        const current =
          await userService.getCurrentUser()
        if (!current) {
          navigate('/login')
          return
        }
        setUser(current)
        setFormData({
          name: current.name ?? '',
          username: current.username ?? '',
          bio: current.bio ?? '',
          location: current.location ?? '',
          avatar: current.avatar ?? '',
        })
      } catch {
        showError(
          'Could not load your profile.',
        )
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [navigate])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()
    if (!user) return

    if (!formData.name.trim()) {
      showError('Display name is required.')
      return
    }
    if (!formData.username.trim()) {
      showError('Username is required.')
      return
    }

    setIsSaving(true)
    try {
      await userService.updateUser(
        user.id,
        formData,
      )
      dispatchAuthChange()
      showSuccess('Profile updated!')
      navigate(
        `/profile/${formData.username}`,
      )
    } catch (error) {
      showError(parseUpdateError(error))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div
          className={cn(
            'flex items-center',
            'justify-center min-h-[50vh]',
          )}
        >
          <p className="text-gray-500">
            Loading...
          </p>
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <div
          className={cn(
            'flex items-center',
            'justify-center min-h-[50vh]',
          )}
        >
          <p className="text-gray-500">
            User not found
          </p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      maxWidth="max-w-5xl"
      leftSidebar={<LeftSidebar />}
    >
      <div className="space-y-6">
        <div>
          <h1
            className={cn(
              'text-2xl md:text-3xl',
              'font-bold dark:text-white',
            )}
          >
            Edit Profile
          </h1>
          <p
            className={cn(
              'text-gray-600',
              'dark:text-gray-400 mt-2',
            )}
          >
            Update your profile information
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'flex items-center gap-6',
                )}
              >
                <div className="relative">
                  <img
                    src={
                      formData.avatar
                      || '/default-avatar.png'
                    }
                    alt={formData.name}
                    className={cn(
                      'w-24 h-24 rounded-full',
                      'object-cover bg-gray-200',
                      'dark:bg-gray-700',
                    )}
                  />
                  <button
                    type="button"
                    className={cn(
                      'absolute bottom-0 right-0',
                      'w-8 h-8 rounded-full',
                      'bg-primary text-white',
                      'flex items-center',
                      'justify-center',
                      'hover:bg-primary/90',
                      'transition',
                    )}
                  >
                    <Camera
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                <div className="flex-1">
                  <Input
                    label="Avatar URL"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder={
                      'https://example.com'
                      + '/avatar.jpg'
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Display Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={30}
                showCharCount
                required
              />
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                maxLength={20}
                showCharCount
                required
              />

              <div className="space-y-2">
                <label
                  className={cn(
                    'block text-sm',
                    'font-semibold',
                    'text-gray-700',
                    'dark:text-gray-200',
                  )}
                >
                  Bio
                </label>
                <RichTextEditor
                  value={formData.bio}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      bio: val,
                    }))
                  }
                  placeholder={
                    'Tell us about yourself...'
                  }
                  minHeight="min-h-[150px]"
                  hideHeaders
                  maxLength={200}
                />
              </div>

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                maxLength={100}
                showCharCount
              />
            </CardContent>
          </Card>

          <div
            className={cn(
              'flex items-center',
              'justify-end gap-3 pt-4',
            )}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                navigate(
                  `/profile/${user.username}`,
                )
              }
              leftIcon={
                <X className="w-4 h-4" />
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              leftIcon={
                <Save className="w-4 h-4" />
              }
            >
              {isSaving
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}

export default EditProfile
