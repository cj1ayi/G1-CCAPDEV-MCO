import { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full',
    'font-semibold transition-colors',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary border border-primary/20',
        secondary: [
          'bg-gray-100 dark:bg-gray-800',
          'text-gray-700 dark:text-gray-300',
        ],
        outline: [
          'border border-gray-300 dark:border-gray-600',
          'text-gray-700 dark:text-gray-300',
        ],
        success: [
          'bg-green-100 dark:bg-green-900/30',
          'text-green-700 dark:text-green-400',
        ],
        warning: [
          'bg-yellow-100 dark:bg-yellow-900/30',
          'text-yellow-700 dark:text-yellow-400',
        ],
        danger: [
          'bg-red-100 dark:bg-red-900/30',
          'text-red-700 dark:text-red-400',
        ],
        info: [
          'bg-blue-100 dark:bg-blue-900/30',
          'text-blue-700 dark:text-blue-400',
        ],
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({
  className,
  variant,
  size,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}
