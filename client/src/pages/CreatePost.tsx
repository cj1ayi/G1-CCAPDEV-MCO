import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '@/features/posts/services'
import { ArrowLeft, X } from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from '@/components/ui'
import { cn } from '@/lib/utils'

export default function CreatePostPage() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    space: '',
    imageUrl: '',
    tags: [] as string[],
  })
  
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const SPACES = [
    'AnimoTech',
    'AnimoArts',
    'AnimoScience',
    'AnimoSports',
    'AnimoGaming',
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }
    
    if (!formData.space) {
      newErrors.space = 'Please select a space'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submitted')
    console.log('Form data:', formData)
    
    if (!validateForm()) {
      console.log('Validation failed:', errors)
      return
    }

    setIsSubmitting(true)
    
    try {
      console.log('Creating post...')
      const newPost = await postService.createPost({
        title: formData.title,
        content: formData.content,
        space: formData.space,
        imageUrl: formData.imageUrl || undefined,
        tags: formData.tags,
      })
      
      console.log('Post created:', newPost)
      console.log('Navigating to:', `/post/${newPost.id}`)
      
      navigate(`/post/${newPost.id}`)
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post. Check console for details.')
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

  return (
    <div className="w-full">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="w-fit mb-4 -ml-2"
          >
            Back
          </Button>
          <CardTitle>Create a Post</CardTitle>
          <CardDescription>
            Share your thoughts with the community
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Space Selection */}
            <Select
              label="Choose a Space"
              placeholder="Select a space..."
              value={formData.space}
              onChange={(e) => setFormData({ 
                ...formData, 
                space: e.target.value 
              })}
              error={errors.space}
              required
            >
              <option value="">Select a space...</option>
              {SPACES.map((space) => (
                <option key={space} value={space}>
                  r/{space}
                </option>
              ))}
            </Select>

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
                (Optional)</span>
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
            onClick={() => navigate(-1)}
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
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}
