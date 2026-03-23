import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { Post } from '../../types'
import {
  PostCardVoting,
} from './PostCardVoting'
import {
  PostCardHeader,
} from './PostCardHeader'
import {
  PostCardContent,
} from './PostCardContent'
import { PostActions } from '../PostAction'

export interface PostCardProps {
  post: Post & {
    isUpvoted?: boolean
    isDownvoted?: boolean
  }
  onClick?: () => void
  onUpvote?: () => void
  onDownvote?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const PostCard = ({
  post,
  onClick,
  onUpvote,
  onDownvote,
  onEdit,
  onDelete,
}: PostCardProps) => {
  return (
    <Card
      padding="none"
      className={cn(
        'overflow-hidden',
        'hover:border-gray-300',
        'dark:hover:border-gray-700',
        'transition-colors',
      )}
    >
      <div className="flex">
        <PostCardVoting
          upvotes={post.upvotes}
          downvotes={post.downvotes}
          isUpvoted={
            post.isUpvoted ?? false
          }
          isDownvoted={
            post.isDownvoted ?? false
          }
          onUpvote={onUpvote}
          onDownvote={onDownvote}
        />

        <div
          className={cn(
            'flex-1 min-w-0 p-4',
            'cursor-pointer',
          )}
          onClick={onClick}
        >
          <PostCardHeader
            space={post.space}
            spaceIcon={post.spaceIcon}
            author={post.author}
            createdAt={post.createdAt}
            flair={post.flair}
            isOwner={post.isOwner}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <PostCardContent
            title={post.title}
            content={post.content}
            imageUrl={post.imageUrl}
          />
          <PostActions
            postId={post.id}
            commentCount={
              post.commentCount
            }
            onClick={onClick}
          />
        </div>
      </div>
    </Card>
  )
}

export default PostCard
export { PostCard }
