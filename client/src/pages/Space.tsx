import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button, Badge } from '@/components/ui'
import { RulesWidget } from '@/features/spaces/components/RulesWidget'
import { YourSpacesWidget } from '@/features/spaces/components/YourSpacesWidget'
import { SpaceSortBar } from '@/features/spaces/components/SpaceSortBar'
import { spaceService, SortOption } from '@/features/spaces/services/spaceService'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import { PostCard } from '@/features/posts/components'
import { Users, MessageSquare, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_SPACES } from '@/features/spaces/data'

export default function Space() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()
  const [space, setSpace] = useState(MOCK_SPACES.find(s => s.name === name))
  const [isJoined, setIsJoined] = useState(space?.isJoined || false)
  const [sortBy, setSortBy] = useState<SortOption>('hot')

  const posts = useMemo(
    () => spaceService.getSpacePosts(name || '', sortBy),
    [name, sortBy]
  )

  const postCount = posts.length

  useEffect(() => {
    const foundSpace = MOCK_SPACES.find(s => s.name === name)
    if (foundSpace) {
      setSpace(foundSpace)
      setIsJoined(foundSpace.isJoined || false)
    }
  }, [name])

  if (!space) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className={cn(
            "text-2xl font-bold mb-4 dark:text-white"
            )}
          >
            Space Not Found
          </h1>
          <Button onClick={() => navigate('/spaces')}>
            Browse Spaces
          </Button>
        </div>
      </MainLayout>
    )
  }

  const handleToggleJoin = () => {
    setIsJoined(!isJoined)
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
          {/* About Widget */}
          <div className={cn(
            "bg-white dark:bg-surface-dark rounded-lg border",
            "border-gray-200 dark:border-gray-800 p-4"
            )}
          >
            <h3 className={cn(
              "text-sm font-bold uppercase mb-3 flex",
              "items-center gap-2 dark:text-white"
              )}
            >
              <span className={cn(
                "material-symbols-outlined",
                "text-[16px] text-gray-400"
                )}
              >
                info
              </span>
              About Space
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {space.description}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Created
                </span>
                <span className="font-semibold dark:text-white">
                  {space.createdDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Members
                </span>
                <span className="font-semibold dark:text-white">
                  {space.memberCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Posts
                </span>
                <span className="font-semibold dark:text-white">
                  {postCount}
                </span>
              </div>
            </div>
          </div>

          {/* Rules Widget */}
          <RulesWidget rules={space.rules} />
        </div>
      }
    >
      {/* Space Header */}
      <div className="mb-6">
        {/* Banner */}
        {space.bannerUrl && (
          <div className={cn(
            "relative h-32 md:h-48 rounded-lg overflow-hidden mb-4"
            )}
          >
            <img
              src={space.bannerUrl}
              alt={space.displayName}
              className="w-full h-full object-cover"
            />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t",
              "from-black/60 to-transparent"
              )}
            />
          </div>
        )}

        {/* Space Info */}
        <div className="flex items-start gap-4">
          {/* Space Icon */}
          <div
            className={cn(
              'size-16 md:size-20 rounded-xl flex items-center',
              'justify-center text-white shadow-lg',
              space.iconType === 'text' && 
                `bg-gradient-to-br ${space.colorScheme}`
            )}
          >
            {space.iconType === 'image' ? (
              <img src={space.icon} 
              className="size-full object-cover rounded-xl" alt="" />
            ) : (
              <span className="font-black text-3xl md:text-4xl">
                {space.icon}
              </span>
            )}
          </div>

          {/* Space Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className={cn(
                  "text-2xl md:text-3xl font-black mb-1 dark:text-white"
                  )}
                >
                  {space.displayName}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  r/{space.name}
                </p>
              </div>

              {/* Join Button */}
              <Button
                variant={isJoined ? 'secondary' : 'primary'}
                size="md"
                leftIcon={isJoined ? <Check className="size-4" /> : 
                  <Plus className="size-4" />}
                onClick={handleToggleJoin}
                className="shrink-0"
              >
                {isJoined ? 'Joined' : 'Join'}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-3">
              <div className={cn(
                "flex items-center gap-2 text-gray-600 dark:text-gray-400"
                )}
              >
                <Users className="size-4" />
                <span className="text-sm font-semibold">
                  {space.memberCount} members
                </span>
              </div>
              <div className={cn(
                "flex items-center gap-2 text-gray-600 dark:text-gray-400"
                )}
              >
                <MessageSquare className="size-4" />
                <span className="text-sm font-semibold">
                  {postCount} posts
                </span>
              </div>
              <Badge variant="secondary" size="sm">
                {space.category}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          fullWidth
          leftIcon={<Plus className="size-4" />}
          onClick={() => navigate('/post/create', { 
            state: { space: space.name } })}
          className="justify-start"
        >
          Create a post in r/{space.name}
        </Button>
      </div>

      {/* Sort Bar */}
      <SpaceSortBar currentSort={sortBy} onSortChange={setSortBy} />

      {/* Posts Section */}
      <div className="space-y-4 mt-6">
        {posts.length === 0 ? (
          /* No posts yet */
          <div className={cn(
            "text-center py-16 bg-gray-50 dark:bg-surface-darker",
            "rounded-lg border-2 border-dashed border-gray-200",
            "dark:border-gray-800"
            )}
          >
            <MessageSquare className="size-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-bold mb-2 dark:text-white">
              No posts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Be the first to post in this space!
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/post/create', { 
                state: { 
                    space: space.name 
                } 
              })}
            >
              Create First Post
            </Button>
          </div>
        ) : (
          /* Display Posts */
          posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              content={post.content}
              author={post.author}
              space={post.space}
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              commentCount={post.commentCount}
              createdAt={post.createdAt}
              isOwner={post.isOwner}
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
