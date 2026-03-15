import { X, ChevronDown, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Space } from '@/features/spaces/services'
import { useRef, useState } from 'react'
import { MarkdownToolbar } from '@/components/ui/MarkdownToolbar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import {
  Button,
  Input,
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isPreview, setIsPreview] = useState(false)

  const selectedLabel = selectedSpace
    ? `r/${selectedSpace.name} — ${selectedSpace.displayName}`
    : 'Select a space...'

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* Space Selection */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Space <span className="text-red-500">*</span>
        </label>
        <Dropdown
          fullWidth
          trigger={
            <button
              type="button"
              className={cn(
                'w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm',
                'bg-white dark:bg-surface-dark text-gray-900 dark:text-white',
                errors.space ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
              )}
            >
              <span className={!selectedSpace ? 'text-gray-400' : ''}>{selectedLabel}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          }
        >
          {joinedSpaces.map((space) => (
            <DropdownItem
              key={space.name}
              onClick={() => onFieldChange('space', space.name)}
              icon={formData.space === space.name && <Check className="h-4 w-4 text-primary" />}
            >
              r/{space.name} — {space.displayName}
            </DropdownItem>
          ))}
        </Dropdown>
        {errors.space && <p className="text-xs text-red-500 mt-1">{errors.space}</p>}
      </div>

      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => onFieldChange('title', e.target.value)}
        placeholder="What's your post about?"
        maxLength={300}
        error={errors.title}
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Content <span className="text-red-500">*</span>
        </label>
        <div className={cn(
          "border rounded-lg overflow-hidden bg-white dark:bg-surface-dark",
          errors.content ? "border-red-500" : "border-gray-200 dark:border-gray-700"
        )}>
          <MarkdownToolbar 
            textareaRef={textareaRef} 
            value={formData.content} 
            onChange={(val) => onFieldChange('content', val)}
            isPreview={isPreview}
            onTogglePreview={setIsPreview}
          />
          {isPreview ? (
            <div className="w-full p-4 min-h-[200px] bg-white dark:bg-gray-900 prose prose-sm dark:prose-invert max-w-none">
              {formData.content.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData.content}</ReactMarkdown>
              ) : (
                <p className="text-gray-400 italic">Nothing to preview</p>
              )}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={formData.content}
              onChange={(e) => onFieldChange('content', e.target.value)}
              placeholder="What are your thoughts?"
              rows={10}
              className="w-full p-4 bg-transparent outline-none text-sm resize-y min-h-[200px]"
            />
          )}
        </div>
        {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
      </div>

      <Input
        label="Image URL (Optional)"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => onFieldChange('imageUrl', e.target.value)}
        placeholder="https://example.com/image.jpg"
      />

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Tags (Optional)
        </label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            placeholder="Add a tag..."
            className="flex-1"
          />
          <Button type="button" variant="secondary" onClick={onAddTag}>Add</Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                #{tag}
                <button type="button" onClick={() => onRemoveTag(tag)} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>Post</Button>
      </div>
    </form>
  )
}
