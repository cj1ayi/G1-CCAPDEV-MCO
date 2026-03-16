import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { PostDetailVoteColumn } from './PostDetailVoteColumn'
import { PostDetailActions } from './PostDetailActions'
import { Avatar } from '@/components/ui'
import type { PostDetailContentProps, PostDetailVoteColumnProps} from '../types'
import { formatTimeAgo } from '@/lib/dateUtils'
import { PostImage } from './PostImage'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { FLAIR_COLORS, FLAIR_FALLBACK } from '../constants'

export const PostDetailContent = ({
  post,
  commentCount,
  score,
  upvotes,
  downvotes,
  isUpvoted,
  isDownvoted,
  onUpvote,
  onDownvote,
}: PostDetailContentProps) => {
  const navigate = useNavigate()

  const goToSpace = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      navigate(`/r/${post.space}`)
    },
    [navigate, post.space]
  )

  const goToAuthor = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      navigate(`/profile/${post.author.username}`)
    },
    [navigate, post.author.username]
  )

  const voteProps: PostDetailVoteColumnProps = {
    score,
    isUpvoted,
    isDownvoted,
    onUpvote,
    onDownvote,
  }

  const flairStyle = post.flair
    ? (FLAIR_COLORS[post.flair] ?? FLAIR_FALLBACK)
    : null

  return (
    <article
      className={cn(
        'bg-surface-light dark:bg-surface-dark',
        'rounded-xl shadow-soft',
        'border border-gray-100 dark:border-gray-800',
        'overflow-hidden'
      )}
    >
      <div className="flex">
        <PostDetailVoteColumn {...voteProps} />

        <div className="flex-1 p-6 sm:p-8">
          <div
            className={cn(
              'flex items-center gap-3 mb-4',
              'text-sm text-gray-500 dark:text-gray-400'
            )}
          >
            <div
              className={cn(
                'flex items-center gap-2 font-semibold',
                'text-gray-900 dark:text-gray-200',
                'hover:underline cursor-pointer'
              )}
              onClick={goToSpace}
            >
              {post.spaceIcon && (
                <img
                  className="w-6 h-6 rounded-full object-cover"
                  src={post.spaceIcon}
                  alt={post.space}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      'none'
                  }}
                />
              )}
              <span>r/{post.space}</span>
            </div>

            {flairStyle && (
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-[10px] font-bold',
                  'tracking-wide uppercase',
                  flairStyle
                )}
              >
                {post.flair}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Avatar
              size="md"
              name={post.author.name}
              src={post.author.avatar}
            />
            <div>
              <p
                className={cn(
                  'text-sm font-semibold',
                  'text-gray-900 dark:text-white'
                )}
              >
                <span
                  className="hover:underline cursor-pointer font-semibold"
                  onClick={goToAuthor}
                >
                  u/{post.author.username}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimeAgo(post.createdAt)}
              </p>
              {post.isEdited && (
                <span className="text-xs text-gray-400 italic">
                  (edited)
                </span>
              )}
            </div>
          </div>

          <h1
            className={cn(
              'text-3xl font-bold text-slate-900 dark:text-white',
              'mb-4 leading-tight'
            )}
          >
            {post.title}
          </h1>

          <div
            className={cn(
              'text-slate-700 dark:text-slate-300',
              'text-base leading-relaxed mb-4',
              'prose dark:prose-invert max-w-none'
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
              {post.content}
            </ReactMarkdown>
          </div>

          {post.imageUrl && (
            <PostImage
              src={post.imageUrl}
              alt={post.title}
              maxHeight="max-h-[500px]"
            />
          )}

          {(post.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className={cn(
                    'px-3 py-1 rounded-full',
                    'bg-gray-100 dark:bg-gray-800',
                    'text-xs font-medium text-gray-600',
                    'dark:text-gray-300 border',
                    'border-gray-200 dark:border-gray-700'
                  )}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <PostDetailActions
            postId={post.id}
            commentCount={commentCount}
            upvotes={upvotes}
            downvotes={downvotes}
            {...voteProps}
          />
        </div>
      </div>
    </article>
  )
}
