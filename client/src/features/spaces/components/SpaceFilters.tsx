import { Button } from '@/components/ui'
import { ChevronDown } from 'lucide-react'

const FILTERS = [
  'All Spaces',
  'Trending',
  'Newest',
  'Academic',
  'Interest Clubs'
]

export const SpaceFilters = () => (
  <div
    className="sticky top-16 z-30 py-4 bg-background-light/95 
      dark:bg-background-dark/95 backdrop-blur-sm flex items-center 
      justify-between border-b dark:border-gray-800"
  >
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {FILTERS.map((filter, i) => (
        <Button
          key={filter}
          variant={i === 0 ? 'primary' : 'secondary'}
          size="sm"
          className="rounded-full whitespace-nowrap"
        >
          {filter}
        </Button>
      ))}
    </div>
    <button className="hidden sm:flex items-center gap-1 text-sm font-bold">
      Alphabetical <ChevronDown className="size-4" />
    </button>
  </div>
)
