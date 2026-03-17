import { cn } from '@/lib/utils'
import type { PostCardContentProps } from './types'
import { PostImage } from '../PostImage'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export const PostCardContent = ({
  title,
  content,
  imageUrl,
}: PostCardContentProps) => {
  return (
    <>
      <h3
        className={cn(
          'text-lg font-semibold break-words',
          'text-gray-900 dark:text-white',
          'leading-snug mb-2',
          'hover:text-primary dark:hover:text-primary transition-colors',
        )}
      >
        {title}
      </h3>

      {content && (
        <div
          className={cn(
            'text-sm text-gray-600 dark:text-gray-300',
            'leading-relaxed mb-3 line-clamp-3 break-words',
            'prose prose-sm dark:prose-invert max-w-none',
            'min-h-[2rem]',
          )}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ node, ...props }) => (
                <a 
                  {...props} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()} 
                />
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}

      {imageUrl && 
        <PostImage 
          src={imageUrl} 
          alt={title} 
          variant='card'
        />
      }
    </>
  )
}
