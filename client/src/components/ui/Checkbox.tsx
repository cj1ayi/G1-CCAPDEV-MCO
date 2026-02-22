import { InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const CHECKBOX_SVG =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik05IDE2LjE3TDQuODMgMTJsLTEuNDIgMS40MUw5IDE5IDIxIDdsLTEuNDEtMS40MXoiLz48L3N2Zz4='

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = useId()
    const checkboxId = id || generatedId

    return (
      <div className="flex items-center">
        <input
          id={checkboxId}
          type="checkbox"
          ref={ref}
          className={cn(
            'w-5 h-5 rounded-md appearance-none cursor-pointer',
            'border border-gray-300 dark:border-gray-700',
            'bg-white dark:bg-background-dark',
            'checked:!bg-primary checked:!border-primary',
            `checked:bg-[url(${CHECKBOX_SVG})]`,
            'checked:bg-center checked:bg-no-repeat',
            'checked:bg-[length:14px]',
            'focus:ring-2 focus:ring-primary/20',
            'transition-colors',
            className,
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="select-none ms-2 text-sm text-gray-600"
          >
            {label}
          </label>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
