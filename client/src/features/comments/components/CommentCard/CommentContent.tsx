import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { CommentContentProps } from './types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useRef, useState } from 'react'
import { MarkdownToolbar } from '@/components/ui/MarkdownToolbar'

export const CommentContent = ({
  content,
  isDeleted = false,
  isEditing,
  editContent,
  isSaving,
  onEditContentChange,
  onSaveEdit,
  onCancelEdit,
}: CommentContentProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isPreview, setIsPreview] = useState(false)

  if (isEditing) {
    return (
      <div className="space-y-2 mb-2">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <MarkdownToolbar 
            textareaRef={textareaRef} 
            value={editContent} 
            onChange={onEditContentChange}
            isPreview={isPreview}
            onTogglePreview={setIsPreview}
          />
          {isPreview ? (
            <div className="w-full p-4 min-h-[100px] bg-white dark:bg-gray-900 prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{editContent}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => onEditContentChange(e.target.value)}
              className="w-full min-h-[100px] text-sm p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none resize-y"
              autoFocus
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onSaveEdit}
            disabled={isSaving || !editContent.trim()}
            leftIcon={<Check className="h-4 w-4" />}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsPreview(false)
              onCancelEdit()
            }}
            disabled={isSaving}
            leftIcon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'text-sm leading-relaxed mb-2 break-words',
      isDeleted
        ? 'text-gray-400 dark:text-gray-500 italic'
        : 'text-gray-900 dark:text-gray-100 prose prose-sm dark:prose-invert max-w-none'
    )}>
      {isDeleted ? '[deleted]' : <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>}
    </div>
  )
}
