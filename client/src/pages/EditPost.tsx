import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { postService } from '@/features/posts/services'
import { getPostById as getMockPost } from '@/lib/mockData'
import { ArrowLeft, X, Loader2 } from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from '@/components/ui'
import { cn } from '@/lib/utils'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  // Fetch post data - check both sources
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Post ID is required')
        setIsLoading(false)
        return
      }

      try {
        console.log('Fetching post:', id)
        
        // Try postService first
        let post = await postService.getPostById(id)
        console.log('Post from postService:', post)
        
        // If not found, try mockData
        if (!post) {
          console.log('Post not found in postService, trying mockData...')
          post = getMockPost(id)
          console.log('Post from mockData:', post)
        }
        
        if (!post) {
          setError('Post not found')
          return
        }

        if (!post.isOwner) {
          setError('You do not have permission to edit this post')
          return
        }

        console.log('Post loaded:', post)
        setFormData({
          title: post.title,
          content: post.content,
          space: post.space,
          imageUrl: post.imageUrl || '',
          tags: post.tags || [],
        })
      } catch (err) {
        console.error('Error loading post:', err)
        setError('Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Saving changes...')
    console.log('Form data:', formData)
    
    if (!validateForm()) {
      console.log('Validation failed')
      return
    }

    if (!id) return

    setIsSubmitting(true)
    
    try {
      console.log('Updating post:', id)
      await postService.updatePost(id, {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
        tags: formData.tags,
      })
      
      console.log('Post updated successfully')
      console.log('Navigating to:', `/post/${id}`)
      
      navigate(`/post/${id}`)
    } catch (error) {
      console.error('Failed to update post:', error)
      alert('Failed to update post. Check console for details.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    
    if (!tag) return
    if (formData.tags.length >= 5) {
      alert('Maximum 5 tags allowed')
      return
    }
    if (formData.tags.includes(tag)) {
      alert('Tag already added')
      return
    }
    
    setFormData({ ...formData, tags: [...formData.tags, tag] })
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 mt-4">
            Loading post...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <CardTitle className="mb-4">{error}</CardTitle>
            <Button
              variant="primary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/post/${id}`)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="w-fit mb-4 -ml-2"
          >
            Back
          </Button>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>
            Make changes to your post
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Space (Read-only) */}
            <div>
              <label className={cn(
                "block text-sm font-semibold mb-2",
                "text-gray-700 dark:text-gray-200")}>
                Space
              </label>
              <div className={cn(
                "px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800",
                "text-gray-600 dark:text-gray-400 border border-gray-300",
                "dark:border-gray-700")}
              >
                r/{formData.space}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Space cannot be changed after posting
              </p>
            </div>

            {/* Title */}
            <Input
              label="Title"
              placeholder="What's your post about?"
              value={formData.title}
              onChange={(e) => setFormData({ 
                ...formData, 
                title: e.target.value 
              })}
              error={errors.title}
              helperText={`${formData.title.length}/300 characters`}
              maxLength={300}
              required
            />

            {/* Content */}
            <Textarea
              label="Content"
              placeholder="What are your thoughts?"
              value={formData.content}
              onChange={(e) => setFormData({ 
                ...formData, 
                content: e.target.value 
              })}
              error={errors.content}
              rows={10}
              required
            />

            {/* Image URL */}
            <Input
              label="Image URL"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ 
                ...formData, 
                imageUrl: e.target.value 
              })}
              helperText="Optional: Add an image to your post"
            />

            {/* Tags */}
            <div className="space-y-2">
              <label className={cn(
                "block text-sm font-semibold text-gray-700 dark:text-gray-200"
                )}
              >
                Tags <span className="text-gray-500 font-normal">
                  (Optional)
                </span>
              </label>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
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

              {/* Tag List */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="pl-3 pr-2 gap-1.5"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500 transition-colors"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formData.tags.length}/5 tags
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
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
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
