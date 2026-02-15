import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Input, Textarea, Select, Button, Card } from '@/components/ui'
import { X, Image as ImageIcon, Tag as TagIcon } from 'lucide-react'
import type { PostFormData, PostFormErrors, Post } from '../types'

interface PostFormProps {
  initialData?: Post
  mode: 'create' | 'edit'
  onSubmit: (data: PostFormData) => Promise<void>
  onCancel?: () => void
}

const AVAILABLE_SPACES = [
  { value: 'AnimoTech', label: 'AnimoTech' },
  { value: 'AnimoArts', label: 'AnimoArts' },
  { value: 'AnimoScience', label: 'AnimoScience' },
  { value: 'AnimoSports', label: 'AnimoSports' },
  { value: 'AnimoGaming', label: 'AnimoGaming' },
]

const FLAIR_OPTIONS = [
  { value: '', label: 'No Flair' },
  { value: 'Question', label: 'Question' },
  { value: 'Discussion', label: 'Discussion' },
  { value: 'News', label: 'News' },
  { value: 'Marketplace', label: 'Marketplace' },
]

export const PostForm = ({ 
  initialData, 
  mode, 
  onSubmit, 
  onCancel 
}: PostFormProps) => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    space: initialData?.space || '',
    flair: initialData?.flair,
    imageUrl: initialData?.imageUrl || '',
    tags: initialData?.tags || [],
  })

  const [errors, setErrors] = useState<PostFormErrors>({})
  const [tagInput, setTagInput] = useState('')

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: PostFormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 300) {
      newErrors.title = 'Title must be less than 300 characters'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters'
    }

    if (!formData.space) {
      newErrors.space = 'Please select a space'
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Failed to submit post:', error)
      setErrors({ 
        title: 'Failed to save post. Please try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle tag addition
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    
    if (!tag) return
    
    if (formData.tags.length >= 5) {
      setErrors({ ...errors, tags: 'Maximum 5 tags allowed' })
      return
    }
    
    if (formData.tags.includes(tag)) {
      setErrors({ ...errors, tags: 'Tag already added' })
      return
    }

    setFormData({
      ...formData,
      tags: [...formData.tags, tag],
    })
    setTagInput('')
    setErrors({ ...errors, tags: undefined })
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    })
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate(-1)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        {/* Space Selection */}
        <div className="mb-6">
          <label
            className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}
          >
            Choose a Space *
          </label>
          <Select
            value={formData.space}
            onChange={(e) =>
              setFormData({ ...formData, space: e.target.value })
            }
            disabled={mode === 'edit'}
          >
            <option value="">Select a space...</option>
            {AVAILABLE_SPACES.map((space) => (
              <option key={space.value} value={space.value}>
                r/{space.label}
              </option>
            ))}
          </Select>
          {errors.space && (
            <p className="text-red-500 text-xs mt-1">{errors.space}</p>
          )}
          {mode === 'edit' && (
            <p className="text-xs text-gray-500 mt-1">
              Space cannot be changed after posting
            </p>
          )}
        </div>

        {/* Title */}
        <div className="mb-6">
          <label
            className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}
          >
            Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="What's your post about?"
            maxLength={300}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.title ? (
              <p className="text-red-500 text-xs">{errors.title}</p>
            ) : (
              <span className="text-xs text-gray-500">
                {formData.title.length}/300 characters
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label
            className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}
          >
            Content *
          </label>
          <Textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="What are your thoughts?"
            rows={10}
            className="resize-none"
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">{errors.content}</p>
          )}
        </div>

        {/* Flair */}
        <div className="mb-6">
          <label
            className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}
          >
            Flair (Optional)
          </label>
          <Select
            value={formData.flair || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                flair: e.target.value as any,
              })
            }
          >
            {FLAIR_OPTIONS.map((flair) => (
              <option key={flair.value} value={flair.value}>
                {flair.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Image URL */}
        <div className="mb-6">
          <label
            className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image URL (Optional)
            </div>
          </label>
          <Input
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
            type="url"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>
          )}
          
          {/* Image Preview */}
          {formData.imageUrl && isValidUrl(formData.imageUrl) && (
            <div className="mt-3">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className={cn(
                  'w-full rounded-lg object-cover max-h-64',
                  'border border-gray-200 dark:border-gray-700'
                )}
                onError={() => {
                  setErrors({
                    ...errors,
                    imageUrl: 'Failed to load image',
                  })
                }}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label
            className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}
          >
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4" />
              Tags (Optional)
            </div>
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
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="secondary"
              disabled={!tagInput.trim() || formData.tags.length >= 5}
            >
              Add
            </Button>
          </div>
          
          {errors.tags && (
            <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
          )}

          {/* Tag List */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'inline-flex items-center gap-1',
                    'px-3 py-1 rounded-full',
                    'bg-gray-100 dark:bg-gray-800',
                    'text-xs font-medium',
                    'text-gray-700 dark:text-gray-300'
                  )}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className={cn(
                      'ml-1 hover:text-red-500',
                      'transition-colors'
                    )}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.tags.length}/5 tags
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[18px]">
                progress_activity
              </span>
              {mode === 'create' ? 'Posting...' : 'Saving...'}
            </span>
          ) : (
            <span>{mode === 'create' ? 'Post' : 'Save Changes'}</span>
          )}
        </Button>
      </div>
    </form>
  )
}
