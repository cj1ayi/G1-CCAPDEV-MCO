import { Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui'
import { useParams } from 'react-router-dom'
import {
  PostCard,
  DeletePostModal,
} from '@/features/posts/components'
import {
  MainLayout,
} from '@/components/layout/MainLayout'
import {
  useSpacePage,
} from '@/features/spaces/hooks/useSpacePage'
import {
  DefaultLeftSidebar,
} from '@/components/layout'
import {
  EmptyState,
  ErrorState,
  SpacePageSkeleton,
  SpaceRightSkeleton,
} from '@/components/shared'
import { useState } from 'react'
import {
  postService,
} from '@/features/posts/services'
import { Post } from '@/features/posts/types'
import {
  SpaceAboutWidget,
  RulesWidget,
  SpaceHeader,
  SpaceSortBar,
} from '@/features/spaces/components'
import { useToast } from '@/hooks/ToastContext'

export default function Space() {
  const { name } = useParams<{
    name: string
  }>()
  const {
    success: showSuccess,
    error: showError,
  } = useToast()

  const {
    space,
    posts,
    setPosts,
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
    isLoading,
  } = useSpacePage(name)

  const [deleteTarget, setDeleteTarget] =
    useState<Post | null>(null)

  const handleDeletePost = async () => {
    if (!deleteTarget) return
    try {
      await postService.deletePost(
        deleteTarget.id,
      )
      setPosts((prev: Post[]) =>
        prev.filter(
          (p) => p.id !== deleteTarget.id,
        ),
      )
      setDeleteTarget(null)
      showSuccess('Post deleted.')
    } catch {
      showError(
        'Could not delete post.'
        + ' Please try again.',
      )
    }
  }

  if (isLoading) {
    return (
      <MainLayout
        maxWidth="max-w-2xl"
        leftSidebar={<DefaultLeftSidebar />}
        rightSidebar={
          <SpaceRightSkeleton />
        }
      >
        <SpacePageSkeleton />
      </MainLayout>
    )
  }

  if (!space) {
    return (
      <MainLayout
        maxWidth="max-w-full"
        leftSidebar={<DefaultLeftSidebar />}
      >
        <ErrorState
          title="Space Not Found"
          message={
            'This space does not exist.'
          }
          onRetry={
            () => navigate('/spaces')
          }
        />
      </MainLayout>
    )
  }

  return (
    <MainLayout
      maxWidth="max-w-2xl"
      leftSidebar={<DefaultLeftSidebar />}
      rightSidebar={
        <div
          className="flex flex-col gap-4"
        >
          <SpaceAboutWidget
            space={space}
            postCount={posts.length}
          />
          <RulesWidget
            rules={space.rules}
          />
        </div>
      }
    >
      <SpaceHeader
        space={space}
        isJoined={isJoined}
        isOwner={isOwner}
        onToggleJoin={toggleJoin}
        postCount={posts.length}
        onEdit={() =>
          navigate(
            `/r/${space.name}/edit`,
          )
        }
        onDeleteClick={() =>
          setIsDeleteModalOpen(true)
        }
        deleteModal={{
          isOpen: isDeleteModalOpen,
          onConfirm: handleDeleteSpace,
          onClose: () =>
            setIsDeleteModalOpen(false),
        }}
      />

      <Button
        variant="outline"
        fullWidth
        leftIcon={
          <Plus className="size-4" />
        }
        onClick={handleCreatePost}
        className="justify-start mb-6"
      >
        Create a post in r/{space.name}
      </Button>

      <SpaceSortBar
        currentSort={sortBy}
        onSortChange={setSortBy}
      />

      <div className="space-y-4 mt-6">
        {posts.length === 0 ? (
          <EmptyState
            icon={
              <FileText
                className="h-16 w-16"
              />
            }
            title="No posts yet"
            description={
              'Be the first to post'
              + ` in r/${space.name}`
            }
            action={{
              label: 'Create Post',
              onClick: handleCreatePost,
            }}
          />
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              onUpvote={() =>
                handleVote(post.id, 'up')
              }
              onDownvote={() =>
                handleVote(post.id, 'down')
              }
              onClick={() =>
                navigate(
                  `/post/${post.id}`,
                )
              }
              onEdit={
                post.isOwner
                  ? () => navigate(
                    `/post/${post.id}/edit`,
                  )
                  : undefined
              }
              onDelete={
                post.isOwner
                  ? () =>
                    setDeleteTarget(post)
                  : undefined
              }
            />
          ))
        )}
      </div>

      {deleteTarget && (
        <DeletePostModal
          isOpen={!!deleteTarget}
          postTitle={deleteTarget.title}
          onConfirm={handleDeletePost}
          onClose={() =>
            setDeleteTarget(null)
          }
        />
      )}
    </MainLayout>
  )
}
