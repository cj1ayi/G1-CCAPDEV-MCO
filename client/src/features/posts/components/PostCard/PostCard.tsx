import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { PostCardProps } from '../../types'
import { PostCardVoting } from './PostCardVoting'
import { PostCardHeader } from './PostCardHeader'
import { PostCardContent } from './PostCardContent'
import { PostActions } from '../PostAction'

const PostCard = ({
  id,
  title,
  content,
  author,
  space,
  spaceIcon,
  flair,
  upvotes,
  downvotes,
  commentCount,
  createdAt,
  imageUrl,
  isUpvoted = false,
  isDownvoted = false,
  isOwner = false,
  onUpvote,
  onDownvote,
  onEdit,
  onDelete,
  onClick,
}: PostCardProps) => {
  return (
    <Card
      padding="none"
      className={cn(
        "overflow-hidden",
        "hover:border-gray-300 dark:hover:border-gray-700",
        "transition-colors"
      )}
    >
      <div className="flex">
        {/* Vote Column */}
        <PostCardVoting
          upvotes={upvotes}
          downvotes={downvotes}
          isUpvoted={isUpvoted}
          isDownvoted={isDownvoted}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
        />

        {/* Content Column */}
        <div
          className="flex-1 p-4 cursor-pointer"
          onClick={onClick}
        >
          {/* Header */}
          <PostCardHeader
            space={space}
            spaceIcon={spaceIcon}
            author={author}
            createdAt={createdAt}
            flair={flair}
            isOwner={isOwner}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          {/* Content */}
          <PostCardContent
            title={title}
            content={content}
            imageUrl={imageUrl}
          />

          {/* Actions */}
          <PostActions
            postId={id}
            commentCount={commentCount}
            onClick={onClick}
          />
        </div>
      </div>
    </Card>
  )
}

export default PostCard
export { PostCard }
