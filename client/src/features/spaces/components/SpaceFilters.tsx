import { Button, Dropdown, DropdownItem } from '@/components/ui'
import { ChevronDown, SortAsc, SortDesc, Users } from 'lucide-react'
import { SpaceFiltersProps } from '../types'

const FILTERS = [
  'All Spaces',
  'Trending',
  'Academic',
  'Lifestyle',
  'Interest',
  'Batch'
]

export const SpaceFilters = ({
  activeFilter,
  onFilterChange,
  currentSort,
  onSortChange
}: SpaceFiltersProps) => (
  <div
    className="sticky top-16 z-30 py-4 bg-background-light/95 
      dark:bg-background-dark/95 backdrop-blur-sm flex items-center 
      justify-between border-b dark:border-gray-800"
  >
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {FILTERS.map((f) => (
        <Button
          key={f}
          variant={activeFilter === f ? 'primary' : 'secondary'}
          size="sm"
          className="rounded-full whitespace-nowrap"
          onClick={() => onFilterChange(f)}
        >
          {f}
        </Button>
      ))}
    </div>
    <Dropdown
      align="right"
      trigger={
        <button
          className="flex items-center gap-1 text-sm font-bold 
            hover:text-primary transition-colors"
        >
          {currentSort} <ChevronDown className="size-4" />
        </button>
      }
    >
      <DropdownItem
        icon={<SortAsc className="size-4" />}
        onClick={() => onSortChange('A-Z')}
      >
        Alphabetical (A-Z)
      </DropdownItem>
      <DropdownItem
        icon={<SortDesc className="size-4" />}
        onClick={() => onSortChange('Z-A')}
      >
        Alphabetical (Z-A)
      </DropdownItem>
      <DropdownItem
        icon={<Users className="size-4" />}
        onClick={() => onSortChange('Members')}
      >
        Most Members
      </DropdownItem>
    </Dropdown>
  </div>
)
