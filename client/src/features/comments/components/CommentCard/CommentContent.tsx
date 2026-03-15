import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { CommentContentProps } from './types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { RichTextEditor } from '@/components/ui/RichTextEditor'

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
  if (isEditing) {
    return (
      <div className="space-y-2 mb-2">
        <RichTextEditor
          value={editContent}
          onChange={onEditContentChange}
          minHeight="min-h-[100px]"
        />
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
            onClick={onCancelEdit}
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
      {isDeleted ? (
        '[deleted]'
      ) : (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ node, ...props }) => (
              <a 
                {...props} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
                onClick={(e) => e.stopPropagation()} 
              />
            )
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  )
}
