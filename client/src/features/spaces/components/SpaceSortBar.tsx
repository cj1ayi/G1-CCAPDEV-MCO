import { Button } from '@/components/ui'
import { Flame, Clock, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SortOption } from '../services/spaceService'

interface SpaceSortBarProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

const SORT_OPTIONS: Array<{ 
  value: SortOption; 
  label: string; 
  icon: typeof Flame }> = [
  { value: 'hot', label: 'Hot', icon: Flame },
  { value: 'new', label: 'New', icon: Clock },
  { value: 'week', label: 'This Week', icon: TrendingUp },
  { value: 'month', label: 'This Month', icon: TrendingUp },
  { value: 'year', label: 'This Year', icon: TrendingUp },
]

export const SpaceSortBar = (
  { currentSort, onSortChange }: SpaceSortBarProps) => {
  return (
    <div className={cn(
      "flex items-center gap-2 pb-4 border-b border-gray-200",
      "dark:border-gray-800 overflow-x-auto",
      )}
    >
      {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={currentSort === value ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onSortChange(value)}
          leftIcon={<Icon className="h-4 w-4" />}
          className={cn(
            'whitespace-nowrap',
            currentSort === value && 'font-bold'
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
