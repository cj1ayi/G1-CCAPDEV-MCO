import { cn } from '@/lib/utils'
import { Card } from '@/components/ui'
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
} from './Skeleton'

/** Header: avatar scales down on mobile. */
const HeaderSkeleton = () => (
  <div
    className={cn(
      'px-4 md:px-8 py-5',
      'border-b border-gray-200',
      'dark:border-gray-800',
    )}
  >
    <div className="flex items-center gap-3">
      <SkeletonAvatar
        size="lg"
        className={cn(
          'h-16 w-16 md:h-24 md:w-24',
          'shrink-0',
        )}
      />
      <div className="flex-1 space-y-1">
        <Skeleton
          className="h-6 md:h-7 w-40"
          variant="text"
        />
        <Skeleton
          className="h-4 w-24"
          variant="text"
        />
      </div>
      <Skeleton
        className={cn(
          'h-9 w-28 rounded-lg',
          'hidden sm:block',
        )}
      />
    </div>
  </div>
)

/** 4 pill tab placeholders in content col. */
const NavbarSkeleton = () => (
  <div className="py-3">
    <div
      className={cn(
        'grid grid-cols-1',
        'lg:grid-cols-12',
        'gap-4 lg:gap-6',
      )}
    >
      <div className="lg:col-span-8">
        <div
          className={cn(
            'flex items-center',
            'bg-gray-100',
            'dark:bg-surface-dark',
            'rounded-xl p-1',
          )}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'flex-1 flex',
                'justify-center py-2',
              )}
            >
              <Skeleton
                className="h-4 w-16 rounded"
                variant="text"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

/** Post card skeleton. */
const PostSkeleton = () => (
  <Card
    padding="none"
    className="overflow-hidden"
  >
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
      <div
        className={cn(
          'flex-1 min-w-0 p-4 space-y-3',
        )}
      >
        <div
          className="flex items-center gap-1.5"
        >
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

/** Sidebar: profile card + bio + spaces. */
const SidebarSkeleton = () => (
  <aside className="w-full space-y-4">
    <Card padding="none">
      {/* Banner — matches actual gray */}
      <div
        className={cn(
          'h-20 rounded-t-xl',
          'bg-gray-200 dark:bg-gray-800',
        )}
      />
      <div className="px-4 pb-4">
        <div className="-mt-8 mb-3">
          <SkeletonAvatar
            size="lg"
            className="h-16 w-16"
          />
        </div>
        <Skeleton
          className="h-5 w-28 mb-1"
          variant="text"
        />
        <Skeleton
          className="h-3 w-20 mb-3"
          variant="text"
        />
        <Skeleton
          className="h-9 w-full rounded-lg"
        />
      </div>

      {/* Stats: 2 cols (Posts, Comments) */}
      <div
        className={cn(
          'border-t border-gray-100',
          'dark:border-gray-800',
          'px-4 py-3 grid grid-cols-2',
          'gap-3',
        )}
      >
        {[0, 1].map((i) => (
          <div key={i} className="space-y-1">
            <Skeleton
              className="h-4 w-8"
              variant="text"
            />
            <Skeleton
              className="h-3 w-14"
              variant="text"
            />
          </div>
        ))}
      </div>

      {/* Joined */}
      <div
        className={cn(
          'border-t border-gray-100',
          'dark:border-gray-800',
          'px-4 py-3',
        )}
      >
        <Skeleton
          className="h-3 w-24"
          variant="text"
        />
      </div>
    </Card>

    <Card>
      <Skeleton
        className="h-3 w-12 mb-2"
        variant="text"
      />
      <SkeletonText lines={2} />
    </Card>

    <Card>
      <Skeleton
        className="h-3 w-14 mb-3"
        variant="text"
      />
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            className="h-4 w-24"
            variant="text"
          />
        ))}
      </div>
    </Card>
  </aside>
)

export const ProfilePageSkeleton = () => (
  <>
    <div className="relative -mx-4 md:-mx-6">
      <HeaderSkeleton />
    </div>

    <NavbarSkeleton />

    <div
      className={cn(
        'grid grid-cols-1',
        'lg:grid-cols-12',
        'gap-4 lg:gap-6',
      )}
    >
      {/* Sidebar first on mobile */}
      <aside
        className={cn(
          'lg:col-span-4',
          'lg:col-start-9',
          'order-first lg:order-none',
        )}
      >
        <SidebarSkeleton />
      </aside>

      <main
        className={cn(
          'lg:col-span-8',
          'lg:col-start-1',
          'lg:row-start-1',
        )}
      >
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </main>
    </div>
  </>
)
