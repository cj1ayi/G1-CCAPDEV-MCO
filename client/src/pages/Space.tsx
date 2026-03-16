// client/src/pages/Space.tsx

import { Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui'
import { useParams } from 'react-router-dom'
import { PostCard, DeletePostModal } from '@/features/posts/components'
import { MainLayout } from '@/components/layout/MainLayout'
import { useSpacePage } from '@/features/spaces/hooks/useSpacePage'
import { DefaultLeftSidebar, DefaultRightSidebar } from '@/components/layout'
import { EmptyState, ErrorState, FeedSkeleton } from '@/components/shared'
import { useState, useEffect } from 'react'
import { postService } from '@/features/posts/services'
import { commentService } from '@/features/comments/services'
import { getTotalCommentCount } from '@/features/comments/utils/comment-utils'
import { Post } from '@/features/posts/types'
import { SpaceAboutWidget } from '@/features/spaces/components'
import { 
  RulesWidget,
  SpaceHeader,
  SpaceSortBar,
} from '@/features/spaces/components'

type CommentCountMap = Record<string, number>

export default function Space() {
  const { name } = useParams<{ name: string }>()

  const { 
    space, 
    posts, 
    sortBy, 
    isOwner,
    setSortBy, 
    isJoined, 
    toggleJoin, 
    handleCreatePost, 
    handleVote,
    handleDeleteSpace,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleting,
    navigate,
    isLoading
  } = useSpacePage(name)

  const [deletePostModalData, setDeletePostModalData] = useState<Post | null>(null)
  const [commentCounts, setCommentCounts] = useState<CommentCountMap>({})

  useEffect(() => {
    const loadCounts = async () => {
      if (posts.length === 0) return
      const counts: CommentCountMap = {}
      for (const post of posts) {
        try {
          const comments = await commentService.getCommentsByPostId(post.id)
          counts[post.id] = getTotalCommentCount(comments)
        } catch (err) {
          counts[post.id] = post.commentCount
        }
      }
      setCommentCounts(counts)
    }
    loadCounts()
  }, [posts])

  const handleDeletePostConfirm = async () => {
    if (!deletePostModalData) return
    try {
      await postService.deletePost(deletePostModalData.id)
      setDeletePostModalData(null)
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  if (isLoading) {
    return (
      <MainLayout maxWidth="max-w-6xl" leftSidebar={<DefaultLeftSidebar/>} rightSidebar={<DefaultRightSidebar/>}>
        <FeedSkeleton count={5} />
      </MainLayout>
    )
  }

  if (!space) {
    return (
      <MainLayout maxWidth="max-w-full" leftSidebar={<DefaultLeftSidebar/>}>
        <ErrorState title="Space Not Found" message="This space does not exist." onRetry={() => navigate('/spaces')} />
      </MainLayout>
    )
  }

  return (
    <MainLayout
      maxWidth="max-w-6xl"
      leftSidebar={<DefaultLeftSidebar/>} 
      rightSidebar={
        <div className="flex flex-col gap-4">
          <SpaceAboutWidget space={space} postCount={posts.length} />
          <RulesWidget rules={space.rules}/>
        </div>
      }
    >
      <SpaceHeader 
        space={space} 
        isJoined={isJoined} 
        isOwner={isOwner}
        onToggleJoin={toggleJoin} 
        postCount={posts.length} 
        onEdit={() => navigate(`/r/${space.name}/edit`)}
        onDeleteClick={() => setIsDeleteModalOpen(true)}
        deleteModal={{
          isOpen: isDeleteModalOpen,
          onConfirm: handleDeleteSpace,
          onClose: () => setIsDeleteModalOpen(false)
        }}
      />

      <Button
        variant="outline"
        fullWidth
        leftIcon={<Plus className="size-4" />}
        onClick={handleCreatePost}
        className="justify-start mb-6"
      >
        Create a post in r/{space.name}
      </Button>

      <SpaceSortBar currentSort={sortBy} onSortChange={setSortBy} />

      <div className="space-y-4 mt-6">
        {posts.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-16 w-16"/>}
            title="No posts yet"
            description={`Be the the first to post in r/${space.name}`}
            action={{ label: 'Create Post', onClick: handleCreatePost }}
          />
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              commentCount={commentCounts[post.id] ?? post.commentCount}
              onUpvote={() => handleVote(post.id, 'up')}
              onDownvote={() => handleVote(post.id, 'down')}
              onClick={() => navigate(`/post/${post.id}`)}
              onEdit={post.isOwner ? () => navigate(`/post/${post.id}/edit`) : undefined}
              onDelete={post.isOwner ? () => setDeletePostModalData(post) : undefined}
            />
          ))
        )}
      </div>

      {deletePostModalData && (
        <DeletePostModal
          isOpen={!!deletePostModalData}
          postTitle={deletePostModalData.title}
          onConfirm={handleDeletePostConfirm}
          onClose={() => setDeletePostModalData(null)}
        />
      )}
    </MainLayout>
  )
}
