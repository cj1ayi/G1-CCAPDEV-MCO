import { cn } from '@/lib/utils'
import type { PostCardContentProps } from './types'

export const PostCardContent = ({
  title,
  content,
  imageUrl,
}: PostCardContentProps) => {
  return (
    <>
      {/* Post Title */}
      <h3
        className={cn(
          "text-lg font-semibold",
          "text-gray-900 dark:text-white",
          "leading-snug mb-2",
          "hover:text-primary dark:hover:text-primary transition-colors"
        )}
      >
        {title}
      </h3>

      {/* Post Content */}
      {content && (
        <div
          className={cn(
            "text-sm text-gray-600 dark:text-gray-300",
            "leading-relaxed mb-3 line-clamp-3"
          )}
        >
          {content}
        </div>
      )}

      {/* Image (if exists) */}
      {imageUrl && (
        <div
          className={cn(
            "w-full rounded-lg overflow-hidden",
            "bg-gray-100 dark:bg-black",
            "mb-3",
            "border border-gray-200 dark:border-gray-800"
          )}
        >
          <img
            src={imageUrl}
            alt={title}
            className={cn(
              "w-full h-auto object-cover max-h-96"
            )}
          />
        </div>
      )}
    </>
  )
}
