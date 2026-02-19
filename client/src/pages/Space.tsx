import { Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { useParams } from 'react-router-dom'
import { PostCard } from '@/features/posts/components'
import { MainLayout } from '@/components/layout/MainLayout'
import { useSpacePage } from '@/features/spaces/hooks/useSpacePage'
import { DefaultLeftSidebar, DefaultRightSidebar } from '@/components/layout'
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/shared'
import { FileText } from 'lucide-react'

import { 
  SpaceHeader,
  SpaceSortBar,
} from '@/features/spaces/components'

export default function Space() {
  const { name } = useParams<{ name: string }>()

  const { 
    space, 
    posts, 
    sortBy, 
    setSortBy, 
    isJoined, 
    toggleJoin, 
    handleCreatePost, 
    handleVote,
    navigate,
    isLoading
  } = useSpacePage(name)


  if (isLoading) {
    return (
      <MainLayout
        maxWidth="max-w-full"
        leftSidebar={
          <DefaultLeftSidebar/>
        }
      >
        <LoadingSpinner text="Loading space..." />
      </MainLayout>
    )
  }

  if (!space) {
    return (
   <MainLayout
      maxWidth="max-w-full"
      leftSidebar={
        <DefaultLeftSidebar/>
      }
    >
      <ErrorState
        title="Space Not Found"
        message="This space does not exist."
        onRetry={() => navigate('/spaces')}
      />
    </MainLayout>
    )
  }

  return (
    <MainLayout
      maxWidth="max-w-6xl"
      leftSidebar={
        <DefaultLeftSidebar/>
      } 
      rightSidebar={
        <DefaultRightSidebar/>
      }
    >
      {/* 2. Header Section */}
      <SpaceHeader 
        space={space} 
        isJoined={isJoined} 
        onToggleJoin={toggleJoin} 
        postCount={posts.length} 
      />

      {/* 3. Global Action Trigger */}
      <Button
        variant="outline"
        fullWidth
        leftIcon={<Plus className="size-4" />}
        onClick={handleCreatePost}
        className="justify-start mb-6"
      >
        Create a post in r/{space.name}
      </Button>

      {/* 4. Feed Controls */}
      <SpaceSortBar currentSort={sortBy} onSortChange={setSortBy} />

      {/* 5. Posts Feed */}
      <div className="space-y-4 mt-6">
        {posts.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-16 w-16"/>}
            title="No posts yet"
            description={`Be the the first to post in r/${space.name}`}
            action={{
              label: 'Create Post',
              onClick: handleCreatePost
            }}
          />
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              onUpvote={() => handleVote(post.id, 'up')}
              onDownvote={() => handleVote(post.id, 'down')}
              onClick={() => navigate(`/post/${post.id}`)}
              onEdit={() => navigate(`/post/${post.id}/edit`)}
              onDelete={() => console.log('Delete post:', post.id)}
            />
          ))
        )}
      </div>
    </MainLayout>
  )
}
