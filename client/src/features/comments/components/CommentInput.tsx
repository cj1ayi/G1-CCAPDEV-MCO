import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CommentInputProps } from '../types'

export const CommentInput = ({
  onSubmit,
  placeholder = 'What are your thoughts?',
  submitLabel = 'Post Comment',
  autoFocus = false,
  onCancel,
  isSubmitting = false,
}: CommentInputProps) => {
  const [content, setContent] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async () => {
    if (content.trim() && !isSubmitting) {
      await onSubmit(content)
      setContent('')
      setIsFocused(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      (e.metaKey || e.ctrlKey) &&
      e.key === 'Enter' &&
      !isSubmitting
    ) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className={cn(
        'bg-surface-light dark:bg-surface-dark',
        'rounded-xl shadow-soft',
        'border border-gray-100 dark:border-gray-800',
        'p-4 sm:p-6',
      )}
    >
      <p className="text-sm text-gray-500 mb-2">
        Comment as{' '}
        <span className="font-medium text-primary">
          Current User
        </span>
      </p>

      <div
        className={cn(
          'border border-gray-300 dark:border-gray-700',
          'rounded-lg overflow-hidden',
          'transition-all',
          isFocused && 'ring-2 ring-primary/50 border-primary',
        )}
      >
        {/* Formatting Toolbar */}
        <div
          className={cn(
            'bg-gray-50 dark:bg-gray-800',
            'border-b border-gray-300 dark:border-gray-700',
            'px-3 py-2 flex items-center gap-2',
            'text-gray-600 dark:text-gray-400',
          )}
        >
          <button
            type="button"
            className={cn(
              'hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded',
            )}
            title="Bold"
          >
            <span className="material-symbols-outlined text-[18px]">
              format_bold
            </span>
          </button>
          <button
            type="button"
            className={cn(
              'hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded',
            )}
            title="Italic"
          >
            <span className="material-symbols-outlined text-[18px]">
              format_italic
            </span>
          </button>
          <button
            type="button"
            className={cn(
              'hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded',
            )}
            title="Link"
          >
            <span className="material-symbols-outlined text-[18px]">
              link
            </span>
          </button>
          <button
            type="button"
            className={cn(
              'hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded',
            )}
            title="Code"
          >
            <span className="material-symbols-outlined text-[18px]">
              code
            </span>
          </button>
        </div>

        {/* Text Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          disabled={isSubmitting}
          className={cn(
            'w-full bg-transparent border-none p-4',
            'min-h-[120px]',
            'focus:ring-0 text-slate-800 dark:text-slate-200',
            'resize-y outline-none',
            isSubmitting && 'opacity-50 cursor-not-allowed',
          )}
          placeholder={placeholder}
        />
      </div>

      {/* Submit Section */}
      <div className="flex justify-end gap-2 mt-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={cn(
              'text-gray-600 dark:text-gray-400',
              'px-4 py-2 rounded-lg font-medium text-sm',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors',
              isSubmitting && 'opacity-50 cursor-not-allowed',
            )}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className={cn(
            'bg-primary text-white',
            'px-5 py-2 rounded-lg font-medium text-sm',
            'transition-colors shadow-sm',
            'flex items-center gap-2',
            content.trim() && !isSubmitting
              ? 'hover:bg-primary-dark'
              : 'opacity-50 cursor-not-allowed',
          )}
        >
          {isSubmitting && (
            <span className={cn(
              "material-symbols-outlined text-[16px] animate-spin")}>
              progress_activity
            </span>
          )}
          {isSubmitting ? 'Posting...' : submitLabel}
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Tip: Press Cmd/Ctrl + Enter to submit
      </p>
    </div>
  )
}
