import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  showCharCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showCharCount,
      maxLength,
      ...props
    },
    ref
  ) => {
    const charCount = typeof props.value === 'string' ? props.value.length : 0
    const isAtLimit = maxLength !== undefined && charCount >= maxLength

    return (
      <div className="w-full">
        {label && (
          <label
            className={cn(
              'block text-sm font-semibold mb-2',
              'text-gray-700 dark:text-gray-200'
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            maxLength={maxLength}
            className={cn(
              'w-full rounded-lg border bg-white dark:bg-surface-dark',
              'px-4 py-3 text-sm text-gray-900 dark:text-white',
              'placeholder:text-gray-400 transition-colors resize-y',
              'focus:outline-none focus:ring-2 focus:ring-primary/20',
              'focus:border-primary disabled:opacity-50',
              'disabled:cursor-not-allowed',
              error && [
                'border-red-500 focus:ring-red-500/20',
                'focus:border-red-500'
              ],
              !error && 'border-gray-200 dark:border-gray-700',
              showCharCount && maxLength && 'pb-7',
              className
            )}
            {...props}
          />

          {showCharCount && maxLength && (
            <div
              className={cn(
                'absolute bottom-2 right-3 text-xs pointer-events-none',
                isAtLimit ? 'text-red-500' : 'text-gray-400'
              )}
            >
              {charCount}/{maxLength}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-500">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
