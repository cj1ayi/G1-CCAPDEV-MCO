import { Dropdown, DropdownItem } from '@/components/ui'
import {
  Flame,
  Clock,
  TrendingUp,
  ChevronDown,
} from 'lucide-react'
import { SortOption } from '../services/spaceService'

interface SpaceSortBarProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

const SORT_OPTIONS: Array<{
  value: SortOption
  label: string
  icon: typeof Flame
}> = [
  { value: 'hot', label: 'Hot', icon: Flame },
  { value: 'new', label: 'New', icon: Clock },
  { value: 'week', label: 'This Week', icon: TrendingUp },
  { value: 'month', label: 'This Month', icon: TrendingUp },
  { value: 'year', label: 'This Year', icon: TrendingUp },
]

export const SpaceSortBar = ({
  currentSort,
  onSortChange,
}: SpaceSortBarProps) => {
  const currentOption = SORT_OPTIONS.find(
    (opt) => opt.value === currentSort
  )
  const CurrentIcon = currentOption?.icon || Flame

  return (
    <div className="pb-4 border-b border-gray-200
      dark:border-gray-800">
      <Dropdown
        align="left"
        trigger={
          <button className="flex items-center gap-1 sm:gap-2 px-3
            sm:px-4 py-2 rounded-lg bg-surface-light
            dark:bg-surface-dark border border-gray-200
            dark:border-gray-700 hover:border-primary
            dark:hover:border-primary text-xs sm:text-sm font-medium
            transition-colors w-full sm:w-auto">
            <CurrentIcon className="size-3 sm:size-4 flex-shrink-0" />
            <span className="truncate">
              {currentOption?.label || 'Sort'}
            </span>
            <ChevronDown className="size-3 sm:size-4 flex-shrink-0
              ml-auto" />
          </button>
        }
      >
        {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
          <DropdownItem
            key={value}
            icon={<Icon className="size-4" />}
            onClick={() => onSortChange(value)}
            className={
              currentSort === value
                ? 'bg-gray-100 dark:bg-gray-800'
                : ''
            }
          >
            {label}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  )
}
