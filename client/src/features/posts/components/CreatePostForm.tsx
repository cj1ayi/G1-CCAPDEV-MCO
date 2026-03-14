import { X, ChevronDown, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Space } from '@/features/spaces/services'

import {
  Button,
  Input,
  Textarea,
  Badge,
  Dropdown,
  DropdownItem,
} from '@/components/ui'

import type { CreatePostFormData, CreatePostErrors } from '../hooks/useCreatePost'

interface CreatePostFormProps {
  formData: CreatePostFormData
  tagInput: string
  errors: CreatePostErrors
  joinedSpaces: Space[]
  isLoadingSpaces: boolean
  isSubmitting: boolean
  selectedSpace: Space | null
  onFieldChange: <K extends keyof CreatePostFormData>(
    key: K,
    value: CreatePostFormData[K]
  ) => void
  onTagInputChange: (value: string) => void
  onAddTag: () => void
  onRemoveTag: (tag: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function CreatePostForm({
  formData,
  tagInput,
  errors,
  joinedSpaces,
  isLoadingSpaces,
  isSubmitting,
  selectedSpace,
  onFieldChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onSubmit,
}: CreatePostFormProps) {
  const navigate = useNavigate()

  const selectedLabel = selectedSpace
    ? `r/${selectedSpace.name} — ${selectedSpace.displayName}`
    : 'Select a space...'

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* ── Space ─────────────────────────────────────────────────────────── */}
      <div>
        <label
          className={cn(
            'block text-sm font-semibold mb-2',
            'text-gray-700 dark:text-gray-200'
          )}
        >
          Space <span className="text-red-500">*</span>
        </label>

        {isLoadingSpaces ? (
          <div className="h-11 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ) : joinedSpaces.length === 0 ? (
          <div
            className={cn(
              'p-4 rounded-lg border border-dashed text-center',
              'border-gray-300 dark:border-gray-700'
            )}
          >
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
          <Dropdown
            fullWidth
            trigger={
              <button
                type="button"
                className={cn(
                  'w-full flex items-center justify-between',
                  'rounded-lg border px-4 py-3 text-sm cursor-pointer',
                  'bg-white dark:bg-surface-dark text-gray-900 dark:text-white',
                  'transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20',
                  errors.space
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-primary'
                )}
              >
                <span
                  className={cn(
                    'truncate',
                    !selectedSpace && 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  {selectedLabel}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
              </button>
            }
          >
            {joinedSpaces.map((space) => (
              <DropdownItem
                key={space.name}
                onClick={() => onFieldChange('space', space.name)}
                icon={
                  formData.space === space.name ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <span className="w-4" />
                  )
                }
              >
                r/{space.name} — {space.displayName}
              </DropdownItem>
            ))}
          </Dropdown>
        )}

        {errors.space && (
          <p className="text-xs text-red-500 mt-1">{errors.space}</p>
        )}
      </div>

      {/* ── Title ─────────────────────────────────────────────────────────── */}
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => onFieldChange('title', e.target.value)}
        placeholder="What's your post about?"
        maxLength={300}
        error={errors.title}
        helperText={`${formData.title.length}/300 characters`}
        required
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <Textarea
        label="Content"
        value={formData.content}
        onChange={(e) => onFieldChange('content', e.target.value)}
        placeholder="What are your thoughts?"
        rows={10}
        error={errors.content}
        required
      />

      {/* ── Image URL ─────────────────────────────────────────────────────── */}
      <Input
        label="Image URL (Optional)"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => onFieldChange('imageUrl', e.target.value)}
        placeholder="https://example.com/image.jpg"
      />

      {/* ── Tags ──────────────────────────────────────────────────────────── */}
      <div>
        <label
          className={cn(
            'block text-sm font-semibold mb-2',
            'text-gray-700 dark:text-gray-200'
          )}
        >
          Tags (Optional)
        </label>

        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onAddTag()
              }
            }}
            placeholder="Add a tag..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={onAddTag}
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
                  onClick={() => onRemoveTag(tag)}
                  className="ml-1 hover:text-red-500 transition-colors"
                  aria-label={`Remove tag ${tag}`}
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

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
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
  )
}
