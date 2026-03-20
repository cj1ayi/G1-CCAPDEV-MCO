import { useNavigate } from 'react-router-dom'
import {
  Search as SearchIcon,
  FileText,
  Hash,
  User as UserIcon,
  Users,
} from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { Card, Avatar, Badge } from '@/components/ui'
import {
  PostCard,
} from '@/features/posts/components'
import { EmptyState } from '@/components/shared'
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
} from '@/components/shared/Skeleton'
import {
  useSearch,
  SearchTab,
} from '../hooks/useSearch'
import type {
  SearchPostResult,
  SearchSpaceResult,
  SearchUserResult,
} from '../services/searchService'

/* ─── Tab config ──────────────────────── */

interface TabConfig {
  key: SearchTab
  label: string
  icon: typeof FileText
}

const TABS: TabConfig[] = [
  { key: 'posts', label: 'Posts', icon: FileText },
  { key: 'spaces', label: 'Spaces', icon: Hash },
  { key: 'users', label: 'People', icon: UserIcon },
]

/* ─── Skeleton rows ─────────────────────── */

const PostSkeleton = () => (
  <Card padding="none" className="overflow-hidden">
    <div className="flex">
      <div
        className={cn(
          'w-12 bg-gray-50',
          'dark:bg-surface-darker',
          'flex flex-col items-center',
          'py-3 gap-1 border-r',
          'border-gray-100',
          'dark:border-gray-800 shrink-0',
        )}
      >
        <Skeleton className="h-5 w-5" />
        <Skeleton
          className="h-4 w-7"
          variant="text"
        />
        <Skeleton className="h-5 w-5" />
      </div>
      <div className="flex-1 p-4 space-y-3">
        <div className="flex items-center gap-1.5">
          <Skeleton
            className="h-3 w-20"
            variant="text"
          />
          <Skeleton
            className="h-3 w-24"
            variant="text"
          />
        </div>
        <Skeleton
          className="h-5 w-3/4"
          variant="text"
        />
        <SkeletonText lines={2} />
      </div>
    </div>
  </Card>
)

const SpaceSkeleton = () => (
  <Card className="flex items-center gap-4">
    <Skeleton className="size-12 rounded-xl" />
    <div className="flex-1 space-y-1">
      <Skeleton
        className="h-5 w-40"
        variant="text"
      />
      <Skeleton
        className="h-3 w-56"
        variant="text"
      />
    </div>
    <Skeleton className="h-8 w-16 rounded-lg" />
  </Card>
)

const UserSkeleton = () => (
  <Card className="flex items-center gap-4">
    <SkeletonAvatar size="lg" />
    <div className="flex-1 space-y-1">
      <Skeleton
        className="h-4 w-32"
        variant="text"
      />
      <Skeleton
        className="h-3 w-48"
        variant="text"
      />
    </div>
  </Card>
)

function ResultsSkeleton({
  tab,
}: {
  tab: SearchTab
}) {
  const count = 4
  const Row = tab === 'spaces'
    ? SpaceSkeleton
    : tab === 'users'
      ? UserSkeleton
      : PostSkeleton

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map(
        (_, i) => <Row key={i} />,
      )}
    </div>
  )
}

/* ─── Result cards ────────────────────── */

function PostResult({
  post,
}: {
  post: SearchPostResult
}) {
  const navigate = useNavigate()

  const author = post.author ?? {
    id: '',
    username: 'deleted',
    name: 'Deleted User',
    avatar: '',
  }

  const upvotes = Number(post.upvotes) || 0
  const downvotes =
    Number(post.downvotes) || 0

  return (
    <PostCard
      id={post.id}
      title={post.title ?? ''}
      content={post.content ?? ''}
      space={post.space ?? ''}
      flair={post.flair}
      author={author}
      upvotes={upvotes}
      downvotes={downvotes}
      commentCount={post.commentCount ?? 0}
      createdAt={post.createdAt ?? ''}
      imageUrl={post.imageUrl}
      tags={post.tags ?? []}
      isOwner={post.isOwner ?? false}
      isUpvoted={false}
      isDownvoted={false}
      onClick={
        () => navigate(`/post/${post.id}`)
      }
      onEdit={
        post.isOwner
          ? () => navigate(
            `/post/${post.id}/edit`,
          )
          : undefined
      }
    />
  )
}

