import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { postService } from '@/features/posts/services'
import { ArrowLeft } from 'lucide-react'

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
  const [errors, setErrors] = useState<any>({})

  const SPACES = [
    'AnimoTech',
    'AnimoArts',
    'AnimoScience',
    'AnimoSports',
    'AnimoGaming',
  ]

  const validateForm = () => {
    const newErrors: any = {}
    
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
    
    console.log('🚀 Form submitted')
    console.log('📝 Form data:', formData)
    
    if (!validateForm()) {
      console.log('❌ Validation failed:', errors)
      return
    }

    setIsSubmitting(true)
    
    try {
      console.log('📤 Creating post...')
      const newPost = await postService.createPost({
        title: formData.title,
        content: formData.content,
        space: formData.space,
        imageUrl: formData.imageUrl || undefined,
        tags: formData.tags,
      })
      
      console.log('✅ Post created:', newPost)
      console.log('🔗 Navigating to:', `/post/${newPost.id}`)
      
      navigate(`/post/${newPost.id}`)
    } catch (error) {
      console.error('❌ Failed to create post:', error)
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className={cn(
        'bg-surface-light dark:bg-surface-dark',
        'rounded-lg p-6 mb-6',
        'border border-gray-200 dark:border-gray-800'
      )}>
        <button
          onClick={() => navigate(-1)}
          className={cn(
            'flex items-center gap-2 mb-4',
            'text-gray-600 dark:text-gray-400',
            'hover:text-primary transition-colors'
          )}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
        <h1 className={cn('text-2xl font-bold text-gray-900 dark:text-white mb-2')}>
          Create a Post
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Share your thoughts with the community
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={cn(
          'bg-surface-light dark:bg-surface-dark',
          'rounded-lg p-6',
          'border border-gray-200 dark:border-gray-800'
        )}>
          {/* Space Selection */}
          <div className="mb-6">
            <label className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}>
              Choose a Space *
            </label>
            <select
              value={formData.space}
              onChange={(e) => setFormData({ ...formData, space: e.target.value })}
              className={cn(
                'w-full px-4 py-2 rounded-lg',
                'border border-gray-300 dark:border-gray-700',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white',
                'focus:ring-2 focus:ring-primary focus:border-transparent'
              )}
            >
              <option value="">Select a space...</option>
              {SPACES.map((space) => (
                <option key={space} value={space}>
                  r/{space}
                </option>
              ))}
            </select>
            {errors.space && (
              <p className="text-red-500 text-xs mt-1">{errors.space}</p>
            )}
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's your post about?"
              maxLength={300}
              className={cn(
                'w-full px-4 py-2 rounded-lg',
                'border border-gray-300 dark:border-gray-700',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white',
                'focus:ring-2 focus:ring-primary focus:border-transparent'
              )}
            />
            <div className="flex justify-between mt-1">
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
            <label className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}>
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="What are your thoughts?"
              rows={10}
              className={cn(
                'w-full px-4 py-2 rounded-lg resize-none',
                'border border-gray-300 dark:border-gray-700',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white',
                'focus:ring-2 focus:ring-primary focus:border-transparent'
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">{errors.content}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}>
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className={cn(
                'w-full px-4 py-2 rounded-lg',
                'border border-gray-300 dark:border-gray-700',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white',
                'focus:ring-2 focus:ring-primary focus:border-transparent'
              )}
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-900 dark:text-white'
            )}>
              Tags (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add a tag..."
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg',
                  'border border-gray-300 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white',
                  'focus:ring-2 focus:ring-primary focus:border-transparent'
                )}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || formData.tags.length >= 5}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium',
                  'bg-gray-200 dark:bg-gray-700',
                  'text-gray-900 dark:text-white',
                  'hover:bg-gray-300 dark:hover:bg-gray-600',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors'
                )}
              >
                Add
              </button>
            </div>

            {/* Tag List */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-1',
                      'rounded-full bg-gray-100 dark:bg-gray-800',
                      'text-xs font-medium text-gray-700 dark:text-gray-300'
                    )}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.tags.length}/5 tags
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className={cn(
              'px-6 py-2 rounded-lg font-medium',
              'bg-gray-200 dark:bg-gray-700',
              'text-gray-900 dark:text-white',
              'hover:bg-gray-300 dark:hover:bg-gray-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors'
            )}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'px-6 py-2 rounded-lg font-medium min-w-[120px]',
              'bg-primary text-white hover:bg-primary-dark',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors'
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                Posting...
              </span>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
