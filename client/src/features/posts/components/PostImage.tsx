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
  maxHeight = 'max-h-[512px]',
}: PostImageProps) => {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (error) {
    return (
      <div
        className={cn(
          'w-full rounded-xl overflow-hidden',
          'bg-gray-100 dark:bg-gray-900',
          'border border-gray-200',
          'dark:border-gray-800',
          'flex flex-col items-center',
          'justify-center gap-2',
          'h-32 text-gray-400',
          'dark:text-gray-600',
          className,
        )}
      >
        <ImageOff className="size-8" />
        <span className="text-xs">
          Image failed to load
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative w-full rounded-xl',
        'overflow-hidden mt-3 mb-3',
        maxHeight,
        className,
      )}
    >
      {/* Blurred background fill */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-black/80',
        )}
      >
        {loaded && (
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className={cn(
              'w-full h-full',
              'object-cover',
              'blur-2xl opacity-40',
              'scale-110',
            )}
          />
        )}
      </div>

      {/* Loading skeleton */}
      {!loaded && (
        <div
          className={cn(
            'w-full min-h-48 animate-pulse',
            'bg-gray-200 dark:bg-gray-800',
          )}
        />
      )}

      {/* Actual image — centered, natural ratio */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          'relative z-10',
          'mx-auto max-w-full h-auto',
          'object-contain',
          maxHeight,
          !loaded && 'hidden',
        )}
      />
    </div>
  )
}
