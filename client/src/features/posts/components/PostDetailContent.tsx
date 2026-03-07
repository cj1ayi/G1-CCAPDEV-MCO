// Location: client/src/features/posts/components/PostDetailContent.tsx

import { cn } from '@/lib/utils'
import { PostDetailVoteColumn } from './PostDetailVoteColumn'
import { PostDetailActions } from './PostDetailActions'
import { Avatar } from '@/components/ui'
import type { PostDetailContentProps } from '../types'
import { formatTimeAgo } from '@/lib/dateUtils'

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
        {/* Vote Column (Desktop) */}
        <PostDetailVoteColumn
          score={score}
          isUpvoted={isUpvoted}
          isDownvoted={isDownvoted}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
        />

        {/* Main Content */}
        <div className="flex-1 p-6 sm:p-8">
          {/* Post Meta */}
          <div className={cn('flex items-center gap-3 mb-4', 'text-sm text-gray-500 dark:text-gray-400')}>
            <div
              className={cn('flex items-center gap-2 font-semibold', 'text-gray-900 dark:text-gray-200', 'hover:underline cursor-pointer')}
              onClick={(e) => { e.stopPropagation(); window.location.href = `/r/${post.space}` }}
            >
              {post.spaceIcon && <img className="w-6 h-6 rounded-full object-cover" src={post.spaceIcon} alt={post.space} />}
              <span>r/{post.space}</span>
            </div>

            {post.flair && (
              <span className={cn(
                'px-2 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase',
                post.flair === 'Question' && ['bg-blue-100 text-blue-700', 'dark:bg-blue-900 dark:text-blue-300'],
                post.flair === 'News' && ['bg-green-100 text-green-700', 'dark:bg-green-900 dark:text-green-300'],
                post.flair === 'Marketplace' && ['bg-yellow-100 text-yellow-700', 'dark:bg-yellow-900 dark:text-yellow-300'],
                post.flair === 'Discussion' && ['bg-purple-100 text-purple-700', 'dark:bg-purple-900 dark:text-purple-300']
              )}>
                {post.flair}
              </span>
            )}
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar size="md" name={post.author.name} src={post.author.avatar} />
            <div>
              <p className={cn('text-sm font-semibold', 'text-gray-900 dark:text-white', 'hover:underline cursor-pointer')}>
                <span className="hover:underline cursor-pointer font-semibold"
                  onClick={(e) => { e.stopPropagation(); window.location.href = `/profile/${post.author.username}` }}
                >
                  u/{post.author.username}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(post.createdAt)}</p>
              {post.isEdited && (
                <span className="text-xs text-gray-400 italic">(edited)</span>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className={cn('text-3xl font-bold text-slate-900 dark:text-white', 'mb-4 leading-tight')}>
            {post.title}
          </h1>

          {/* Content */}
          <div className={cn('text-slate-700 dark:text-slate-300', 'text-base leading-relaxed mb-4')}>
            {post.content}
          </div>

          {/* Image */}
          {post.imageUrl && (
            <div className="mb-4">
              <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg object-cover max-h-[500px]" />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag: string) => (
              <span key={tag} className={cn('px-3 py-1 rounded-full', 'bg-gray-100 dark:bg-gray-800', 'text-xs font-medium text-gray-600', 'dark:text-gray-300 border', 'border-gray-200 dark:border-gray-700')}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions — pass live upvotes/downvotes, not post.upvotes/post.downvotes */}
          <PostDetailActions
            commentCount={commentCount}
            upvotes={upvotes}
            downvotes={downvotes}
            isUpvoted={isUpvoted}
            isDownvoted={isDownvoted}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
          />
        </div>
      </div>
    </article>
  )
}
