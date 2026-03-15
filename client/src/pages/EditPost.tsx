import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { postService } from '@/features/posts/services'
import { LoadingSpinner, ErrorState } from '@/components/shared'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/ToastContext'
import { RichTextEditor } from '@/components/ui/RichTextEditor'

import { 
  Card, 
  Button, 
  Input, 
  Badge 
} from '@/components/ui'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { error: showError, warning: showWarning, success: showSuccess} = useToast()
  
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
        const post = await postService.getPostById(id)
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
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [id])

  const validateForm = () => {
    const validationErrors = postService.validatePostForm(
      { title: formData.title, content: formData.content }, 
      true
    )
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !id) return
    setIsSubmitting(true)
    try {
      await postService.updatePost(id, {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
        tags: formData.tags,
      })
      showSuccess('Successfully Update Post')
      navigate(`/post/${id}`)
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to load post')
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
    setFormData({ ...formData, tags: [...formData.tags, tagInput.trim().toLowerCase()] })
    setTagInput('')
  }

  if (isLoading) return <MainLayout maxWidth="max-w-6xl"><LoadingSpinner text="Loading post..." /></MainLayout>
  if (error) return <MainLayout maxWidth="max-w-6xl"><ErrorState title={error} onRetry={() => navigate(-1)} /></MainLayout>

  return (
    <MainLayout
      maxWidth="max-w-6xl"
      leftSidebar={<div className="flex flex-col gap-6"><SidebarNav /><div className="h-px bg-gray-200 dark:bg-gray-800" /></div>}
    >
      <div className="w-full">
        <Card className="mb-6">
          <button onClick={() => navigate(`/post/${id}`)} className="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Edit Post</h1>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Space</label>
              <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700">r/{formData.space}</div>
            </div>

            <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} maxLength={300} error={errors.title} required />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Content <span className="text-red-500">*</span></label>
              <RichTextEditor
                value={formData.content}
                onChange={(val) => setFormData({ ...formData, content: val })}
                placeholder="What are your thoughts?"
                error={!!errors.content}
              />
              {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
            </div>

            <Input label="Image URL (Optional)" type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" />

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="secondary" onClick={() => navigate(`/post/${id}`)}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
   </MainLayout>
  )
}
