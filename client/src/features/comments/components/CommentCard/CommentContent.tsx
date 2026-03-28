import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { CommentContentProps } from './types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import {
  RichTextEditor,
} from '@/components/ui/RichTextEditor'

const IMAGE_EXTENSIONS =
  /(\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$)|(image2url\.com)/i

/**
 * Wraps bare image/gif URLs in markdown image syntax
 * so ReactMarkdown renders them as <img> tags.
 */
function preprocessContent(raw: string): string {

  return raw
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()


      // Already markdown image syntax
      if (trimmed.startsWith('![')) {
        return line
      }

      // Bare image URL
      const isBareUrl =
        trimmed.startsWith('http') &&
        !trimmed.includes(' ') &&
        IMAGE_EXTENSIONS.test(trimmed)

      if (isBareUrl) {
        return `![image](${trimmed})`
      }

      // Markdown link wrapping an image URL e.g. [https://...](https://...)
      const mdLinkMatch = trimmed.match(
        /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/
      )
      if (mdLinkMatch) {
        const href = mdLinkMatch[2]
        if (IMAGE_EXTENSIONS.test(href)) {
          return `![image](${href})`
        }
      }

      return line
    })
    .join('\n')
}

const markdownComponents = {
  a: ({
    node,
    ...props
  }: any) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation()
      }}
    />
  ),
  img: ({
    node,
    ...props
  }: any) => {
    const src = props.src ?? ''
    if (!src) return null

    try {
      const url = new URL(src)
      const ok =
        url.protocol === 'http:'
        || url.protocol === 'https:'
      if (!ok) return null
    } catch {
      return null
    }

    return (
      <img
        {...props}
        className={cn(
          'rounded-lg max-w-full',
          'h-auto max-h-80 mt-2 mb-2',
        )}
        loading="lazy"
        onError={(e: any) => {
          e.currentTarget.style.display =
            'none'
        }}
      />
    )
  },
}

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
            disabled={
              isSaving || !editContent.trim()
            }
            leftIcon={
              <Check className="h-4 w-4" />
            }
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelEdit}
            disabled={isSaving}
            leftIcon={
              <X className="h-4 w-4" />
            }
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  const deletedClass = cn(
    'text-gray-400 dark:text-gray-500 italic',
  )
  const contentClass = cn(
    'text-gray-900 dark:text-gray-100',
    'prose prose-sm dark:prose-invert max-w-none',
  )

  return (
    <div
      className={cn(
        'text-sm leading-relaxed mb-2 break-words',
        isDeleted ? deletedClass : contentClass,
      )}
    >
      {isDeleted ? (
        '[deleted]'
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={markdownComponents}
        >
          {preprocessContent(content)}
        </ReactMarkdown>
      )}
    </div>
  )
}
