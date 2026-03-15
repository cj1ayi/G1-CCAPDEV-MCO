import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { CommentInputProps } from '../types'
import { MarkdownToolbar } from '@/components/ui/MarkdownToolbar'

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      <div
        className={cn(
          'border border-gray-300 dark:border-gray-700',
          'rounded-lg overflow-hidden',
          'transition-all',
          isFocused && 'ring-2 ring-primary/50 border-primary',
        )}
      >
        <MarkdownToolbar 
          textareaRef={textareaRef} 
          value={content} 
          onChange={setContent} 
        />

        <textarea
          ref={textareaRef}
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
          {isSubmitting ? 'Posting...' : submitLabel}
        </button>
      </div>
    </div>
  )
}
