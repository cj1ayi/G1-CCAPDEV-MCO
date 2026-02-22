import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLoadingStore } from '@/hooks/useLoadingBar'
import { cn } from '@/lib/utils'

export const LoadingBar = () => {
  const location = useLocation()
  const { isLoading, progress } = useLoadingStore()
  const hasStartedRef = useRef(false)

  useEffect(() => {
    const { startLoading, stopLoading } = useLoadingStore.getState()
    
    startLoading()
    hasStartedRef.current = true

    const timer = setTimeout(() => {
      stopLoading()
      hasStartedRef.current = false
    }, 250)

    return () => {
      clearTimeout(timer)
      
      if (hasStartedRef.current) {
        stopLoading()
        hasStartedRef.current = false
      }
    }
  }, [location.pathname])

  if (!isLoading && progress === 0) return null

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 h-1 bg-primary z-[9999]",
        "transition-all duration-200 ease-out shadow-lg")}
      style={{
        width: `${progress}%`,
        opacity: isLoading ? 1 : 0,
      }}
    />
  )
}
