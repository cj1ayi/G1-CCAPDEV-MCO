import { 
  Card, 
  CardHeader, 
  CardTitle,  
  CardContent, 
} from '@/components/ui/Card'

import { ArrowUp, MessageCircle, Users } from "lucide-react"

interface StatsWidgetProps {
  postCount: number
  commentCount: number
  spacesCount: number
}

export const StatsWidget = ({ postCount, commentCount, spacesCount }: StatsWidgetProps) => {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Community Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <ArrowUp className="w-4 h-4" />
            <span>{postCount} Posts</span>
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <MessageCircle className="w-4 h-4" />
            <span>{commentCount} Comments</span>
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4" />
            <span>{spacesCount} Spaces Joined</span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
