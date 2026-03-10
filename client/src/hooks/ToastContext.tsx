import { createContext, useContext, useState, useCallback } from 'react'
import { Toast } from '@/components/ui/Toast'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastState {
  id: number
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
})

let toastId = 0

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 1000) => {
    const id = toastId++
      setToasts([{ id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = useCallback((message: string, duration?: number) => showToast(message, 'success', duration), [showToast])
  const error = useCallback((message: string, duration?: number) => showToast(message, 'error', duration), [showToast])
  const warning = useCallback((message: string, duration?: number) => showToast(message, 'warning', duration), [showToast])
  const info = useCallback((message: string, duration?: number) => showToast(message, 'info', duration), [showToast])

  return (
      <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
        {children}
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
