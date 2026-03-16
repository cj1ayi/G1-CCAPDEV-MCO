import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
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
  ImageIcon,
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

/** Safe accessor for tiptap-markdown storage. */
function getMarkdown(editor: any): string {
  return editor?.storage?.markdown?.getMarkdown?.() ?? ''
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = '',
  error,
  minHeight = 'min-h-[200px]',
  hideHeaders = false,
}: RichTextEditorProps) => {
  const [, setSelectionUpdate] = useState(0)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const linkInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: hideHeaders ? false : { levels: [1, 2, 3] },
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Superscript,
      Markdown,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto max-h-80 mt-2 mb-2',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: cn(
          'before:content-[attr(data-placeholder)]',
          'before:text-gray-400',
          'before:float-left',
          'before:h-0',
          'before:pointer-events-none',
        ),
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert',
          'max-w-none focus:outline-none',
          'p-4 text-sm',
          'text-gray-900 dark:text-white',
          minHeight,
        ),
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(getMarkdown(e))
    },
  })

  useEffect(() => {
    if (!editor) return
    if (value !== getMarkdown(editor)) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  useEffect(() => {
    if (!editor) return
    const handler = () => {
      setSelectionUpdate((s) => s + 1)
    }
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

  useEffect(() => {
    if (showImageInput && imageInputRef.current) {
      imageInputRef.current.focus()
    }
  }, [showImageInput])

  if (!editor) return null

  const openLinkInput = () => {
    const previousUrl = editor.getAttributes('link').href
    setLinkUrl(previousUrl || '')
    setShowImageInput(false)
    setShowLinkInput(true)
  }

  const openImageInput = () => {
    setImageUrl('')
    setShowLinkInput(false)
    setShowImageInput(true)
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

  const applyImage = () => {
    let url = imageUrl.trim()
    if (!url) {
      setShowImageInput(false)
      return
    }
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`
    }
    editor.chain().focus().setImage({ src: url }).run()
    setShowImageInput(false)
    setImageUrl('')
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
          : cn(
              'text-gray-500',
              'hover:bg-gray-100',
              'dark:hover:bg-gray-800',
            ),
      )}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  )

  return (
    <div
      className={cn(
        'relative border rounded-lg',
        'overflow-hidden transition-all',
        'bg-white dark:bg-surface-dark',
        error
          ? 'border-red-500'
          : 'border-gray-200 dark:border-gray-700',
        editor.isFocused && 'ring-2 ring-primary/20 border-primary',
      )}
    >
      <div
        className={cn(
          'flex items-center flex-wrap',
          'gap-0.5 px-2 py-1 border-b',
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
            <div className={cn('w-px h-4 mx-1', 'bg-gray-300 dark:bg-gray-600')} />
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

        <div className={cn('w-px h-4 mx-1', 'bg-gray-300 dark:bg-gray-600')} />
        <ToolbarButton
          onAction={openLinkInput}
          active={editor.isActive('link')}
          icon={LinkIcon}
          title="Link"
        />
        <ToolbarButton
          onAction={openImageInput}
          active={showImageInput}
          icon={ImageIcon}
          title="Insert Image"
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
        <div className={cn('w-px h-4 mx-1', 'bg-gray-300 dark:bg-gray-600')} />
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

      {/* Link input popover */}
      {showLinkInput && (
        <div
          className={cn(
            'absolute top-11 left-2 right-2',
            'z-10 p-2 rounded-md shadow-lg',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'flex items-center gap-2',
            'animate-in fade-in slide-in-from-top-1',
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
              'flex-1 bg-gray-50 dark:bg-gray-900',
              'border-none px-3 py-1.5 text-sm rounded',
              'focus:ring-2 focus:ring-primary/20 outline-none',
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

      {/* Image URL input popover */}
      {showImageInput && (
        <div
          className={cn(
            'absolute top-11 left-2 right-2',
            'z-10 p-2 rounded-md shadow-lg',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'flex items-center gap-2',
            'animate-in fade-in slide-in-from-top-1',
          )}
        >
          <input
            ref={imageInputRef}
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyImage()
              if (e.key === 'Escape') setShowImageInput(false)
            }}
            placeholder="Paste image URL..."
            className={cn(
              'flex-1 bg-gray-50 dark:bg-gray-900',
              'border-none px-3 py-1.5 text-sm rounded',
              'focus:ring-2 focus:ring-primary/20 outline-none',
            )}
          />
          <button
            onClick={applyImage}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowImageInput(false)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
