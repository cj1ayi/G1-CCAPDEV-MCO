import React from 'react'
import { Plus, Check, Users, MessageSquare, Settings, Trash2 } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { cn, formatNumber } from '@/lib/utils'
import { Space } from '../services'
import { SpaceDeleteModal } from './SpaceDeleteModal'

interface SpaceHeaderProps {
  space: Space
  isJoined: boolean
  isOwner?: boolean
  postCount: number
  onToggleJoin: () => void
  onEdit?: () => void
  onDeleteClick?: () => void
  deleteModal?: {
    isOpen: boolean
    isDeleting: boolean
    onConfirm: () => void
    onCancel: () => void
  }
}

export const SpaceHeader = ({
  space,
  isJoined,
  isOwner = false,
  postCount,
  onToggleJoin,
  onEdit,
  onDeleteClick,
  deleteModal,
}: SpaceHeaderProps) => {
  const getIconFontSize = (text: string) => {
    if (text.length <= 2) return 'text-3xl md:text-4xl'
    if (text.length <= 4) return 'text-xl md:text-2xl'
    if (text.length <= 6) return 'text-lg md:text-xl'
    return 'text-sm md:text-base'
  }

  return (
    <div className="mb-6">
      {/* Banner */}
      {space.bannerUrl && (
        <div
          className={cn('relative h-32 md:h-48 rounded-lg', 'overflow-hidden mb-4')}
        >
          <img
            src={space.bannerUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t',
              'from-black/60 to-transparent'
            )}
          />
        </div>
      )}

      {/* Info Row */}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'size-16 md:size-20 rounded-xl flex px-1',
            'items-center justify-center text-white shadow-lg overflow-hidden',
            space.iconType === 'text' && `bg-gradient-to-br ${space.colorScheme}`
          )}
        >
          {space.iconType === 'image' ? (
            <img
              src={space.icon}
              className="size-full object-cover rounded-xl"
              alt=""
            />
          ) : (
            <span
              className={cn(
                'font-black text-center leading-none break-all',
                getIconFontSize(space.icon)
              )}
            >
              {space.icon}
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className={cn('text-2xl md:text-3xl font-black mb-1', 'dark:text-white')}
              >
                {space.displayName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                r/{space.name}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={isJoined ? 'secondary' : 'primary'}
                leftIcon={
                  isJoined ? <Check className="size-4" /> : <Plus className="size-4" />
                }
                onClick={onToggleJoin}
              >
                {isJoined ? 'Joined' : 'Join'}
              </Button>

              {isOwner && (
                <>
                  <Button
                    variant="outline"
                    leftIcon={<Settings className="size-4" />}
                    onClick={onEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    leftIcon={<Trash2 className="size-4" />}
                    onClick={onDeleteClick}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          <div
            className={cn(
              'flex items-center gap-6 mt-3',
              'text-gray-600 dark:text-gray-400'
            )}
          >
            <StatItem
              icon={<Users className="size-4" />}
              label={`${formatNumber(space.memberCount)} members`}
            />
            <StatItem
              icon={<MessageSquare className="size-4" />}
              label={`${postCount} posts`}
            />
            <Badge variant="secondary" size="sm">
              {space.category}
            </Badge>
          </div>
        </div>
      </div>

      {deleteModal?.isOpen && (
        <SpaceDeleteModal
          spaceName={space.name}
          isDeleting={deleteModal.isDeleting}
          onConfirm={deleteModal.onConfirm}
          onCancel={deleteModal.onCancel}
        />
      )}
    </div>
  )
}

const StatItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className="text-sm font-semibold">{label}</span>
  </div>
)
