import { useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastState {
  id: number
  message: string
  type: ToastType
  duration?: number
}

interface UseToastReturn {
  toasts: ToastState[]
  showToast: (
    message: string,
    type?: ToastType,
    duration?: number,
  ) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  removeToast: (id: number) => void
}

let toastId = 0

/**
 * Hook to manage toast notifications with typed shortcuts.
 *
 * Features:
 * - Display toast messages with type (success, error, warning, info)
 * - Auto-remove toasts after specified duration
 * - Convenience methods for each toast type
 * - Manual removal with removeToast()
 * - Automatic ID generation for tracking
 *
 * @example
 * const { toasts, success, error, removeToast } = useToast()
 *
 * const handleSubmit = async () => {
 *   try {
 *     await api.submit(data)
 *     success('Data saved successfully')
 *   } catch (err) {
 *     error('Failed to save data')
 *   }
 * }
 *
 * return (
 *   <>
 *     {toasts.map((toast) => (
 *       <Toast
 *         key={toast.id}
 *         {...toast}
 *         onClose={() => removeToast(toast.id)}
 *       />
 *     ))}
 *   </>
 * )
 */
export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastState[]>([])

  /**
   * Display a toast notification.
   */
  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'info',
      duration = 5000,
    ) => {
      const id = toastId++
      setToasts((prev) => [
        ...prev,
        { id, message, type, duration },
      ])
    },
    [],
  )

  /**
   * Display a success toast.
   */
  const success = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'success', duration)
    },
    [showToast],
  )

  /**
   * Display an error toast.
   */
  const error = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'error', duration)
    },
    [showToast],
  )

  /**
   * Display a warning toast.
   */
  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'warning', duration)
    },
    [showToast],
  )

  /**
   * Display an info toast.
   */
  const info = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'info', duration)
    },
    [showToast],
  )

  /**
   * Remove a toast by ID.
   */
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
  }
}
