import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ImageOff } from 'lucide-react'

interface PostImageProps {
  src: string
  alt: string
  className?: string
  maxHeight?: string
}

export const PostImage = ({ 
  src, 
  alt, 
  className, 
  maxHeight = 'max-h-96' 
}: PostImageProps) => {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (error) {
    return (
      <div className={cn(
        'w-full rounded-lg overflow-hidden mb-3',
        'bg-gray-100 dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-800',
        'flex flex-col items-center justify-center gap-2',
        'h-32 text-gray-400 dark:text-gray-600',
        className
      )}>
        <ImageOff className="size-8" />
        <span className="text-xs">Image failed to load</span>
      </div>
    )
  }

  return (
    <div className={cn(
      'w-full rounded-lg overflow-hidden mb-3',
      'bg-gray-100 dark:bg-gray-900',
      'border border-gray-200 dark:border-gray-800',
      'flex justify-center items-center',
      className
    )}>
      {!loaded && (
        <div className={cn(
          'w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg', 
          maxHeight, 
          'min-h-24'
          )}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          'max-w-full h-auto object-contain',
          maxHeight,
          !loaded && 'hidden'
        )}
      />
    </div>
  )
}
