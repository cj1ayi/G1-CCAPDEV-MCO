import { cn } from '@/lib/utils'

export const SpaceAboutWidget = ({ 
  space, postCount }: { space: any, postCount: number }) => (
  <div className={cn(
    "bg-white dark:bg-surface-dark rounded-lg border",
    "border-gray-200 dark:border-gray-800 p-4"
    )}
  >
    <h3 className={cn(
      "text-sm font-bold uppercase mb-3",
      "flex items-center gap-2 dark:text-white"
      )}
    >
      <span className="material-symbols-outlined text-[16px] text-gray-400">
        info
      </span>
      About Space
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {space.description}
    </p>
    <div className="space-y-2 text-sm">
      {[
        { label: 'Created', value: space.createdDate },
        { label: 'Members', value: space.memberCount },
        { label: 'Posts', value: postCount },
      ].map(stat => (
        <div key={stat.label} className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">
            {stat.label}
          </span>
          <span className="font-semibold dark:text-white">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  </div>
)
