import { Space } from '../services'
import { Card, Button, Badge } from '@/components/ui'
import { Users, MessageSquare, Check } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'

interface SpaceCardProps {
  space: Space
  onToggleJoin: (id: string) => void
  onClick: (name: string) => void
}

export const SpaceCard = ({ space, onToggleJoin, onClick }: SpaceCardProps) => {
  const isMaterialIcon = ['menu_book', 'sports_basketball', 'terminal'].includes(
    space.icon
  )

  const getIconFontSize = (text: string) => {
    if (text.length <= 2) return 'text-2xl'
    if (text.length <= 4) return 'text-lg'
    if (text.length <= 6) return 'text-sm'
    return 'text-[10px]'
  }

  return (
    <Card
      className="group flex flex-col justify-between hover:border-primary/20 
        transition-all duration-300 h-full cursor-pointer"
      onClick={() => onClick(space.name)}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="relative">
            <div
              className={cn(
                'size-14 rounded-xl flex items-center justify-center',
                'text-white shadow-inner overflow-hidden px-1',
                space.iconType === 'text' &&
                  `bg-gradient-to-br ${space.colorScheme}`
              )}
            >
              {space.iconType === 'image' ? (
                <img
                  src={space.icon}
                  className="size-full object-cover"
                  alt=""
                />
              ) : (
                <span
                  className={cn(
                    'font-black text-center leading-none break-all',
                    isMaterialIcon ? 'material-symbols-outlined text-3xl' : 
                    getIconFontSize(space.icon)
                  )}
                >
                  {space.icon}
                </span>
              )}
            </div>
            {space.isActive && (
              <div
                className={cn(
                  'absolute -bottom-1 -right-1 bg-green-500 size-4 border-2',
                  'border-white dark:border-surface-dark rounded-full'
                )}
              />
            )}
          </div>
          <Button
            variant={space.isJoined ? 'secondary' : 'outline'}
            size="sm"
            className="font-bold"
            leftIcon={space.isJoined ? <Check className="size-4" /> : undefined}
            onClick={(e) => {
              e.stopPropagation()
              onToggleJoin(space.id)
            }}
          >
            {space.isJoined ? 'Joined' : 'Join'}
          </Button>
        </div>
        <div>
          <h3
            className="text-lg font-bold group-hover:text-primary 
              transition-colors"
          >
            {space.displayName}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {space.description}
          </p>
        </div>
      </div>
      <div
        className="flex items-center gap-4 pt-4 mt-6 border-t 
          dark:border-gray-800"
      >
        <div
          className="flex items-center gap-1.5 text-gray-500 text-xs 
            font-semibold"
        >
          <Users className="size-4" /> {formatNumber(space.memberCount)}
        </div>
        <div
          className="flex items-center gap-1.5 text-gray-500 text-xs 
            font-semibold"
        >
          <MessageSquare className="size-4" /> {space.postCount}
        </div>
        <div className="ml-auto">
          <Badge
            variant="secondary"
            size="sm"
            className="text-[10px] uppercase tracking-wide"
          >
            {space.category}
          </Badge>
        </div>
      </div>
    </Card>
  )
}
