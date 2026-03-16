import React from 'react'
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Link as LinkIcon, 
  List, 
  Terminal,
  Eye,
  PenLine
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  value: string
  onChange: (value: string) => void
  isPreview: boolean
  onTogglePreview: (preview: boolean) => void
  className?: string
}

export const MarkdownToolbar = ({
  textareaRef,
  value,
  onChange,
  isPreview,
  onTogglePreview,
  className
}: MarkdownToolbarProps) => {
  const applyStyle = (type: 'bold' | 'italic' | 'strike' | 'code' | 'link' | 'list' | 'block') => {
    // If user clicks a style button while in preview, switch back to write mode
    if (isPreview) {
      onTogglePreview(false)
    }

    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selection = value.substring(start, end)
    
    let before = value.substring(0, start)
    let after = value.substring(end)
    let newText = value
    let newCursorPos = start

    const styles = {
      bold: { marker: '**', placeholder: 'bold text' },
      italic: { marker: '*', placeholder: 'italic text' },
      strike: { marker: '~~', placeholder: 'strikethrough text' },
      code: { marker: '`', placeholder: 'code' },
      link: { prefix: '[', suffix: '](https://)', placeholder: 'link text' },
      list: { prefix: '\n- ', placeholder: 'list item' },
      block: { prefix: '\n```\n', suffix: '\n```\n', placeholder: 'code block' }
    }

    const s = styles[type as keyof typeof styles]

    if (selection) {
      const prefix = 'marker' in s ? s.marker : (s as any).prefix
      const suffix = 'marker' in s ? s.marker : (s as any).suffix || ''
      
      if (selection.startsWith(prefix) && selection.endsWith(suffix)) {
        const inner = selection.substring(prefix.length, selection.length - suffix.length)
        newText = before + inner + after
        newCursorPos = start + inner.length
      } else {
        newText = before + prefix + selection + suffix + after
        newCursorPos = start + prefix.length + selection.length + suffix.length
      }
    } else {
      const prefix = 'marker' in s ? s.marker : (s as any).prefix
      const suffix = 'marker' in s ? s.marker : (s as any).suffix || ''
      const placeholder = s.placeholder
      
      newText = before + prefix + placeholder + suffix + after
      onChange(newText)
      textarea.focus()
      
      setTimeout(() => {
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + placeholder.length
        )
      }, 0)
      return
    }

    onChange(newText)
    textarea.focus()
    setTimeout(() => {
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const Button = ({ 
    icon: Icon, 
    onClick, 
    title,
    active = false
  }: { 
    icon: any, 
    onClick: () => void, 
    title: string,
    active?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-1.5 rounded transition-colors",
        active 
          ? "bg-primary/10 text-primary" 
          : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
      )}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  )

  return (
    <div className={cn(
      "flex items-center justify-between px-2 py-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50",
      className
    )}>
      <div className="flex items-center gap-1">
        <Button icon={Bold} onClick={() => applyStyle('bold')} title="Bold" />
        <Button icon={Italic} onClick={() => applyStyle('italic')} title="Italic" />
        <Button icon={Strikethrough} onClick={() => applyStyle('strike')} title="Strikethrough" />
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
        <Button icon={LinkIcon} onClick={() => applyStyle('link')} title="Link" />
        <Button icon={Code} onClick={() => applyStyle('code')} title="Inline Code" />
        <Button icon={Terminal} onClick={() => applyStyle('block')} title="Code Block" />
        <Button icon={List} onClick={() => applyStyle('list')} title="Bullet List" />
      </div>

      <div className="flex items-center gap-1 border-l border-gray-300 dark:border-gray-600 pl-2">
        <button
          type="button"
          onClick={() => onTogglePreview(false)}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold transition-colors",
            !isPreview ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-gray-500"
          )}
        >
          <PenLine className="h-3 w-3" />
          Write
        </button>
        <button
          type="button"
          onClick={() => onTogglePreview(true)}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold transition-colors",
            isPreview ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-gray-500"
          )}
        >
          <Eye className="h-3 w-3" />
          Preview
        </button>
      </div>
    </div>
  )
}
