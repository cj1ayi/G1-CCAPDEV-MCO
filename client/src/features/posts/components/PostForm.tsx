import {
  X,
  ChevronDown,
  Check,
  Search,
} from 'lucide-react'
import {
  useState,
  useRef,
  useEffect,
} from 'react'
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
} from '@/components/ui'
import {
  FLAIR_COLORS,
} from '@/features/posts/constants'

export type PostFlair =
  | 'Question'
  | 'News'
  | 'Marketplace'
  | 'Discussion'

export const POST_FLAIRS: PostFlair[] = [
  'Question',
  'News',
  'Marketplace',
  'Discussion',
]

export interface PostFormData {
  title: string
  content: string
  space: string
  imageUrl: string
  tags: string[]
  flair?: PostFlair
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
  allSpaces?: Space[]
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

// ── Helpers ─────────────────────────

const matchesQuery = (
  space: Space,
  query: string,
) => {
  const q = query.toLowerCase()
  return (
    space.name.toLowerCase().includes(q) ||
    space.displayName.toLowerCase().includes(q)
  )
}

const getFiltered = (
  spaces: Space[],
  query: string,
) => {
  if (!query.trim()) {
    return spaces.filter((s) => s.isJoined)
  }
  return spaces.filter((s) =>
    matchesQuery(s, query),
  )
}

const getSectionLabel = (query: string) =>
  query.trim() ? 'Search Results' : 'Your Spaces'

const getEmptyLabel = (query: string) =>
  query.trim()
    ? 'No spaces found'
    : 'No joined spaces'

const clamp = (val: number, max: number) =>
  Math.max(-1, Math.min(val, max - 1))

// ── Hooks ─────────────────────────

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return

    const handler = (e: MouseEvent) => {
      const inside = ref.current?.contains(
        e.target as Node,
      )
      if (!inside) onClose()
    }

    document.addEventListener(
      'mousedown',
      handler,
    )
    return () => {
      document.removeEventListener(
        'mousedown',
        handler,
      )
    }
  }, [ref, onClose, active])
}

function useEscapeKey(
  onClose: () => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener(
      'keydown',
      handler,
    )
    return () => {
      document.removeEventListener(
        'keydown',
        handler,
      )
    }
  }, [onClose, active])
}

// ── SpaceOption ────────────────────────

function SpaceOption({
  space,
  isSelected,
  isHighlighted,
  onSelect,
}: {
  space: Space
  isSelected: boolean
  isHighlighted: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full flex items-center',
        'gap-3 px-4 py-2.5',
        'text-sm text-left',
        'transition-colors',
        'text-gray-700 dark:text-gray-200',
        isHighlighted
          ? 'bg-gray-100 dark:bg-white/10'
          : 'hover:bg-gray-100' +
          ' dark:hover:bg-white/10',
      )}
    >
      <span className="w-4 shrink-0">
        {isSelected && (
          <Check
            className="h-4 w-4 text-primary"
          />
        )}
      </span>
      <span className="flex-1 truncate">
        r/{space.name} — {space.displayName}
      </span>
      {space.isJoined && (
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.5',
            'rounded-full bg-primary/10',
            'text-primary font-medium',
            'shrink-0',
          )}
        >
          Joined
        </span>
      )}
    </button>
  )
}

// ── SpaceSelector ──────────────────────

