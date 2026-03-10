import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface SpaceEmptyStateProps {
  spaceName: string
  onCreatePost: () => void
}

export const SpaceEmptyState = ({ spaceName, onCreatePost }: SpaceEmptyStateProps) => (
  <div
    className={cn(
      'text-center py-16 bg-gray-50 dark:bg-surface-darker',
      'rounded-lg border-2 border-dashed border-gray-200',
      'dark:border-gray-800'
    )}
  >
    <MessageSquare className="size-12 mx-auto mb-4 text-gray-400" />
    <h3 className="text-lg font-bold mb-2 dark:text-white">No posts yet</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      Be the first to post in r/{spaceName}!
    </p>
    <Button variant="primary" onClick={onCreatePost}>
      Create First Post
    </Button>
  </div>
)
