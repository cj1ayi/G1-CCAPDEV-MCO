import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PostCard,
  DeletePostModal,
} from '@/features/posts/components'
import {
  postService,
} from '@/features/posts/services'
import {
  useVoting,
} from '@/features/votes/VotingContext'
import {
  getCurrentUser,
} from '@/features/auth/services/authService'
import { useToast } from '@/hooks/ToastContext'

export function PostPreviewCard({
  post,
  onUpdate,
}: {
  post: any
  onUpdate?: () => void
}) {
  const navigate = useNavigate()
  const {
    success: showSuccess,
    error: showError,
  } = useToast()

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false)
  const [currentPost, setCurrentPost] =
    useState<typeof post>(post)
  const [isOwner, setIsOwner] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  const { votes, toggleVote } = useVoting()

  useEffect(() => {
    getCurrentUser().then((user) => {
      setIsOwner(
        !!user &&
        !!currentPost?.author &&
        user.id === currentPost.author.id,
      )
    })
  }, [currentPost?.author?.id])

  const handleVote = async (
    voteType: 'up' | 'down',
  ) => {
    if (!currentPost?.id) return
    if (isVoting) return

    const allowed = await toggleVote(
      currentPost.id,
      'post',
      voteType,
    )
    if (!allowed) return

    const previousVote =
      votes[
        `post:${currentPost.id}`
      ] ?? null

    setIsVoting(true)

    setCurrentPost(
      (prev: typeof post) => {
        if (!prev) return prev
        let { upvotes, downvotes } = prev

        if (voteType === 'up') {
          if (previousVote === 'up') {
            upvotes = Math.max(
              0, upvotes - 1,
            )
          } else if (
            previousVote === 'down'
          ) {
            upvotes += 1
            downvotes = Math.max(
              0, downvotes - 1,
            )
          } else {
            upvotes += 1
          }
        } else {
          if (previousVote === 'down') {
            downvotes = Math.max(
              0, downvotes - 1,
            )
          } else if (
            previousVote === 'up'
          ) {
            downvotes += 1
            upvotes = Math.max(
              0, upvotes - 1,
            )
          } else {
            downvotes += 1
          }
        }

        return {
          ...prev,
          upvotes,
          downvotes,
        }
      },
    )

    setIsVoting(false)

    onUpdate?.()
  }

  const handleDelete = async () => {
    if (!post?.id) return
    try {
      await postService.deletePost(post.id)
      setIsDeleteModalOpen(false)
      showSuccess('Post deleted.')
      onUpdate?.()
    } catch {
      showError(
        'Could not delete post.'
        + ' Please try again.',
      )
    }
  }

  const voteKey = `post:${currentPost.id}`
  const voteState = votes[voteKey]

  return (
    <>
      <PostCard
        {...currentPost}
        upvotes={currentPost.upvotes}
        downvotes={currentPost.downvotes}
        commentCount={
          currentPost.commentCount ?? 0
        }
        isUpvoted={voteState === 'up'}
        isDownvoted={voteState === 'down'}
        onClick={() =>
          navigate(
            `/post/${currentPost.id}`,
          )
        }
        onUpvote={() =>
          !isVoting && handleVote('up')
        }
        onDownvote={() =>
          !isVoting && handleVote('down')
        }
        onEdit={
          isOwner
            ? () => navigate(
              `/post/${currentPost.id}/edit`,
            )
            : undefined
        }
        onDelete={
          isOwner
            ? () =>
              setIsDeleteModalOpen(true)
            : undefined
        }
      />

      <DeletePostModal
        isOpen={isDeleteModalOpen}
        postTitle={currentPost.title}
        onConfirm={handleDelete}
        onClose={() =>
          setIsDeleteModalOpen(false)
        }
      />
    </>
  )
}
