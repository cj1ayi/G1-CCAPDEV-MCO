import { cn } from '@/lib/utils'
import { Card } from '@/components/ui'
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
} from './Skeleton'

/**
 * Breadcrumbs: Explore > SpaceName > Title.
 */
const BreadcrumbsSkeleton = () => (
  <div className="flex items-center gap-2 mb-1">
    <Skeleton className="h-4 w-14" variant="text" />
    <Skeleton className="h-3 w-3" variant="text" />
    <Skeleton className="h-4 w-24" variant="text" />
    <Skeleton
      className="h-3 w-3 hidden sm:block"
      variant="text"
    />
    <Skeleton
      className="h-4 w-40 hidden sm:block"
      variant="text"
    />
  </div>
)

/**
 * Detail VoteButtons variant:
 * hidden mobile, vertical column on sm+.
 */
const VoteColumnSkeleton = () => (
  <div
    className={cn(
      'hidden sm:flex flex-col items-center',
      'bg-gray-50 dark:bg-surface-darker',
      'rounded-l-xl px-3 py-6 gap-2',
      'border-r border-gray-100',
      'dark:border-gray-800',
    )}
  >
    <Skeleton className="h-6 w-6" />
    <Skeleton className="h-5 w-8" variant="text" />
    <Skeleton className="h-6 w-6" />
  </div>
)

/** Space icon + name + flair badge. */
const SpaceRowSkeleton = () => (
  <div className="flex items-center gap-3 mb-4">
    <Skeleton
      className="h-6 w-6"
      variant="circular"
    />
    <Skeleton
      className="h-4 w-28"
      variant="text"
    />
    <Skeleton
      className="h-5 w-16 rounded-full"
      variant="text"
    />
  </div>
)

/** Author avatar + username + timestamp. */
const AuthorRowSkeleton = () => (
  <div className="flex items-center gap-3 mb-4">
    <SkeletonAvatar size="md" />
    <div className="space-y-1">
      <Skeleton
        className="h-4 w-28"
        variant="text"
      />
      <Skeleton
        className="h-3 w-20"
        variant="text"
      />
    </div>
  </div>
)

/** Mobile vote row + desktop actions bar. */
const ActionsSkeleton = () => (
  <>
    <div
      className={cn(
        'flex sm:hidden items-center',
        'gap-4 mt-6 pt-4',
        'border-t border-gray-100',
        'dark:border-gray-800',
      )}
    >
      <Skeleton className="h-8 w-28 rounded-lg" />
    </div>

    <div
      className={cn(
        'hidden sm:flex items-center gap-1',
        'mt-6 pt-4',
        'border-t border-gray-100',
        'dark:border-gray-800',
      )}
    >
      <Skeleton
        className="h-8 w-32"
        variant="text"
      />
      <Skeleton
        className="h-8 w-28"
        variant="text"
      />
    </div>
  </>
)

/** Matches CommentInput card. */
const CommentInputSkeleton = () => (
  <div
    className={cn(
      'bg-surface-light dark:bg-surface-dark',
      'rounded-xl shadow-soft',
      'border border-gray-100',
      'dark:border-gray-800 p-4 sm:p-6',
    )}
  >
    <Skeleton
      className="h-[120px] w-full rounded-lg"
    />
    <div
      className="flex items-center justify-end mt-3"
    >
      <Skeleton className="h-9 w-32 rounded-lg" />
    </div>
  </div>
)

/** Single stat row for AboutWidgetSkeleton. */
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

/** Single rule row for RulesWidgetSkeleton. */
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
 * header + description + divider + 3 stat rows.
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

/**
 * Mirrors RulesWidget:
 * header bar + 3 rule rows.
 */
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
 * Right sidebar skeleton matching the loaded
 * SpaceAboutWidget + RulesWidget combo.
 */
export const PostDetailRightSkeleton = () => (
  <div className="flex flex-col gap-4">
    <AboutWidgetSkeleton />
    <RulesWidgetSkeleton />
  </div>
)

/**
 * Main content skeleton for post detail page.
 * Matches PostDetailHeader + PostDetailContent
 * + CommentInput layout.
 */
export const PostDetailSkeleton = () => (
  <div className="flex flex-col gap-4">
    <BreadcrumbsSkeleton />

    <article
      className={cn(
        'bg-surface-light dark:bg-surface-dark',
        'rounded-xl shadow-soft',
        'border border-gray-100',
        'dark:border-gray-800',
        'overflow-hidden',
      )}
    >
      <div className="flex">
        <VoteColumnSkeleton />

        <div className="flex-1 p-6 sm:p-8">
          <SpaceRowSkeleton />
          <AuthorRowSkeleton />

          <Skeleton
            className="h-8 w-3/4 mb-4"
            variant="text"
          />

          <SkeletonText lines={4} />

          <div className="flex gap-2 mt-6">
            <Skeleton
              className="h-6 w-16 rounded-full"
            />
            <Skeleton
              className="h-6 w-20 rounded-full"
            />
          </div>

          <ActionsSkeleton />
        </div>
      </div>
    </article>

    <div className="mt-4">
      <CommentInputSkeleton />
    </div>
  </div>
)
