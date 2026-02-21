import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface LoadingBarProps {
  isLoading: boolean
  className?: string
}

export const LoadingBar = ({ isLoading, className }: LoadingBarProps) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true)
      setProgress(0)

      // Quick jump to 30%
      const timer1 = setTimeout(() => setProgress(30), 100)

      // Gradually increase to 90%
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90
          
          // Slow down as we approach 90%
          const increment = Math.random() * (10 - prev / 10)
          return Math.min(prev + increment, 90)
        })
      }, 500)

      return () => {
        clearTimeout(timer1)
        clearInterval(interval)
      }
    } else if (isVisible) {
      // Complete the bar
      setProgress(100)
      
      // Hide after animation completes
      const hideTimer = setTimeout(() => {
        setIsVisible(false)
        setProgress(0)
      }, 400)

      return () => clearTimeout(hideTimer)
    }
  }, [isLoading, isVisible])

  if (!isVisible) return null

  return (
    <div 
      className={cn(
        'fixed top-0 left-0 right-0 z-[9999]',
        className
      )}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          height: '2px',
          backgroundColor: '#007036',
          boxShadow: '0 0 8px rgba(0, 112, 54, 0.6)',
          transition: progress === 100 
            ? 'width 0.3s ease-out' 
            : 'width 0.5s ease-out'
        }}
      />
    </div>
  )
}
