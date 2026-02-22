import { useEffect } from 'react'
import {
  X,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose: () => void
}

const TOAST_ICONS = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
}

const TOAST_STYLES = {
  success:
    'bg-green-50 dark:bg-green-900/20 border-green-200 ' +
    'dark:border-green-800 text-green-800 dark:text-green-400',
  error:
    'bg-red-50 dark:bg-red-900/20 border-red-200 ' +
    'dark:border-red-800 text-red-800 dark:text-red-400',
  warning:
    'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 ' +
    'dark:border-yellow-800 text-yellow-800 dark:text-yellow-400',
  info:
    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 ' +
    'dark:border-blue-800 text-blue-800 dark:text-blue-400',
}

export const Toast = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-[9999]',
        'max-w-sm w-full',
        'border rounded-lg shadow-lg',
        'p-4 flex items-start gap-3',
        'animate-in slide-in-from-right',
        TOAST_STYLES[type],
      )}
    >
      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        {TOAST_ICONS[type]}
      </div>

      {/* Message */}
      <p className="flex-1 text-sm font-medium">{message}</p>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
