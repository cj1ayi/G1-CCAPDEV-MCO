import React from 'react'
import { Plus, Check, Users, MessageSquare, Settings, Trash2 } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import { SpaceHeaderProps } from '../types'
import { getCurrentUser } from '@/features/auth/services/authService'
import { spaceService } from '../services/spaceService'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const SpaceHeader = ({
  space,
  isJoined,
  onToggleJoin,
  postCount,
}: SpaceHeaderProps) => {
  const [isOwner, setIsOwner] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getCurrentUser().then(user => {
      const ownerId = typeof space.owner === 'object' 
        ? (space.owner as any).id 
        : space.owner
      setIsOwner(!!user && user.id === ownerId)
    })
  }, [space.owner])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await spaceService.deleteSpace(space.id)
      navigate('/spaces')
    } catch (error) {
      console.error('Failed to delete space:', error)
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <div className="mb-6">
      {/* Banner */}
      {space.bannerUrl && (
        <div className={cn("relative h-32 md:h-48 rounded-lg", "overflow-hidden mb-4")}>
          <img src={space.bannerUrl} alt="" className="w-full h-full object-cover" />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t", 
            "from-black/60 to-transparent"
          )} />
        </div>
      )}

      {/* Info Row */}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "size-16 md:size-20 rounded-xl flex",
            "items-center justify-center text-white shadow-lg",
            space.iconType === "text" && `bg-gradient-to-br ${space.colorScheme}`,
          )}
        >
          {space.iconType === "image" ? (
            <img src={space.icon} className="size-full object-cover rounded-xl" alt="" />
          ) : (
            <span className="font-black text-3xl md:text-4xl">{space.icon}</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className={cn("text-2xl md:text-3xl font-black mb-1", "dark:text-white")}>
                {space.displayName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">r/{space.name}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={isJoined ? "secondary" : "primary"}
                leftIcon={isJoined ? <Check className="size-4" /> : <Plus className="size-4" />}
                onClick={onToggleJoin}
              >
                {isJoined ? "Joined" : "Join"}
              </Button>

              {isOwner && (
                <>
                  <Button
                    variant="outline"
                    leftIcon={<Settings className="size-4" />}
                    onClick={() => navigate(`/spaces/${space.name}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    leftIcon={<Trash2 className="size-4" />}
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className={cn("flex items-center gap-6 mt-3", "text-gray-600 dark:text-gray-400")}>
            <StatItem icon={<Users className="size-4" />} label={`${space.memberCount} members`} />
            <StatItem icon={<MessageSquare className="size-4" />} label={`${postCount} posts`} />
            <Badge variant="secondary" size="sm">{space.category}</Badge>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={cn(
            "bg-white dark:bg-surface-dark rounded-xl shadow-xl",
            "p-6 max-w-md w-full mx-4"
          )}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Space
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete <span className="font-semibold">r/{space.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete Space
              </Button>
            </div>
          </div>
        </div>
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
