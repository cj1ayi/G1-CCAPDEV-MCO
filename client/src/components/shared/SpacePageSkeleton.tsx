import { cn } from '@/lib/utils'
import { Card } from '@/components/ui'
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
} from './Skeleton'

/**
 * Mirrors SpaceHeader:
 * icon + title/subtitle + join button + stats row.
 */
const SpaceHeaderSkeleton = () => (
  <div className="mb-6">
    <div className="flex items-start gap-3 md:gap-4">
      {/* Space icon */}
      <Skeleton
        className={cn(
          'shrink-0 size-14 md:size-20',
          'rounded-xl',
        )}
      />

      <div className="flex-1 min-w-0">
        {/* Title + actions row */}
        <div
          className={cn(
            'flex flex-col md:flex-row',
            'md:items-start',
            'md:justify-between gap-2 md:gap-4',
          )}
        >
          <div className="min-w-0 space-y-1">
            <Skeleton
              className="h-7 md:h-9 w-48"
              variant="text"
            />
            <Skeleton
              className="h-4 w-28"
              variant="text"
            />
          </div>

          {/* Join button */}
          <div className="flex items-center gap-2">
            <Skeleton
              className="h-9 w-20 rounded-lg"
            />
          </div>
        </div>

        {/* Stats: members · posts · category */}
        <div
          className={cn(
            'flex items-center gap-4 mt-2',
          )}
        >
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4" />
            <Skeleton
              className="h-4 w-12"
              variant="text"
            />
            <Skeleton
              className="h-4 w-16"
              variant="text"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4" />
            <Skeleton
              className="h-4 w-8"
              variant="text"
            />
            <Skeleton
              className="h-4 w-10"
              variant="text"
            />
          </div>
          <Skeleton
            className="h-5 w-20 rounded-full"
          />
        </div>
      </div>
    </div>
  </div>
)

/** Mirrors the "Create a post in r/..." button. */
const CreatePostButtonSkeleton = () => (
  <Skeleton
    className={cn(
      'h-10 w-full rounded-lg mb-6',
    )}
  />
)

/** Mirrors SpaceSortBar dropdown + border. */
const SortBarSkeleton = () => (
  <div
    className={cn(
      'pb-4 border-b',
      'border-gray-200 dark:border-gray-800',
    )}
  >
    <Skeleton className="h-9 w-28 rounded-lg" />
  </div>
)

/**
 * Single PostCard skeleton matching the card
 * variant: vote column + metadata + title +
 * body + actions.
 */
const PostCardSkeleton = () => (
  <Card
    padding="none"
    className="overflow-hidden"
  >
    <div className="flex">
      {/* Vote column — card variant */}
      <div
        className={cn(
          'w-12 bg-gray-50 dark:bg-surface-darker',
          'flex flex-col items-center',
          'py-3 gap-1',
          'border-r border-gray-100',
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

      <div className="flex-1 min-w-0 p-4 space-y-3">
        {/* Metadata row */}
        <div
          className={cn(
            'flex items-center flex-wrap',
            'gap-x-1.5 gap-y-0.5',
          )}
        >
          <Skeleton
            className="h-3 w-20"
            variant="text"
          />
          <Skeleton
            className="h-3 w-3"
            variant="circular"
          />
          <Skeleton
            className="h-3 w-24"
            variant="text"
          />
          <Skeleton
            className="h-3 w-3"
            variant="circular"
          />
          <Skeleton
            className="h-3 w-14"
            variant="text"
          />
        </div>

        {/* Title */}
        <Skeleton
          className="h-5 w-3/4"
          variant="text"
        />

        {/* Body preview */}
        <SkeletonText lines={2} />

        {/* Actions */}
        <div className="flex items-center gap-1 pt-1">
          <Skeleton
            className="h-8 w-28"
            variant="text"
          />
          <Skeleton
            className="h-8 w-24"
            variant="text"
          />
        </div>
      </div>
    </div>
  </Card>
)

/** Stat row reused in AboutWidgetSkeleton. */
const StatRowSkeleton = () => (
  <div
    className={cn(
      'flex items-center',
      'justify-between text-sm',
    )}
  >
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-4" />
      <Skeleton
        className="h-4 w-16"
        variant="text"
      />
    </div>
    <Skeleton
      className="h-4 w-12"
      variant="text"
    />
  </div>
)

/** Rule row reused in RulesWidgetSkeleton. */
const RuleRowSkeleton = ({
  isLast = false,
}: {
  isLast?: boolean
}) => (
  <div
    className={cn(
      'pl-2 pb-2',
      !isLast && 'border-b dark:border-gray-800',
    )}
  >
    <Skeleton
      className="h-4 w-3/4"
      variant="text"
    />
    <Skeleton
      className="h-3 w-full ml-4 mt-1"
      variant="text"
    />
  </div>
)

/**
 * Mirrors SpaceAboutWidget:
 * header + description + divider + 3 stats.
 */
const AboutWidgetSkeleton = () => (
  <div
    className={cn(
      'bg-white dark:bg-surface-dark',
      'rounded-xl border',
      'border-gray-200 dark:border-gray-800',
      'overflow-hidden',
    )}
  >
    <div
      className={cn(
        'px-4 py-3 border-b',
        'border-gray-200 dark:border-gray-800',
        'flex items-center gap-2',
      )}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton
        className="h-4 w-24"
        variant="text"
      />
    </div>

    <div className="px-4 pt-3 pb-4">
      <SkeletonText lines={2} />
    </div>

    <div
      className={cn(
        'mx-4 border-t',
        'border-gray-100 dark:border-gray-800',
        'mb-4',
      )}
    />

    <div className="px-4 pb-4 space-y-3">
      <StatRowSkeleton />
      <StatRowSkeleton />
      <StatRowSkeleton />
    </div>
  </div>
)

/** Mirrors RulesWidget: header + 3 rules. */
const RulesWidgetSkeleton = () => (
  <Card padding="none" className="overflow-hidden">
    <div
      className={cn(
        'px-4 py-3 border-b',
        'dark:border-gray-800',
        'bg-gray-50 dark:bg-gray-800/50',
        'flex items-center gap-2',
      )}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton
        className="h-4 w-32"
        variant="text"
      />
    </div>

    <div className="p-4 space-y-3">
      <RuleRowSkeleton />
      <RuleRowSkeleton />
      <RuleRowSkeleton isLast />
    </div>
  </Card>
)

/**
 * Right sidebar skeleton for the Space page.
 * Matches SpaceAboutWidget + RulesWidget.
 */
export const SpaceRightSkeleton = () => (
  <div className="flex flex-col gap-4">
    <AboutWidgetSkeleton />
    <RulesWidgetSkeleton />
  </div>
)

interface SpacePageSkeletonProps {
  postCount?: number
}

/**
 * Full Space page content skeleton.
 * Matches: SpaceHeader + Create button +
 * SortBar + post list.
 */
export const SpacePageSkeleton = ({
  postCount = 4,
}: SpacePageSkeletonProps) => (
  <>
    <SpaceHeaderSkeleton />
    <CreatePostButtonSkeleton />
    <SortBarSkeleton />

    <div className="space-y-4 mt-6">
      {Array.from({ length: postCount }).map(
        (_, i) => (
          <PostCardSkeleton key={i} />
        ),
      )}
    </div>
  </>
)
