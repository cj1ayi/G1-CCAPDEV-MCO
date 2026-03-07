import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  CardHeader,
  CardTitle, 
  CardContent,
} from '@/components/ui'
import { cn } from '@/lib/utils'

interface SpacesWidgetProps {
  spaces: any[]
}

export const SpacesWidget = ({ spaces }: SpacesWidgetProps) => {
  const navigate = useNavigate()

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Spaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-px w-full bg-gray-200 dark:bg-gray-700 mb-3" />

          {spaces.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Not a member of any spaces yet.
            </p>
          ) : (
            <div className="space-y-2">
              {spaces.slice(0, 5).map((space: any) => (
                <button
                  key={space._id || space.id || space.name}
                  onClick={() => navigate(`/spaces/${space.name}`)}
                  className={cn(
                    'w-full text-left flex items-center gap-2',
                    'text-sm text-gray-700 dark:text-gray-300',
                    'hover:text-primary transition-colors'
                  )}
                >
                  <span className="font-medium">r/{space.name}</span>
                  {space.displayName && (
                    <span className="text-gray-400 text-xs truncate">
                      {space.displayName}
                    </span>
                  )}
                </button>
              ))}
              {spaces.length > 5 && (
                <p className="text-xs text-gray-400 mt-1">
                  +{spaces.length - 5} more
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
