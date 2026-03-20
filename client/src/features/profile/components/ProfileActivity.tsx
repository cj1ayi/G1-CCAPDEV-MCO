import {
  ProfileTab,
  PostPreviewCard,
} from '../components'
import { Card } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { cn, getRelativeTime } from '@/lib/utils'
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

/** Only render images with valid http(s) URLs. */
function SafeImg({
  node,
  ...props
}: any) {
  const src = props.src ?? ''
  try {
    const url = new URL(src)
    const isHttp =
      url.protocol === 'http:'
      || url.protocol === 'https:'
    if (!isHttp) return null
  } catch {
    return null
  }

  return (
    <img
      {...props}
      loading="lazy"
      className={cn(
        'max-w-full rounded',
        props.className,
      )}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}

function SafeLink({ node, ...props }: any) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
      onClick={(e) => e.stopPropagation()}
    />
  )
}

const MD_COMPONENTS = {
  a: SafeLink,
  img: SafeImg,
}

const MD_REMARK = [remarkGfm]
const MD_REHYPE = [rehypeRaw]

function CommentsList({
  comments,
  navigate,
}: {
  comments: any[]
  navigate: ReturnType<typeof useNavigate>
}) {
  if (comments.length === 0) {
    return (
      <Card
        className={cn(
          'p-10 text-center text-gray-500',
        )}
      >
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
            'hover:border-primary/50',
            'transition-colors',
          )}
          onClick={
            () => navigate(
              `/post/${comment.postId}`,
            )
          }
        >
          {comment.post && (
            <p
              className={cn(
                'text-xs text-primary',
                'font-medium mb-1',
              )}
            >
              {comment.post.space}
              {' • '}
              {comment.post.title}
            </p>
          )}

          <div
            className={cn(
              'text-sm text-gray-700',
              'dark:text-gray-300',
              'line-clamp-2 prose prose-sm',
              'dark:prose-invert max-w-none',
            )}
          >
            <ReactMarkdown
              remarkPlugins={MD_REMARK}
              rehypePlugins={MD_REHYPE}
              components={MD_COMPONENTS}
            >
              {comment.content}
            </ReactMarkdown>
          </div>

          <p
            className={cn(
              'text-xs text-gray-400 mt-2',
            )}
          >
            {getRelativeTime(comment.createdAt)}
          </p>
        </Card>
      ))}
    </div>
  )
}

function SpacesList({
  spaces,
  navigate,
}: {
  spaces: any[]
  navigate: ReturnType<typeof useNavigate>
}) {
  if (spaces.length === 0) {
    return (
      <Card
        className={cn(
          'p-10 text-center text-gray-500',
        )}
      >
        Not a member of any spaces.
      </Card>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1',
        'sm:grid-cols-2 gap-4',
      )}
    >
      {spaces.map((space: any) => (
        <Card
          key={space._id ?? space.name}
          className={cn(
            'p-4 cursor-pointer',
            'hover:border-primary/50',
            'transition-colors',
          )}
          onClick={
            () => navigate(`/r/${space.name}`)
          }
        >
          <p
            className={cn(
              'font-semibold',
              'text-gray-900 dark:text-white',
            )}
          >
            r/{space.name}
          </p>
          <p
            className={cn(
              'text-sm text-gray-500',
              'dark:text-gray-400 mt-1',
            )}
          >
            {space.displayName}
          </p>
          {space.description && (
            <p
              className={cn(
                'text-xs text-gray-400',
                'mt-2 line-clamp-2',
              )}
            >
              {space.description}
            </p>
          )}
        </Card>
      ))}
    </div>
  )
}

function UpvotedList({
  upvotedPosts,
}: {
  upvotedPosts: any[]
}) {
  if (upvotedPosts.length === 0) {
    return (
      <Card
        className={cn(
          'p-10 text-center text-gray-500',
        )}
      >
        No upvoted posts yet.
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {upvotedPosts.map((post: any) => (
        <PostPreviewCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  )
}

function PostsList({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <Card
        className={cn(
          'p-10 text-center text-gray-500',
        )}
      >
        No posts yet.
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <PostPreviewCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  )
}

function OverviewTab({
  posts,
  comments,
  spaces,
  navigate,
}: {
  posts: any[]
  comments: any[]
  spaces: any[]
  navigate: ReturnType<typeof useNavigate>
}) {
  const hasNone =
    posts.length === 0
    && comments.length === 0
    && spaces.length === 0

  if (hasNone) {
    return (
      <Card
        className={cn(
          'p-10 text-center text-gray-500',
        )}
      >
        No activity yet.
      </Card>
    )
  }

  const topPosts = posts.slice(0, 5)
  const topComments = comments.slice(0, 5)
  const topSpaces = spaces.slice(0, 5)

  return (
    <div className="space-y-6">
      {topPosts.length > 0 && (
        <section>
          <h3
            className={cn(
              'text-sm font-bold uppercase',
              'tracking-wide text-gray-400',
              'mb-3',
            )}
          >
            Posts
          </h3>
          <div className="space-y-4">
            {topPosts.map((post: any) => (
              <PostPreviewCard
                key={post.id}
                post={post}
              />
            ))}
          </div>
        </section>
      )}

      {topComments.length > 0 && (
        <section>
          <h3
            className={cn(
              'text-sm font-bold uppercase',
              'tracking-wide text-gray-400',
              'mb-3',
            )}
          >
            Recent Comments
          </h3>
          <CommentsList
            comments={topComments}
            navigate={navigate}
          />
        </section>
      )}

      {topSpaces.length > 0 && (
        <section>
          <h3
            className={cn(
              'text-sm font-bold uppercase',
              'tracking-wide text-gray-400',
              'mb-3',
            )}
          >
            Spaces
          </h3>
          <div
            className={cn(
              'grid grid-cols-1',
              'sm:grid-cols-2 gap-3',
            )}
          >
            {topSpaces.map((space: any) => (
              <Card
                key={
                  space._id
                  ?? space.name
                }
                hover
                onClick={
                  () => navigate(
                    `/r/${space.name}`,
                  )
                }
                className="p-4"
              >
                <p
                  className={cn(
                    'font-semibold',
                    'text-gray-900',
                    'dark:text-white',
                  )}
                >
                  r/{space.name}
                </p>
                {space.displayName && (
                  <p
                    className={cn(
                      'text-xs',
                      'text-gray-500',
                      'dark:text-gray-400',
                      'mt-0.5',
                    )}
                  >
                    {space.displayName}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export const ProfileActivity = ({
  activeTab,
  posts,
  comments,
  spaces,
  upvotedPosts,
}: ProfileActivityProps) => {
  const navigate = useNavigate()

  if (activeTab === 'Overview') {
    return (
      <OverviewTab
        posts={posts}
        comments={comments}
        spaces={spaces}
        navigate={navigate}
      />
    )
  }

  if (activeTab === 'Comments') {
    return (
      <CommentsList
        comments={comments}
        navigate={navigate}
      />
    )
  }

  if (activeTab === 'Spaces') {
    return (
      <SpacesList
        spaces={spaces}
        navigate={navigate}
      />
    )
  }

  if (activeTab === 'Upvoted') {
    return (
      <UpvotedList
        upvotedPosts={upvotedPosts}
      />
    )
  }

  return <PostsList posts={posts} />
}
