import { ProfileTab, PostPreviewCard } from '../components'
import { Card } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { getRelativeTime } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface ProfileActivityProps {
  activeTab: ProfileTab
  posts: any[]
  comments: any[]
  spaces: any[]
  upvotedPosts: any[]
}

export const ProfileActivity = ({ 
  activeTab, 
  posts,
  comments,
  spaces,
  upvotedPosts,
}: ProfileActivityProps) => {
  const navigate = useNavigate()

  if (activeTab === 'Comments') {
    if (comments.length === 0) {
      return (
        <Card className="p-10 text-center text-gray-500">
          No comments yet.
        </Card>
      )
    }
    return (
      <div className="space-y-3">
        {comments.map((comment: any) => (
          <Card
            key={comment._id}
            className={cn(
              'p-4 cursor-pointer',
              'hover:border-primary/50 transition-colors'
            )}
            onClick={() => navigate(`/post/${comment.postId}`)}
          >
            {comment.post && (
              <p className="text-xs text-primary font-medium mb-1">
                {comment.post.space} • {comment.post.title}
              </p>
            )}
            <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
              >
                {comment.content}
              </ReactMarkdown>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {getRelativeTime(comment.createdAt)}
            </p>
          </Card>
        ))}
      </div>
    )
  }

  if (activeTab === 'Spaces') {
    if (spaces.length === 0) {
      return (
        <Card className="p-10 text-center text-gray-500">
          Not a member of any spaces.
        </Card>
      )
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {spaces.map((space: any) => (
          <Card
            key={space._id || space.name}
            className={cn(
              'p-4 cursor-pointer',
              'hover:border-primary/50 transition-colors'
            )}
            onClick={() => navigate(`/r/${space.name}`)}
          >
            <p className="font-semibold text-gray-900 dark:text-white">
              r/{space.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {space.displayName}
            </p>
            {space.description && (
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                {space.description}
              </p>
            )}
          </Card>
        ))}
      </div>
    )
  }

  if (activeTab === 'Upvoted') {
    if (upvotedPosts.length === 0) {
      return (
        <Card className="p-10 text-center text-gray-500">
          No upvoted posts yet.
        </Card>
      )
    }
    return (
      <div className="space-y-4">
        {upvotedPosts.map((post: any) => (
          <PostPreviewCard key={post.id} post={post} />
        ))}
      </div>
    )
  }

  // Overview and Posts both show posts list
  if (posts.length === 0) {
    return (
      <Card className="p-10 text-center text-gray-500">
        No posts yet.
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <PostPreviewCard key={post.id} post={post} />
      ))}
    </div>
  )
}
