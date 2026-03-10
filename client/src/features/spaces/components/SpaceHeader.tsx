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
  const iconText = space?.icon || ''

  const getIconFontSize = (text: string) => {
    if (text.length <= 2) return 'text-3xl md:text-4xl'
    if (text.length <= 4) return 'text-xl md:text-2xl'
    if (text.length <= 6) return 'text-lg md:text-xl'
    return 'text-sm md:text-base'
  }

  return (
    <div className="mb-6">
      <div className="flex items-start gap-4">
        <div className={cn(
          'size-16 md:size-20 rounded-xl flex px-1 items-center justify-center text-white shadow-lg overflow-hidden',
          space.iconType === 'text' && `bg-gradient-to-br ${space.colorScheme || 'from-primary to-primary-dark'}`
        )}>
          {space.iconType === 'image' ? (
            <img src={iconText} className="size-full object-cover rounded-xl" alt="" />
          ) : (
            <span className={cn('font-black text-center leading-none break-all', getIconFontSize(iconText))}>
              {iconText}
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black dark:text-white">{space.displayName}</h1>
              <p className="text-gray-500 text-sm">r/{space.name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant={isJoined ? 'secondary' : 'primary'} onClick={onToggleJoin}>
                {isJoined ? 'Joined' : 'Join'}
              </Button>
              {isOwner && (
                <>
                  <Button variant="outline" onClick={onEdit}><Settings className="size-4" /></Button>
                  <Button variant="danger" onClick={onDeleteClick}><Trash2 className="size-4" /></Button>
                </>
              )}
            </div>
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
