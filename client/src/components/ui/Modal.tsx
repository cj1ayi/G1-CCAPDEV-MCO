import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    closeOnOverlayClick?: boolean
    showCloseButton?: boolean
    className?: string
}

export const Modal = ({
    isOpen,
    onClose,
    children,
    size = 'md',
    closeOnOverlayClick = true,
    showCloseButton = true,
    className,
}: ModalProps) => {
    if (!isOpen) 
        return null

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-7xl',
    }

    const handleOverlayClick = () => {
        if (closeOnOverlayClick)
            onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleOverlayClick}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full bg-white dark:bg-surface-dark rounded-2xl shadow-2xl',
                    'ring-1 ring-black/5 dark:ring-white/10',
                    'max-h-[90vh] flex flex-col',
                    'animate-in fade-in zoom-in-95 duration-200',
                    sizeClasses[size],
                    className
                )}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                {/* Content */}
                {children}
            </div>
        </div>
    )
}

interface ModalHeaderProps {
    children: ReactNode
    className?: string
}

export const ModalHeader = ({ children, className }: ModalHeaderProps) => (
    <div
        className={cn(
            'px-6 py-5 border-b border-gray-200 dark:border-gray-800',
            className
        )}
    >
        {children}
    </div>
)

interface ModalTitleProps {
    children: ReactNode
    className?: string
}

export const ModalTitle = ({ children, className }: ModalTitleProps) => (
    <h2
        className={cn(
            'text-xl font-bold text-gray-900 dark:text-white tracking-tight',
            className
        )}
    >
        {children}
    </h2>
)

interface ModalContentProps {
    children: ReactNode
    className?: string
}

export const ModalContent = ({ children, className }: ModalContentProps) => (
    <div className={cn('flex-1 overflow-y-auto px-6 py-6', className)}>
        {children}
    </div>
)

interface ModalFooterProps {
    children: ReactNode
    className?: string
}

export const ModalFooter = ({ children, className }: ModalFooterProps) => (
    <div
        className={cn(
            'flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50',
            className
        )}
    >
        {children}
    </div>
)
