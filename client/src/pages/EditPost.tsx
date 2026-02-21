import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { postService } from '@/features/posts/services'
import { LoadingSpinner, ErrorState } from '@/components/shared'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/ui/Toast'

import { 
  Card, 
  Button, 
  Input, 
  Textarea, 
  Badge 
} from '@/components/ui'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toasts, error: showError, warning: showWarning, removeToast } = useToast()
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    space: '',
    imageUrl: '',
    tags: [] as string[],
  })
  
  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Post ID is required')
        setIsLoading(false)
        return
      }

      try {
        const { 
          post, 
          error: fetchError 
        } = await postService.getPostForEdit(id)
        
        if (fetchError) {
          setError(fetchError)
          return
        }

        if (post) {
          setFormData({
            title: post.title,
            content: post.content,
            space: post.space,
            imageUrl: post.imageUrl || '',
            tags: post.tags || [],
          })
        }
      } catch (err) {
        setError('Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const validateForm = () => {
    const validationErrors = postService.validatePostForm(
      {
        title: formData.title,
        content: formData.content,
      },
      true
    )
    
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    if (!id) return

    setIsSubmitting(true)
    
    try {
      await postService.updatePost(id, {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
        tags: formData.tags,
      })
      
      navigate(`/post/${id}`)
    } catch (error) {
      showError('Failed to update post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    const validation = postService.validateTag(tagInput, formData.tags)
    
    if (!validation.valid) {
      showWarning(validation.error || 'Invalid tag')
      return
    }
    
    const tag = tagInput.trim().toLowerCase()
    setFormData({ ...formData, tags: [...formData.tags, tag] })
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    })
  }

  if (isLoading) {
    return (
      <MainLayout maxWidth="max-w-6xl">
        <LoadingSpinner text="Loading post..." />
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout maxWidth="max-w-6xl">
        <ErrorState
          title={error}
          onRetry={() => navigate(-1)}
        />
      </MainLayout>
    )
  }

  return (
    <MainLayout
      maxWidth="max-w-6xl"
      leftSidebar={
        <div className="flex flex-col gap-6">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
        </div>
      }
    >
      <div className="w-full">
        <Card className="mb-6">
          <button
            onClick={() => navigate(`/post/${id}`)}
            className={cn(
              "flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400",
              "hover:text-primary transition-colors")}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>

          <h1 className={cn(
            "text-2xl font-bold text-gray-900 dark:text-white mb-2")}>
            Edit Post
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Make changes to your post
          </p>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={cn(
                "block text-sm font-semibold mb-2",
                "text-gray-700 dark:text-gray-200")}>
                Space
              </label>
              <div className={cn(
                "px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800",
                "text-gray-600 dark:text-gray-400 border border-gray-300",
                "dark:border-gray-700")}>
                r/{formData.space}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Space cannot be changed after posting
              </p>
            </div>

            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ 
                ...formData, title: e.target.value })}
              placeholder="What's your post about?"
              maxLength={300}
              error={errors.title}
              helperText={`${formData.title.length}/300 characters`}
              required
            />

            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ 
                ...formData, content: e.target.value })}
              placeholder="What are your thoughts?"
              rows={10}
              error={errors.content}
              required
            />

            <Input
              label="Image URL (Optional)"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ 
                ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />

            <div>
              <label className={cn(
                "block text-sm font-semibold mb-2 text-gray-700",
                "dark:text-gray-200")}>
                Tags (Optional)
              </label>

              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
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

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/post/${id}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="min-w-[120px]"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
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
