import { cn } from '@/lib/utils'
import { Card } from '@/components/ui'
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
} from './Skeleton'

/** Matches ProfileHeader: full-bleed with border. */
const HeaderSkeleton = () => (
  <div
    className={cn(
      'border-b border-gray-200',
      'dark:border-gray-800',
      'px-4 md:px-8 py-4',
    )}
  >
    <div className="max-w-7xl mx-auto">
      <div
        className={cn(
          'flex flex-col sm:flex-row',
          'sm:items-center',
          'sm:justify-between gap-3',
        )}
      >
        <div className="flex items-center gap-3">
          <SkeletonAvatar
            size="lg"
            className="h-16 w-16 shrink-0"
          />
          <div className="space-y-1">
            <Skeleton
              className="h-6 w-36"
              variant="text"
            />
            <Skeleton
              className="h-4 w-24"
              variant="text"
            />
          </div>
        </div>

        <Skeleton
          className="h-9 w-28 rounded-lg"
        />
      </div>
    </div>
  </div>
)

/** Matches ProfileNavbar: 5 tab placeholders. */
const NavbarSkeleton = () => (
  <div
    className={cn(
      'bg-white dark:bg-[#1a1a1b]',
      'border-b border-border-light',
      'dark:border-gray-700',
    )}
  >
    <div
      className={cn(
        'max-w-7xl mx-auto',
        'flex items-center',
        'pl-4 pr-8 md:px-10',
        'gap-4 sm:gap-8',
      )}
    >
      {[16, 12, 20, 14, 16].map((w, i) => (
        <div key={i} className="py-4">
          <Skeleton
            className={`h-4 rounded`}
            style={{ width: `${w * 4}px` }}
            variant="text"
          />
        </div>
      ))}
    </div>
  </div>
)

/** Matches AboutWidget card. */
const AboutSkeleton = () => (
  <Card>
    <Skeleton
      className="h-5 w-24 mb-3"
      variant="text"
    />
    <SkeletonText lines={2} />
  </Card>
)

/** Matches StatsWidget: 3 stat rows. */
const StatsSkeleton = () => (
  <Card>
    <Skeleton
      className="h-5 w-32 mb-3"
      variant="text"
    />
    {[0, 1, 2].map((i) => (
      <div key={i}>
        <div
          className={cn(
            'h-px w-full bg-gray-200',
            'dark:bg-gray-700 my-3',
          )}
        />
        <div
          className="flex items-center gap-2"
        >
          <Skeleton className="h-4 w-4" />
          <Skeleton
            className="h-4 w-24"
            variant="text"
          />
        </div>
      </div>
    ))}
  </Card>
)

/** Matches SpacesWidget: title + 3 rows. */
const SpacesSkeleton = () => (
  <Card>
    <Skeleton
      className="h-5 w-16 mb-3"
      variant="text"
    />
    <div
      className={cn(
        'h-px w-full bg-gray-200',
        'dark:bg-gray-700 mb-3',
      )}
    />
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-2"
        >
          <Skeleton
            className="h-4 w-20"
            variant="text"
          />
          <Skeleton
            className="h-3 w-28"
            variant="text"
          />
        </div>
      ))}
    </div>
  </Card>
)

/** Sidebar skeleton: about + stats + spaces. */
const SidebarSkeleton = () => (
  <aside className="w-full space-y-4">
    <AboutSkeleton />
    <StatsSkeleton />
    <SpacesSkeleton />
  </aside>
)

/** Post card skeleton for the main column. */
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
      <div
        className="flex-1 min-w-0 p-4 space-y-3"
      >
        <div
          className={cn(
            'flex items-center gap-1.5',
          )}
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

/**
 * Full profile page skeleton matching the
 * loaded layout: header + navbar + grid
 * with sidebar and post list.
 */
export const ProfilePageSkeleton = () => (
  <>
    <div className="relative -mx-4 md:-mx-6">
      <HeaderSkeleton />
      <NavbarSkeleton />
    </div>

    <div className="h-4 lg:h-6" />

    <div
      className={cn(
        'grid grid-cols-1',
        'lg:grid-cols-12 gap-4 lg:gap-6',
      )}
    >
      <main
        className={cn(
          'lg:col-span-9 lg:col-start-4',
        )}
      >
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </main>

      <aside
        className={cn(
          'lg:col-span-3 lg:col-start-1',
          'lg:row-start-1',
        )}
      >
        <SidebarSkeleton />
      </aside>
    </div>
  </>
)
