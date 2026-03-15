import { Info, Calendar, Users, FileText } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { Space } from '../services'

interface SpaceAboutWidgetProps {
  space: Space
  postCount: number
}

export const SpaceAboutWidget = ({ space, postCount }: SpaceAboutWidgetProps) => (
  <div className={cn(
    'bg-white dark:bg-surface-dark rounded-xl border',
    'border-gray-200 dark:border-gray-800 overflow-hidden'
  )}>
    {/* Header */}
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
      <Info className="size-4 text-gray-400" />
      <h3 className="text-sm font-bold uppercase tracking-wide dark:text-white">
        About Space
      </h3>
    </div>

    {/* Description */}
    <div className="px-4 pt-3 pb-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {space.description}
      </p>
    </div>

    {/* Divider */}
    <div className="mx-4 border-t border-gray-100 dark:border-gray-800 mb-4" />

    {/* Stats */}
    <div className="px-4 pb-4 space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Calendar className="size-4" />
          Created
        </span>
        <span className="font-semibold dark:text-white">{space.createdDate}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Users className="size-4" />
          Members
        </span>
        <span className="font-semibold dark:text-white">{formatNumber(Number(space.memberCount))}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <FileText className="size-4" />
          Posts
        </span>
        <span className="font-semibold dark:text-white">{postCount}</span>
      </div>
    </div>
  </div>
)
