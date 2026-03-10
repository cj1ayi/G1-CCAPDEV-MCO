import { ChangeEvent } from 'react'
import { Input, Textarea, Button } from '@/components/ui'
import { Trash2 } from 'lucide-react'
import { SpaceRule } from '../../services'

interface RuleEditorProps {
  rule: SpaceRule
  index: number
  titleError?: string
  descriptionError?: string
  canDelete: boolean
  onChange: (index: number, updated: SpaceRule) => void
  onDelete: (index: number) => void
}

export const RuleEditor = ({
  rule,
  index,
  titleError,
  descriptionError,
  canDelete,
  onChange,
  onDelete,
}: RuleEditorProps) => {
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(index, { ...rule, title: e.target.value })
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(index, { ...rule, description: e.target.value })
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Rule {index + 1}
        </span>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => onDelete(index)}
          disabled={!canDelete}
          aria-label={`Delete rule ${index + 1}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <Input
        label="Title"
        placeholder="e.g. Be Respectful"
        value={rule.title}
        maxLength={50}
        onChange={handleTitleChange}
        error={titleError}
      />

      <Textarea
        label="Description"
        placeholder="Describe this rule..."
        rows={2}
        value={rule.description}
        maxLength={200}
        onChange={handleDescriptionChange}
        error={descriptionError}
      />
    </div>
  )
}
