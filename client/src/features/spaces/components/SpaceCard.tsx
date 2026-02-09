import { Space } from '../types'
import { Card, Button, Badge } from '@/components/ui'
import { Users, MessageSquare, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const SpaceCard = ({ space }: { space: Space }) => {
  return (
    <Card className="group flex flex-col justify-between hover:border-primary/20 transition-all duration-300 h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="relative">
            <div className={cn(
              "size-14 rounded-xl flex items-center justify-center text-white shadow-inner",
              space.iconType === 'text' ? `bg-gradient-to-br ${space.colorScheme}` : ""
            )}>
              {space.iconType === 'image' ? (
                <img src={space.icon} className="size-full rounded-xl object-cover" alt="" />
              ) : (
                <span className={cn(
                  "font-black",
                  space.icon.length > 2 ? "text-lg" : "text-2xl",
                  // Handle Material Icons
                  (space.icon === 'menu_book' || space.icon === 'sports_basketball' || space.icon === 'terminal') && "material-symbols-outlined text-3xl"
                )}>
                  {space.icon}
                </span>
              )}
            </div>
            {space.isActive && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 size-4 border-2 border-white dark:border-surface-dark rounded-full" />
            )}
          </div>
          <Button variant={space.isJoined ? "secondary" : "outline"} size="sm" className="font-bold">
            {space.isJoined ? <><Check className="size-3 mr-1" /> Joined</> : 'Join'}
          </Button>
        </div>
        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
          {space.displayName}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
          {space.description}
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t dark:border-gray-800">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
          <Users className="size-4" /> {space.memberCount}
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
          <MessageSquare className="size-4" /> {space.postCount}
        </div>
        <div className="ml-auto">
           <Badge variant="warning" size="sm" className="text-[10px] uppercase tracking-wide">
            {space.category}
           </Badge>
        </div>
      </div>
    </Card>
  )
}
