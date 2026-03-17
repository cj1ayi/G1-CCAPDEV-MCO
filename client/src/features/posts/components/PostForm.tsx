import { X, ChevronDown, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Space } from '@/features/spaces/services'
import {
  RichTextEditor,
} from '@/components/ui/RichTextEditor'
import {
  Button,
  Input,
  Badge,
  Dropdown,
  DropdownItem,
} from '@/components/ui'

export interface PostFormData {
  title: string
  content: string
  space: string
  imageUrl: string
  tags: string[]
}

export interface PostFormErrors {
  title?: string
  content?: string
  space?: string
  imageUrl?: string
}

interface PostFormProps {
  mode: 'create' | 'edit'
  formData: PostFormData
  tagInput: string
  errors: PostFormErrors
  isSubmitting: boolean
  /** Only needed in create mode. */
  joinedSpaces?: Space[]
  /** Only needed in create mode. */
  selectedSpace?: Space | null
  onFieldChange: <K extends keyof PostFormData>(
    key: K,
    value: PostFormData[K],
  ) => void
  onTagInputChange: (value: string) => void
  onAddTag: () => void
  onRemoveTag: (tag: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel?: () => void
}

function SpaceSelector({
  formData,
  errors,
  joinedSpaces,
  selectedSpace,
  onFieldChange,
}: Pick<
  PostFormProps,
  | 'formData'
  | 'errors'
  | 'joinedSpaces'
  | 'selectedSpace'
  | 'onFieldChange'
>) {
  const spaces = joinedSpaces ?? []
  const label = selectedSpace
    ? `r/${selectedSpace.name} — ${selectedSpace.displayName}`
    : 'Select a space...'

  const borderClass = errors.space
    ? 'border-red-500'
    : 'border-gray-200 dark:border-gray-700'

  return (
    <div>
      <label
        className={cn(
          'block text-sm font-semibold mb-2',
          'text-gray-700 dark:text-gray-200',
        )}
      >
        Space <span className="text-red-500">*</span>
      </label>
      <Dropdown
        fullWidth
        trigger={
          <button
            type="button"
            className={cn(
              'w-full flex items-center',
              'justify-between rounded-lg',
              'border px-4 py-3 text-sm',
              'bg-white dark:bg-surface-dark',
              'text-gray-900 dark:text-white',
              borderClass,
            )}
          >
            <span
              className={
                selectedSpace ? '' : 'text-gray-400'
              }
            >
              {label}
            </span>
            <ChevronDown
              className="h-4 w-4 text-gray-400"
            />
          </button>
        }
      >
        {spaces.map((space) => (
          <DropdownItem
            key={space.name}
            onClick={() => {
              onFieldChange('space', space.name)
            }}
            icon={
              formData.space === space.name && (
                <Check
                  className="h-4 w-4 text-primary"
                />
              )
            }
          >
            r/{space.name} — {space.displayName}
          </DropdownItem>
        ))}
      </Dropdown>
      {errors.space && (
        <p className="text-xs text-red-500 mt-1">
          {errors.space}
        </p>
      )}
    </div>
  )
}

function ReadOnlySpace({ space }: { space: string }) {
  return (
    <div>
      <label
        className={cn(
          'block text-sm font-semibold mb-2',
          'text-gray-700 dark:text-gray-200',
        )}
      >
        Space
      </label>
      <div
        className={cn(
          'px-4 py-2 rounded-lg',
          'bg-gray-100 dark:bg-gray-800',
          'text-gray-600 dark:text-gray-400',
          'border border-gray-300',
          'dark:border-gray-700',
        )}
      >
        r/{space}
      </div>
    </div>
  )
}

function TagsSection({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}: {
  tags: string[]
  tagInput: string
  onTagInputChange: (v: string) => void
  onAddTag: () => void
  onRemoveTag: (tag: string) => void
}) {
  return (
    <div>
      <label
        className={cn(
          'block text-sm font-semibold mb-2',
          'text-gray-700 dark:text-gray-200',
        )}
      >
        Tags (Optional)
      </label>
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={(e) => onTagInputChange(e.target.value)}
          placeholder="Add a tag..."
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={onAddTag}
        >
          Add
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export function PostForm({
  mode,
  formData,
  tagInput,
  errors,
  isSubmitting,
  joinedSpaces,
  selectedSpace,
  onFieldChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onSubmit,
  onCancel,
}: PostFormProps) {
  const navigate = useNavigate()
  const isEdit = mode === 'edit'

  const handleCancel = () => {
    if (onCancel) return onCancel()
    navigate(-1)
  }

  const submitLabel = isEdit ? 'Save Changes' : 'Post'

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
      noValidate
    >
      {/* Space — selector or read-only */}
      {isEdit ? (
        <ReadOnlySpace space={formData.space} />
      ) : (
        <SpaceSelector
          formData={formData}
          errors={errors}
          joinedSpaces={joinedSpaces}
          selectedSpace={selectedSpace}
          onFieldChange={onFieldChange}
        />
      )}

      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => {
          onFieldChange('title', e.target.value)
        }}
        placeholder="What's your post about?"
        maxLength={300}
        error={errors.title}
        required
      />

      {/* Content */}
      <div className="space-y-2">
        <label
          className={cn(
            'block text-sm font-semibold',
            'text-gray-700 dark:text-gray-200',
          )}
        >
          Content{' '}
          <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          value={formData.content}
          onChange={(val) => {
            onFieldChange('content', val)
          }}
          placeholder="What are your thoughts?"
          error={!!errors.content}
        />
        {errors.content && (
          <p className="text-xs text-red-500">
            {errors.content}
          </p>
        )}
      </div>

      <Input
        label="Image URL (Optional)"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => {
          onFieldChange('imageUrl', e.target.value)
        }}
        placeholder="https://example.com/image.jpg"
        error={errors.imageUrl}
      />

      <TagsSection
        tags={formData.tags}
        tagInput={tagInput}
        onTagInputChange={onTagInputChange}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />

      {/* Actions */}
      <div
        className={cn(
          'flex gap-3 justify-end pt-4',
          'border-t border-gray-100',
          'dark:border-gray-800',
        )}
      >
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
