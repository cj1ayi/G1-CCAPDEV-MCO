import { Dropdown, DropdownItem } from '@/components/ui'
import { ChevronDown, SortAsc, SortDesc, Users, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpaceFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  currentSort: string
  onSortChange: (sort: string) => void
}

const FILTERS = ['All Spaces', 'Academic', 'Lifestyle', 'Interest']

export const SpaceFilters = ({
  activeFilter,
  onFilterChange,
  currentSort,
  onSortChange,
}: SpaceFiltersProps) => (
  <div
    className={cn(
      "sticky top-16 z-30 py-4 bg-background-light/95 dark:bg-background-dark/95",
      "backdrop-blur-sm flex items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-4",
      "border-b dark:border-gray-800")}
  >
    <Dropdown
      align="left"
      trigger={
        <button
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg",
            "bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700",
            "hover:border-primary dark:hover:border-primary text-xs sm:text-sm font-medium",
            "transition-colors min-w-0 flex-1 sm:flex-initial",
         )}>
          <Filter className="size-3 sm:size-4 flex-shrink-0" />
          <span className="truncate">{activeFilter}</span>
          <ChevronDown className="size-3 sm:size-4 flex-shrink-0" />
        </button>
      }
    >
      {FILTERS.map((filter) => (
        <DropdownItem
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={activeFilter === filter ? 'bg-gray-100 dark:bg-gray-800' : ''}
        >
          {filter}
        </DropdownItem>
      ))}
    </Dropdown>

    <Dropdown
      align="left"
      trigger={
        <button
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg",
            "bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700",
            "hover:border-primary dark:hover:border-primary text-xs sm:text-sm font-medium",
            "transition-colors min-w-0 flex-1 sm:flex-initial"
            )}
        >
          <span className="truncate">
            <span className="hidden sm:inline">Sort: </span>
            {currentSort}
          </span>
          <ChevronDown className="size-3 sm:size-4 flex-shrink-0" />
        </button>
      }
    >
      <DropdownItem icon={<SortAsc className="size-4" />} onClick={() => onSortChange('A-Z')}>
        Alphabetical (A-Z)
      </DropdownItem>
      <DropdownItem icon={<SortDesc className="size-4" />} onClick={() => onSortChange('Z-A')}>
        Alphabetical (Z-A)
      </DropdownItem>
      <DropdownItem icon={<Users className="size-4" />} onClick={() => onSortChange('Members')}>
        Most Members
      </DropdownItem>
    </Dropdown>
  </div>
)
