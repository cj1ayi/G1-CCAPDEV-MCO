import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ImageOff } from 'lucide-react'

type PostImageVariant = 'card' | 'detail'

interface PostImageProps {
  src: string
  alt: string
  /** card = 4:3 crop for feed, detail = full */
  variant?: PostImageVariant
  className?: string
}

function ErrorFallback({
  className,
}: {
  className?: string
}) {
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

function LoadingSkeleton() {
  return (
    <div
      className={cn(
        'w-full min-h-48 animate-pulse',
        'bg-gray-200 dark:bg-gray-800',
        'rounded-xl',
      )}
    />
  )
}

/**
 * Feed card — 4:3 aspect ratio container.
 * Wide images fit naturally.
 * Tall images get cropped to 4:3 from center.
 */
function CardImage({
  src,
  alt,
  loaded,
  onLoad,
  onError,
}: {
  src: string
  alt: string
  loaded: boolean
  onLoad: () => void
  onError: () => void
}) {
  return (
    <div
      className={cn(
        'relative w-full rounded-xl',
        'overflow-hidden mt-3 mb-3',
        'aspect-[4/3]',
      )}
    >
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black/80">
        {loaded && (
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className={cn(
              'w-full h-full object-cover',
              'blur-2xl opacity-40 scale-110',
            )}
          />
        )}
      </div>

      {!loaded && <LoadingSkeleton />}

      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        className={cn(
          'relative z-10',
          'w-full h-full object-contain',
          !loaded && 'hidden',
        )}
      />
    </div>
  )
}

/**
 * Detail view — full image, blurred bg,
 * capped at 80vh so it never overwhelms.
 */
function DetailImage({
  src,
  alt,
  loaded,
  onLoad,
  onError,
}: {
  src: string
  alt: string
  loaded: boolean
  onLoad: () => void
  onError: () => void
}) {
  return (
    <div
      className={cn(
        'relative w-full rounded-xl',
        'overflow-hidden mt-3 mb-3',
        'max-h-[80vh]',
      )}
    >
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black/80">
        {loaded && (
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className={cn(
              'w-full h-full object-cover',
              'blur-2xl opacity-40 scale-110',
            )}
          />
        )}
      </div>

      {!loaded && <LoadingSkeleton />}

      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        className={cn(
          'relative z-10',
          'mx-auto max-w-full h-auto',
          'object-contain max-h-[80vh]',
          !loaded && 'hidden',
        )}
      />
    </div>
  )
}

export const PostImage = ({
  src,
  alt,
  variant = 'detail',
  className,
}: PostImageProps) => {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (error) {
    return <ErrorFallback className={className} />
  }

  const shared = {
    src,
    alt,
    loaded,
    onLoad: () => setLoaded(true),
    onError: () => setError(true),
  }

  const Renderer =
    variant === 'card' ? CardImage : DetailImage

  return (
    <div className={className}>
      <Renderer {...shared} />
    </div>
  )
}
