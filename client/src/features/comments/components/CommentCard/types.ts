/**
 * CommentCard Component Types
 * 
 * Local types specific to CommentCard components.
 */

/**
 * Author information
 */
export interface Author {
  id: string | number
  username: string
  name?: string
  avatar?: string
}

/**
 * Props for CommentHeader component
 */
export interface CommentHeaderProps {
  author: Author
  createdAt: string
  editedAt?: string
  isOP?: boolean
  isDeleted?: boolean
  badge?: string
  depth: number
}

/**
 * Props for CommentContent component
 */
export interface CommentContentProps {
  content: string
  isDeleted?: boolean
  isEditing: boolean
  editContent: string
  isSaving: boolean
  onEditContentChange: (content: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
}

/**
 * Props for CommentVoting component
 */
export interface CommentVotingProps {
  upvotes: number
  downvotes: number
  isUpvoted?: boolean
  isDownvoted?: boolean
  isDeleted?: boolean
  onUpvote?: () => void
  onDownvote?: () => void
}

/**
 * Props for CommentActions component
 */
export interface CommentActionsProps {
  isDeleted?: boolean
  isReplying: boolean
  onReplyClick: () => void
}

/**
 * Props for CommentMenu component
 */
export interface CommentMenuProps {
  isOwner?: boolean
  isEditing: boolean
  isDeleted?: boolean
  showMenu: boolean
  menuRef: React.RefObject<HTMLDivElement | null>
  onToggleMenu: () => void
  onEditClick: () => void
  onDeleteClick: () => void
}

/**
 * Props for CommentReplyForm component
 */
export interface CommentReplyFormProps {
  onSubmit: (content: string) => Promise<void>
  onCancel: () => void
}
