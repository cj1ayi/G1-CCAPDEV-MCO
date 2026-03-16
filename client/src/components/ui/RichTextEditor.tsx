import { useEditor, EditorContent, Mark } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  Terminal,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  ListOrdered,
  Quote,
  Superscript as SuperscriptIcon,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState, useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
  minHeight?: string
  hideHeaders?: boolean
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  error,
  minHeight = 'min-h-[200px]',
  hideHeaders = false,
}: RichTextEditorProps) => {
  const [, setSelectionUpdate] = useState(0)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const linkInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: hideHeaders ? false : { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Superscript,
      Markdown,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
          'p-4 text-sm text-gray-900 dark:text-white',
          minHeight,
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange((editor.storage as any).markdown.getMarkdown())
    },
  })

  useEffect(() => {
    if (editor && value !== (editor.storage as any).markdown.getMarkdown()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  useEffect(() => {
    if (!editor) return
    const handler = () => setSelectionUpdate((s) => s + 1)
    editor.on('selectionUpdate', handler)
    editor.on('transaction', handler)
    return () => {
      editor.off('selectionUpdate', handler)
      editor.off('transaction', handler)
    }
  }, [editor])

  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus()
    }
  }, [showLinkInput])

  if (!editor) return null

  const openLinkInput = () => {
    const previousUrl = editor.getAttributes('link').href
    setLinkUrl(previousUrl || '')
    setShowLinkInput(true)
  }

  const applyLink = () => {
    let url = linkUrl.trim()
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      if (
        !/^https?:\/\//i.test(url) && 
        !url.startsWith('/') && 
        !url.startsWith('#')
      ) {
        url = `https://${url}`
      }
      
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }

  const ToolbarButton = ({
    onAction,
    active,
    icon: Icon,
    title,
  }: {
    onAction: () => void
    active?: boolean
    icon: any
    title: string
  }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault()
        onAction()
      }}
      className={cn(
        'p-2 rounded transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800',
      )}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  )

  return (
    <div
      className={cn(
        'relative border rounded-lg overflow-hidden transition-all',
        'bg-white dark:bg-surface-dark',
        error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700',
        editor.isFocused && 'ring-2 ring-primary/20 border-primary',
      )}
    >
      <div
        className={cn(
          'flex items-center flex-wrap gap-0.5 px-2 py-1 border-b',
          'border-gray-200 dark:border-gray-700',
          'bg-gray-50 dark:bg-gray-800/50',
        )}
      >
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={Strikethrough}
          title="Strike"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleSuperscript().run()}
          active={editor.isActive('superscript')}
          icon={SuperscriptIcon}
          title="Emboss"
        />

        {!hideHeaders && (
          <>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
            <ToolbarButton
              onAction={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              active={editor.isActive('heading', { level: 1 })}
              icon={Heading1}
              title="H1"
            />
            <ToolbarButton
              onAction={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor.isActive('heading', { level: 2 })}
              icon={Heading2}
              title="H2"
            />
            <ToolbarButton
              onAction={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              active={editor.isActive('heading', { level: 3 })}
              icon={Heading3}
              title="H3"
            />
          </>
        )}

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
        <ToolbarButton
          onAction={openLinkInput}
          active={editor.isActive('link')}
          icon={LinkIcon}
          title="Link"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Ordered List"
        />
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={Quote}
          title="Quote"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          icon={Code}
          title="Code"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          icon={Terminal}
          title="Code Block"
        />
      </div>

      {showLinkInput && (
        <div
          className={cn(
            'absolute top-11 left-2 right-2 z-10 p-2 rounded-md shadow-lg',
            'bg-white dark:bg-gray-800 border border-gray-200 ' +
            'dark:border-gray-700 flex items-center gap-2 animate-in ' +
            'fade-in slide-in-from-top-1',
          )}
        >
          <input
            ref={linkInputRef}
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink()
              if (e.key === 'Escape') setShowLinkInput(false)
            }}
            placeholder="Paste or type a link..."
            className={cn(
              'flex-1 bg-gray-50 dark:bg-gray-900 border-none px-3 py-1.5',
              'text-sm rounded focus:ring-2 focus:ring-primary/20 outline-none',
            )}
          />
          <button
            onClick={applyLink}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowLinkInput(false)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
      {!editor.getText() && placeholder && (
        <div
          className={cn(
            'absolute top-[52px] left-4 pointer-events-none',
            'text-gray-400 text-sm',
          )}
        >
          {placeholder}
        </div>
      )}
    </div>
  )
}
