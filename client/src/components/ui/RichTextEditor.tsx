import { useEditor, EditorContent } from '@tiptap/react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
  minHeight?: string
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  error,
  minHeight = 'min-h-[200px]'
}: RichTextEditorProps) => {
  const [, setSelectionUpdate] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
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
          minHeight
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.storage.markdown.getMarkdown())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(value, false)
    }
  }, [value, editor])

  useEffect(() => {
    if (!editor) return
    const handler = () => setSelectionUpdate(s => s + 1)
    editor.on('selectionUpdate', handler)
    editor.on('transaction', handler)
    return () => {
      editor.off('selectionUpdate', handler)
      editor.off('transaction', handler)
    }
  }, [editor])

  if (!editor) return null

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const ToolbarButton = ({
    onAction,
    active,
    icon: Icon,
    title,
  }: {
    onAction: () => void,
    active?: boolean,
    icon: any,
    title: string,
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
          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  )

  return (
    <div className={cn(
      'relative border rounded-lg overflow-hidden transition-all',
      'bg-white dark:bg-surface-dark',
      error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700',
      editor.isFocused && 'ring-2 ring-primary/20 border-primary'
    )}>
      <div className={cn(
        'flex items-center flex-wrap gap-0.5 px-2 py-1 border-b',
        'border-gray-200 dark:border-gray-700',
        'bg-gray-50 dark:bg-gray-800/50'
      )}>
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
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
        <ToolbarButton
          onAction={setLink}
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
      <EditorContent editor={editor} />
      {!editor.getText() && placeholder && (
        <div className="absolute top-[52px] left-4 pointer-events-none text-gray-400 text-sm">
          {placeholder}
        </div>
      )}
    </div>
  )
}