function SpaceResult({
  space,
}: {
  space: SearchSpaceResult
}) {
  const navigate = useNavigate()

  return (
    <Card
      hover
      onClick={
        () => navigate(`/r/${space.name}`)
      }
      className="flex items-center gap-4"
    >
      {space.icon ? (
        <img
          src={space.icon}
          alt=""
          className={cn(
            'size-12 rounded-xl',
            'object-cover',
          )}
          onError={(e) => {
            const el = e.currentTarget
            el.style.display = 'none'
          }}
        />
      ) : (
        <div
          className={cn(
            'size-12 rounded-xl',
            'bg-gradient-to-br',
            'from-primary to-primary-dark',
            'flex items-center justify-center',
            'text-white font-black text-lg',
          )}
        >
          {(space.displayName ?? space.name ?? '?')
            .charAt(0)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-bold',
            'text-gray-900 dark:text-white',
            'truncate',
          )}
        >
          {space.displayName ?? space.name}
        </p>
        <p
          className={cn(
            'text-sm text-gray-500',
            'dark:text-gray-400 truncate',
          )}
        >
          r/{space.name}
          <span className="mx-1">
            &middot;
          </span>
          {formatNumber(
            space.memberCount ?? 0,
          )}{' '}
          members
        </p>
      </div>

      <Badge
        variant="secondary"
        size="sm"
        className="shrink-0"
      >
        {space.category}
      </Badge>
    </Card>
  )
}

function UserResult({
  user,
}: {
  user: SearchUserResult
}) {
  const navigate = useNavigate()

  return (
    <Card
      hover
      onClick={
        () => navigate(
          `/profile/${user.username}`,
        )
      }
      className="flex items-center gap-4"
    >
      <Avatar
        name={user.name}
        src={user.avatar}
        size="lg"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-bold',
            'text-gray-900 dark:text-white',
          )}
        >
          u/{user.username}
        </p>
        <p
          className={cn(
            'text-sm text-gray-500',
            'dark:text-gray-400 truncate',
          )}
        >
          {user.name}
          {user.bio && (
            <>
              <span className="mx-1">
                &middot;
              </span>
              {user.bio}
            </>
          )}
        </p>
      </div>
    </Card>
  )
}

/* ─── Tab bar ──────────────────────── */

function TabBar({
  tab,
  counts,
  onTabChange,
}: {
  tab: SearchTab
  counts: Record<SearchTab, number>
  onTabChange: (t: SearchTab) => void
}) {
  return (
    <div
      className={cn(
        'flex gap-1 border-b',
        'border-gray-200 dark:border-gray-800',
      )}
    >
      {TABS.map(({ key, label, icon: Icon }) => {
        const active = key === tab
        const count = counts[key] ?? 0

        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={cn(
              'flex items-center gap-2',
              'px-4 py-3 text-sm font-medium',
              'border-b-2 -mb-px',
              'transition-colors',
              active
                ? 'border-primary text-primary'
                : cn(
                  'border-transparent',
                  'text-gray-500',
                  'dark:text-gray-400',
                  'hover:text-gray-700',
                  'dark:hover:text-gray-200',
                ),
            )}
          >
            <Icon className="size-4" />
            {label}
            {count > 0 && (
              <span
                className={cn(
                  'text-xs px-1.5 py-0.5',
                  'rounded-full',
                  active
                    ? cn(
                      'bg-primary/10',
                      'text-primary',
                    )
                    : cn(
                      'bg-gray-100',
                      'dark:bg-gray-800',
                      'text-gray-500',
                    ),
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Results list per tab ──────────────── */

function ResultsList({
  tab,
  results,
}: {
  tab: SearchTab
  results: any[]
}) {
  return (
    <div className="space-y-4">
      {tab === 'posts' &&
        results.map((p: SearchPostResult) => (
          <PostResult key={p.id} post={p} />
        ))}

      {tab === 'spaces' &&
        results.map((s: SearchSpaceResult) => (
          <SpaceResult key={s.id} space={s} />
        ))}

      {tab === 'users' &&
        results.map((u: SearchUserResult) => (
          <UserResult key={u.id} user={u} />
        ))}
    </div>
  )
}

/* ─── Main component ────────────────────── */

export function SearchResults() {
  const {
    query,
    tab,
    setTab,
    results,
    counts,
    pagination,
    isLoading,
    loadMore,
  } = useSearch()

  if (!query) {
    return (
      <EmptyState
        icon={
          <SearchIcon className="h-16 w-16" />
        }
        title="Search AnimoForums"
        description={
          'Find posts, spaces, and people'
          + ' across the community.'
        }
      />
    )
  }

  const noResults =
    !isLoading && results.length === 0

  const emptyMessages: Record<
    SearchTab,
    string
  > = {
    posts: 'No posts match your search.',
    spaces: 'No spaces match your search.',
    users: 'No people match your search.',
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-1">
        <h1
          className={cn(
            'text-2xl font-bold',
            'text-gray-900 dark:text-white',
            'tracking-tight',
          )}
        >
          Results for{' '}
          <span className="text-primary">
            &ldquo;{query}&rdquo;
          </span>
        </h1>
        <p
          className={cn(
            'text-sm text-gray-500',
            'dark:text-gray-400',
          )}
        >
          {isLoading
            ? 'Searching...'
            : `${pagination.total} result${
              pagination.total !== 1 ? 's' : ''
            }`}
        </p>
      </div>

      {/* Tabs */}
      <TabBar
        tab={tab}
        counts={counts}
        onTabChange={setTab}
      />

      {/* Body */}
      {isLoading && results.length === 0 ? (
        <ResultsSkeleton tab={tab} />
      ) : noResults ? (
        <EmptyState
          icon={
            <SearchIcon
              className="h-12 w-12"
            />
          }
          title="No results"
          description={emptyMessages[tab]}
        />
      ) : (
        <>
          <ResultsList
            tab={tab}
            results={results}
          />

          {pagination.hasMore && (
            <div className="flex justify-center py-4">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className={cn(
                  'px-6 py-2 rounded-lg',
                  'text-sm font-medium',
                  'bg-gray-100',
                  'dark:bg-gray-800',
                  'hover:bg-gray-200',
                  'dark:hover:bg-gray-700',
                  'transition-colors',
                  isLoading &&
                    'opacity-50 cursor-wait',
                )}
              >
                {isLoading
                  ? 'Loading...'
                  : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
