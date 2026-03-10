import { useState } from 'react'
import { Card, Input, Textarea, Select, Button } from '@/components/ui'
import { Users } from 'lucide-react'
import { CreateSpaceDto } from '../services/spaceService'
import { CATEGORIES, SpaceRule } from '../types'
import { RulesList } from './RulesList'
import { useToast } from '@/hooks/ToastContext'

interface SpaceFormProps {
  onSubmit: (data: CreateSpaceDto & { rules: SpaceRule[] }) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export const SpaceForm = ({ onSubmit, onCancel, isLoading }: SpaceFormProps) => {
  const [formData, setFormData] = useState<CreateSpaceDto>({
    name: '',
    displayName: '',
    description: '',
    category: 'Interest',
    icon: '',
  })
  const [rules, setRules] = useState<SpaceRule[]>([])
  const { error: showError } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (rules.length === 0) {
      showError('At least one rule is required')
      return 
    }

    const hasEmptyRule = rules.some(r => !r.title.trim() || !r.description.trim())
    if (hasEmptyRule) {
      showError('All rules must have a title and description')
      return
    }

    onSubmit({ ...formData, rules })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 space-y-6">
        <h2 className="text-sm font-bold uppercase text-gray-400 tracking-wide">General</h2>

        <Input
          label="Space Name"
          placeholder="e.g. animo-developers"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          helperText="This will be used in the URL as r/name"
          required
        />

        <Input
          label="Display Name"
          placeholder="e.g. Animo Developers"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          required
        />

        <Textarea
          label="Description"
          placeholder="Describe what this community is for..."
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
          options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
        />

        <Input
          label="Icon"
          placeholder="e.g. AD"
          maxLength={10}
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          helperText="Up to 10 characters shown as the space icon."
        />
      </Card>

      <Card className="p-6">
        <RulesList rules={rules} onChange={setRules} />
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading} leftIcon={<Users className="size-4" />}>
          Create Space
        </Button>
      </div>
    </form>
  )
}
