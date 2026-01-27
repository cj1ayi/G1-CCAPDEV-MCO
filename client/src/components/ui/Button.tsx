import { ButtonHTMLAttributes, forwardRef, ElementType, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-lg font-bold relative',
    'transition-all duration-200 disabled:opacity-50',
    'disabled:pointer-events-none select-none touch-manipulation',
    'active:scale-[0.96] outline-none focus-visible:ring-2',
    'focus-visible:ring-offset-2 ring-offset-background',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-white hover:bg-primary-dark shadow-md',
          'shadow-primary/20 focus-visible:ring-primary',
        ],
        secondary: [
          'bg-white dark:bg-white/5 border border-gray-200',
          'dark:border-white/10 text-[#101814] dark:text-white',
          'hover:bg-gray-50 dark:hover:bg-white/10',
        ],
        ghost: [
          'text-gray-600 dark:text-gray-300',
          'hover:bg-gray-100 dark:hover:bg-white/10',
        ],
        danger: [
          'bg-red-600 text-white hover:bg-red-700 shadow-md',
          'focus-visible:ring-red-600'
        ],
        outline: [
          'border border-primary text-primary',
          'hover:bg-primary hover:text-white',
        ],
      },
      size: {
        sm: 'h-9 px-4 text-sm gap-1.5',
        md: 'h-11 px-6 text-sm gap-2',
        lg: 'h-14 px-8 text-base gap-3',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
extends ButtonHTMLAttributes<HTMLButtonElement>,
VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  as?: ElementType
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      as: Component = 'button',
        ...rest
    } = props

    const isDisabled = isLoading || disabled

    return (
      <Component
      ref={ref}
      disabled={isDisabled}
      className={cn(
        buttonVariants({ variant, size, fullWidth, className })
      )}
      {...rest}
      >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
        </div> 
      )}

      <div className={cn(
        "flex items-center justify-center gap-2 w-full",
        isLoading ? "opacity-0" : "opacity-100"
      )}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>} 
      <span className="truncate">{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </div>
      </Component>
    )
  }
)

Button.displayName = 'Button'
