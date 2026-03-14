import React from 'react'
import { Plus, Check, Settings, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
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
      <div className="flex items-start gap-3 md:gap-4">
        {/* Space icon */}
        <div
          className={cn(
            'shrink-0 size-14 md:size-20 rounded-xl flex items-center justify-center',
            'text-white shadow-lg overflow-hidden',
            space.iconType !== 'image' &&
              `bg-gradient-to-br ${space.colorScheme || 'from-primary to-primary-dark'}`,
          )}
        >
          {space.iconType === 'image' ? (
            <img
              src={iconText}
              className="size-full object-cover rounded-xl"
              alt=""
            />
          ) : (
            <span
              className={cn(
                'font-black text-center leading-none break-all px-1',
                getIconFontSize(iconText),
              )}
            >
              {iconText}
            </span>
          )}
        </div>

        {/* Info + actions */}
        <div className="flex-1 min-w-0">
          {/*
            On mobile: title on top, buttons below (flex-col).
            On md+: title and buttons side by side (flex-row).
          */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4">
            {/* Title */}
            <div className="min-w-0">
              <h1 className="text-xl md:text-3xl font-black dark:text-white truncate">
                {space.displayName}
              </h1>
              <p className="text-gray-500 text-sm">r/{space.name}</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={isJoined ? 'secondary' : 'primary'}
                size="sm"
                leftIcon={
                  isJoined ? (
                    <Check className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )
                }
                onClick={onToggleJoin}
              >
                {isJoined ? 'Joined' : 'Join'}
              </Button>

              {isOwner && (
                <>
                  <Button variant="outline" size="sm" onClick={onEdit}>
                    <Settings className="size-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={onDeleteClick}>
                    <Trash2 className="size-4" />
                  </Button>
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
