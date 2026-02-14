import { Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { useParams } from 'react-router-dom'
import { PostCard } from '@/features/posts/components'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { useSpacePage } from '@/features/spaces/hooks/useSpacePage'

import { 
  SpaceHeader,
  SpaceAboutWidget,
  RulesWidget,
  YourSpacesWidget,
  SpaceSortBar,
  SpaceEmptyState
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
    navigate 
  } = useSpacePage(name)

  if (!space) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">
            Space Not Found
          </h1>
          <Button onClick={() => navigate('/spaces')}>Browse Spaces</Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      maxWidth="max-w-6xl"
      leftSidebar={
        <div className="flex flex-col gap-6">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </div>
      } 
      rightSidebar={
        <div className="space-y-4">
          <SpaceAboutWidget space={space} postCount={posts.length} />
          <RulesWidget rules={space.rules} />
        </div>
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
          <SpaceEmptyState 
            spaceName={space.name} 
            onCreatePost={handleCreatePost} 
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
