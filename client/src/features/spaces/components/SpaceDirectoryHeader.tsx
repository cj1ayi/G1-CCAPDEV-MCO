import { Button } from '@/components/ui'
import { Plus } from 'lucide-react'

interface SpaceDirectoryHeaderProps {
  onCreateSpace: () => void
}

export const SpaceDirectoryHeader = ({ onCreateSpace }: SpaceDirectoryHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
        Explore Spaces
      </h1>
      <p className="text-gray-500 text-sm sm:text-base lg:text-lg max-w-2xl">
        Discover and join communities within DLSU. From academic support to specialized interest groups.
      </p>
    </div>
    <Button
      variant="primary"
      leftIcon={<Plus className="size-4 sm:size-5" />}
      onClick={onCreateSpace}
      className="whitespace-nowrap w-full sm:w-auto"
      size="sm"
    >
      <span className="sm:hidden">Create</span>
      <span className="hidden sm:inline">Create Space</span>
    </Button>
  </div>
)
