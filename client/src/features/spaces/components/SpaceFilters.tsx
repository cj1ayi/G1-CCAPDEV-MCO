import { Button, Dropdown, DropdownItem } from '@/components/ui'
import { ChevronDown, SortAsc, SortDesc, Users } from 'lucide-react'

const FILTERS = [
  'All Spaces',
  'Trending',
  'Academic',
  'Lifestyle',
  'Interest',
  'Batch'
]

interface SpaceFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  currentSort: string
  onSortChange: (sort: string) => void
}

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
      {FILTERS.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? 'primary' : 'secondary'}
          size="sm"
          className="rounded-full whitespace-nowrap"
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </Button>
      ))}
    </div>

    <Dropdown
      trigger={
        <button
          className="flex items-center gap-1 text-sm font-bold 
            hover:text-primary transition-colors"
        >
          {currentSort} <ChevronDown className="size-4" />
        </button>
      }
      align="right"
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
