import { InputHTMLAttributes, forwardRef, useId, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  showCharCount?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showCharCount,
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const generateId = useId()
    const inputId = id || generateId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    // Split long logic into a variable
    const describedBy = error ? errorId : helperText ? helperId : undefined

    const charCount = typeof props.value === 'string' ? props.value.length : 0
    const maxLength = props.maxLength
    const isAtLimit = maxLength !== undefined && charCount >= maxLength

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
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
          {leftIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                'text-gray-400 pointer-events-none'
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              'w-full rounded-lg border bg-white dark:bg-surface-dark',
              'px-4 py-3 text-sm text-gray-900 dark:text-white',
              'placeholder:text-gray-400 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary/20',
              'focus:border-primary disabled:opacity-50',
              'disabled:cursor-not-allowed',
              error && [
                'border-red-500 focus:ring-red-500/20',
                'focus:border-red-500'
              ],
              !error && 'border-gray-200 dark:border-gray-700',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'text-gray-400 flex items-center'
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {showCharCount && maxLength && (
          <div className="flex justify-end mt-1">
            <span className={cn('text-xs', isAtLimit ? 'text-red-500' : 'text-gray-400')}>
              {charCount}/{maxLength}
            </span>
          </div>
        )}

        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-500">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={helperId}
            className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
