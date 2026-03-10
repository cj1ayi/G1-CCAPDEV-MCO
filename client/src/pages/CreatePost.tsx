import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'
import { postService } from '@/features/posts/services'
import { spaceService } from '@/features/spaces/services/spaceService'
import { Space } from '@/features/spaces/services'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { YourSpacesWidget } from '@/features/spaces/components'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/ToastContext'

import { 
  Card, 
  Button, 
  Input, 
  Textarea, 
  Badge,
  Select
} from '@/components/ui'

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { 
    error: showError, 
    warning: showWarning, 
    success: showSuccess 
  } = useToast()

  const [joinedSpaces, setJoinedSpaces] = useState<Space[]>([])
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    space: searchParams.get('space') || '',
    imageUrl: '',
    tags: [] as string[],
  })

  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    const loadJoinedSpaces = async () => {
      try {
        const { data } = await spaceService.getSpaces()
        const joined = data.filter(s => s.isJoined)
        setJoinedSpaces(joined)
      } catch (err) {
        console.error('Failed to load spaces:', err)
      } finally {
        setIsLoadingSpaces(false)
      }
    }
    loadJoinedSpaces()
  }, [])

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.space.trim()) newErrors.space = 'Please select a space'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const newPost = await postService.createPost({
        title: formData.title,
        content: formData.content,
        space: formData.space,
        imageUrl: formData.imageUrl || undefined,
        tags: formData.tags,
      })
      navigate(`/post/${newPost.id}`)
      showSuccess('Successfuly created Post')
    } catch (error) {
      showError(
        (error as Error).message || 'Failed to create post. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (!tag) return
    if (formData.tags.length >= 5) { 
      showWarning('Maximum 5 tags allowed'); 
      return 
    }
    if (formData.tags.includes(tag)) { 
      showWarning('Tag already added'); 
      return 
    }
    setFormData({ ...formData, tags: [...formData.tags, tag] })
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter(tag => tag !== tagToRemove) 
    })
  }

  return (
    <MainLayout
      maxWidth="max-w-6xl"
      leftSidebar={
        <div className="space-y-6">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </div>
      }
    >
      <div className="w-full">
        <Card className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className={cn(
              "flex items-center gap-2 mb-4 text-gray-600",
              "dark:text-gray-400 hover:text-primary transition-colors")}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create a Post
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Share your thoughts with the community
          </p>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Space Dropdown */}
            <div>
              <label className={cn(
                "block text-sm font-semibold mb-2",
                "text-gray-700 dark:text-gray-200"
              )}>
                Space <span className="text-red-500">*</span>
              </label>
              {isLoadingSpaces ? (
                <div 
                  className="h-11 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" 
                />
              ) : joinedSpaces.length === 0 ? (
                <div className={cn(
                  "p-4 rounded-lg border border-dashed",
                  "border-gray-300 dark:border-gray-700 text-center"
                )}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You haven't joined any spaces yet.{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/spaces')}
                      className="text-primary hover:underline font-medium"
                    >
                      Browse spaces
                    </button>
                  </p>
                </div>
              ) : (
                <Select
                  value={formData.space}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    space: e.target.value 
                  })}
                  options={[
                    { value: '', label: 'Select a space...' },
                    ...joinedSpaces.map(s => ({
                      value: s.name,
                      label: `r/${s.name} — ${s.displayName}`
                    }))
                  ]}
                  error={errors.space}
                />
              )}
              {errors.space && (
                <p className="text-xs text-red-500 mt-1">{errors.space}</p>
              )}
            </div>

            {/* Title */}
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's your post about?"
              maxLength={300}
              error={errors.title}
              helperText={`${formData.title.length}/300 characters`}
              required
            />

            {/* Content */}
            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ 
                ...formData, 
                content: e.target.value 
              })}
              placeholder="What are your thoughts?"
              rows={10}
              error={errors.content}
              required
            />

            {/* Image URL */}
            <Input
              label="Image URL (Optional)"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ 
                ...formData, 
                imageUrl: e.target.value 
              })}
              placeholder="https://example.com/image.jpg"
            />

            {/* Tags */}
            <div>
              <label className={cn(
                "block text-sm font-semibold mb-2",
                "text-gray-700 dark:text-gray-200")}>
                Tags (Optional)
              </label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); handleAddTag() }
                  }}
                  placeholder="Add a tag..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 5}
                >
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="flex items-center gap-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {formData.tags.length}/5 tags
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || joinedSpaces.length === 0}
                isLoading={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
