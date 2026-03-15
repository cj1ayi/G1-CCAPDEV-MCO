import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  Terminal,
  Heading1,
  Heading2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  error
}: RichTextEditorProps) => {
  // Dummy state to force re-render on selection changes
  // This ensures marks (bold, etc.) highlight correctly at the cursor position
  const [, setSelectionUpdate] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Markdown,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
          'min-h-[200px] p-4 text-sm text-gray-900 dark:text-white'
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.storage.markdown.getMarkdown())
    },
  })

  // Force re-render when the cursor moves or marks change
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

  const ToolbarButton = ({
    onAction,
    active,
    icon: Icon,
    title
  }: {
    onAction: () => void,
    active: boolean,
    icon: any,
    title: string
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        // Prevent focus loss from the editor
        e.preventDefault()
      }}
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
      {/* Ribbon / Toolbar */}
      <div className={cn(
        'flex items-center gap-0.5 px-2 py-1 border-b',
        'border-gray-200 dark:border-gray-700',
        'bg-gray-50 dark:bg-gray-800/50'
      )}>
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={Bold}
          title="Bold"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={Italic}
          title="Italic"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={Strikethrough}
          title="Strike"
        />
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          icon={Code}
          title="Inline Code"
        />
        <ToolbarButton
          onAction={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          icon={Terminal}
          title="Code Block"
        />
      </div>

      {/* Actual Editor Area */}
      <EditorContent editor={editor} />

      {/* Placeholder overlay */}
      {!editor.getText() && placeholder && (
        <div className={cn(
          'absolute top-[52px] left-4 pointer-events-none',
          'text-gray-400 text-sm'
        )}>
          {placeholder}
        </div>
      )}
    </div>
  )
}
