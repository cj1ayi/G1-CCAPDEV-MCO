import {
  PostDetailBreadcrumbs,
} from './PostDetailBreadcrumbs'
import { PostOwnerMenu } from './PostOwnerMenu'
import { PostDetailHeaderProps } from '../types'

export function PostDetailHeader({
  post,
  onEdit,
  onDelete,
  onSpaceClick,
}: PostDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <PostDetailBreadcrumbs
        space={post.space}
        title={post.title}
        backUrl="/explore"
        backLabel="Explore"
        onSpaceClick={onSpaceClick}
      />

      {post.isOwner && (
        <PostOwnerMenu
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}
