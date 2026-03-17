import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CommentInputProps } from '../types'
import { RichTextEditor } from '@/components/ui/RichTextEditor'

export const CommentInput = ({
  onSubmit,
  placeholder = 'What are your thoughts?',
  submitLabel = 'Post Comment',
  onCancel,
  isSubmitting = false,
}: CommentInputProps) => {
  const [content, setContent] = useState('')

  const hasVisibleContent = (s: string) =>
    s.replace(/\p{Cf}/gu, '').trim().length > 0

  const handleSubmit = async () => {
    if (hasVisibleContent(content) && !isSubmitting) {
      await onSubmit(content)
      setContent('')
    }
  }

  return (
    <div className={cn(
      'bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft',
      'border border-gray-100 dark:border-gray-800 p-4 sm:p-6',
    )}>
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder={placeholder}
        minHeight="min-h-[120px]"
      />

      <div className="flex justify-end gap-2 mt-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={cn(
              'text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg',
              'font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
            )}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasVisibleContent(content) || isSubmitting}
          className={cn(
            'bg-primary text-white px-5 py-2 rounded-lg font-medium text-sm',
            'transition-colors shadow-sm flex items-center gap-2',
            hasVisibleContent(content) && !isSubmitting ? 'hover:bg-primary-dark' : 'opacity-50 cursor-not-allowed',
          )}
        >
          {isSubmitting ? 'Posting...' : submitLabel}
        </button>
      </div>
    </div>
  )
}