function SpaceSelector({
  formData,
  errors,
  allSpaces,
  selectedSpace,
  onFieldChange,
}: {
  formData: PostFormData
  errors: PostFormErrors
  allSpaces?: Space[]
  selectedSpace?: Space | null
  onFieldChange: PostFormProps['onFieldChange']
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlight, setHighlight] =
    useState(-1)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef =
    useRef<HTMLInputElement>(null)
  const listRef =
    useRef<HTMLDivElement>(null)

  const spaces = allSpaces ?? []
  const filtered = getFiltered(spaces, search)

  const close = () => {
    setIsOpen(false)
    setSearch('')
    setHighlight(-1)
  }

  const handleSelect = (name: string) => {
    onFieldChange('space', name)
    close()
  }

  // Reset highlight when search changes
  useEffect(() => {
    setHighlight(-1)
  }, [search])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlight < 0) return
    const el = listRef.current
    if (!el) return

    const items = el.querySelectorAll('button')
    items[highlight]?.scrollIntoView({
      block: 'nearest',
    })
  }, [highlight])

  const handleKeyDown = (
    e: React.KeyboardEvent,
  ) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((prev) =>
        clamp(prev + 1, filtered.length),
      )
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((prev) =>
        clamp(prev - 1, filtered.length),
      )
      return
    }

    if (e.key !== 'Enter') return
    e.preventDefault()

    // If highlighted, select that one
    if (highlight >= 0 && filtered[highlight]) {
      handleSelect(filtered[highlight].name)
      return
    }

    // Otherwise select first result
    if (filtered.length > 0) {
      handleSelect(filtered[0].name)
    }
  }

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  useClickOutside(ref, close, isOpen)
  useEscapeKey(close, isOpen)

  // Auto-focus search on open
  useEffect(() => {
    if (!isOpen) return
    const id = setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
    return () => clearTimeout(id)
  }, [isOpen])

  const label = selectedSpace
    ? `r/${selectedSpace.name}`
    : 'Select a space...'

  const borderClass = errors.space
    ? 'border-red-500'
    : 'border-gray-200 dark:border-gray-700'

  return (
    <div ref={ref} className="relative">
      <label
        className={cn(
          'block text-sm font-semibold mb-2',
          'text-gray-700 dark:text-gray-200',
        )}
      >
        Space{' '}
        <span className="text-red-500">*</span>
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
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
            selectedSpace
              ? ''
              : 'text-gray-400'
          }
        >
          {label}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-400',
            'transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-full',
            'rounded-lg bg-white',
            'dark:bg-surface-dark shadow-lg',
            'ring-1 ring-black/5',
            'dark:ring-white/10',
            'overflow-hidden',
          )}
        >
          {/* Search */}
          <div
            className={cn(
              'flex items-center gap-2',
              'px-3 py-2 border-b',
              'border-gray-200',
              'dark:border-gray-700',
            )}
          >
            <span
              className={cn(
                'text-sm font-medium',
                'text-gray-400 select-none',
                'shrink-0',
              )}
            >
              r/
            </span>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search spaces..."
              className={cn(
                'flex-1 bg-transparent',
                'text-sm outline-none',
                'text-gray-900',
                'dark:text-white',
                'placeholder:text-gray-400',
              )}
            />
            <Search
              className={cn(
                'h-4 w-4 text-gray-400',
              )}
            />
          </div>

          {/* Results */}
          <div
            ref={listRef}
            className={cn(
              'max-h-60 overflow-y-auto',
              'py-1',
            )}
          >
            {filtered.length === 0 && (
              <p
                className={cn(
                  'px-4 py-3 text-sm',
                  'text-gray-400',
                  'text-center',
                )}
              >
                {getEmptyLabel(search)}
              </p>
            )}

            {filtered.length > 0 && (
              <>
                <div
                  className={cn(
                    'px-3 py-1.5',
                    'text-[10px] font-bold',
                    'uppercase tracking-wider',
                    'text-gray-400',
                    'dark:text-gray-500',
                  )}
                >
                  {getSectionLabel(search)}
                </div>
                {filtered.map((space, i) => (
                  <SpaceOption
                    key={space.name}
                    space={space}
                    isSelected={
                      formData.space ===
                      space.name
                    }
                    isHighlighted={
                      i === highlight
                    }
                    onSelect={() => {
                      handleSelect(space.name)
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {errors.space && (
        <p
          className={cn(
            'text-xs text-red-500 mt-1',
          )}
        >
          {errors.space}
        </p>
      )}
    </div>
  )
}

// ── ReadOnlySpace ──────────────────────

function ReadOnlySpace({
  space,
}: {
  space: string
}) {
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

// ── FlairSelector ─────────────────────

function FlairSelector({
  value,
  onChange,
}: {
  value?: PostFlair
  onChange: (flair?: PostFlair) => void
}) {
  return (
    <div>
      <label
        className={cn(
          'block text-sm font-semibold',
          'mb-2 text-gray-700',
          'dark:text-gray-200',
        )}
      >
        Flair (Optional)
      </label>
      <div className="flex flex-wrap gap-2">
        {POST_FLAIRS.map((flair) => {
          const active = value === flair
          const colors =
            FLAIR_COLORS[flair] ?? ''

          return (
            <button
              key={flair}
              type="button"
              onClick={() =>
                onChange(
                  active ? undefined : flair,
                )
              }
              className={cn(
                'px-3 py-1.5 rounded-full',
                'text-xs font-bold',
                'uppercase tracking-wide',
                'border-2 transition-all',
                active
                  ? cn(
                    colors,
                    'border-current',
                  )
                  : cn(
                    'border-transparent',
                    'bg-gray-100',
                    'dark:bg-gray-800',
                    'text-gray-500',
                    'dark:text-gray-400',
                    'hover:bg-gray-200',
                    'dark:hover:bg-gray-700',
                  ),
              )}
            >
              {flair}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── TagsSection ────────────────────────

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
          onChange={(e) => {
            onTagInputChange(e.target.value)
          }}
          placeholder="Add a tag..."
          maxLength={20}
          showCharCount
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
        <div
          className={cn(
            'flex flex-wrap gap-2 mt-3',
          )}
        >
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn(
                'flex items-center gap-1',
              )}
            >
              #{tag}
              <button
                type="button"
                onClick={() => {
                  onRemoveTag(tag)
                }}
                className={cn(
                  'ml-1 hover:text-red-500',
                )}
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

// ── PostForm ───────────────────────────

export function PostForm({
  mode,
  formData,
  tagInput,
  errors,
  isSubmitting,
  allSpaces,
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

  const submitLabel = isEdit
    ? 'Save Changes'
    : 'Post'

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
      noValidate
    >
      {isEdit ? (
        <ReadOnlySpace
          space={formData.space}
        />
      ) : (
        <SpaceSelector
          formData={formData}
          errors={errors}
          allSpaces={allSpaces}
          selectedSpace={selectedSpace}
          onFieldChange={onFieldChange}
        />
      )}

      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => {
          onFieldChange(
            'title',
            e.target.value,
          )
        }}
        placeholder="What's your post about?"
        maxLength={300}
        showCharCount
        error={errors.title}
        required
      />

      <FlairSelector
        value={formData.flair}
        onChange={(f) =>
          onFieldChange('flair', f)
        }
      />

      <div className="space-y-2">
        <label
          className={cn(
            'block text-sm font-semibold',
            'text-gray-700 dark:text-gray-200',
          )}
        >
          Content{' '}
          <span className="text-red-500">
            *
          </span>
        </label>
        <RichTextEditor
          value={formData.content}
          onChange={(val) => {
            onFieldChange('content', val)
          }}
          placeholder={
            'What are your thoughts?'
          }
          error={!!errors.content}
          maxLength={40000}
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
          onFieldChange(
            'imageUrl',
            e.target.value,
          )
        }}
        placeholder={
          'https://example.com/image.jpg'
        }
        error={errors.imageUrl}
      />

      <TagsSection
        tags={formData.tags}
        tagInput={tagInput}
        onTagInputChange={onTagInputChange}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />

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
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
