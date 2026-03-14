import { useState } from 'react'
import { MessageSquare, Copy, CopyCheck, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/ToastContext'

export interface PostActionsProps {
  commentCount: number
  postId: string
  onClick?: () => void
}

export const PostActions = ({ commentCount, postId, onClick }: PostActionsProps) => {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
    showToast('Link copied to clipboard', 'success')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("flex items-center gap-1", "text-gray-500 dark:text-gray-400", "text-xs font-medium")}>
      <button
        className={cn("flex items-center gap-2 px-2 py-2 rounded", "hover:bg-gray-100 dark:hover:bg-gray-800", "transition-colors")}
        onClick={(e) => { e.stopPropagation(); onClick?.() }}
        aria-label={`${commentCount} comments`}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </button>

      <button
        className={cn("flex items-center gap-2 px-2 py-2 rounded", "hover:bg-gray-100 dark:hover:bg-gray-800", "transition-colors")}
        onClick={handleCopyLink}
        aria-label="Copy link"
      >
        {copied ? <CopyCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  )
}
