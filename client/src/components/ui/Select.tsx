import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
    value: string 
    label: string
    disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string
    error?: string
    helperText?: string
    options?: SelectOption[]
    placeholder?: string
    leftIcon?: React.ReactNode
} 

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({
        className,
        label,
        error,
        helperText,
        options = [],
        placeholder,
        leftIcon,
        children,
        ...props
    }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none z-10">
                            {leftIcon}
                        </div>
                    )}

                    <select className={cn(
                        'w-full appearance-none rounded-lg border bg-white dark:bg-gray-900 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-white transition-colors cursor-pointer',
                        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
                        !error && 'border-gray-200 dark:border-gray-700',
                        leftIcon && 'pl-10',
                        className
                    )}
                    ref={ref}
                    {...props}
                    >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )} 

                    {children || options.map((option) => (
                        <option 
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                    </select>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </div>

                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
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

Select.displayName = 'Select'
