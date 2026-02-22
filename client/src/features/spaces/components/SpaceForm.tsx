import { useState } from 'react'
import {
  Card,
  Input,
  Textarea,
  Select,
  Button,
} from '@/components/ui'
import { Users } from 'lucide-react'
import { CreateSpaceDto } from '../services/spaceService'
import { CATEGORIES } from '../types'

interface SpaceFormProps {
  onSubmit: (data: CreateSpaceDto) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export const SpaceForm = ({
  onSubmit,
  onCancel,
  isLoading,
}: SpaceFormProps) => {
  const [formData, setFormData] = useState<CreateSpaceDto>({
    name: '',
    displayName: '',
    description: '',
    category: 'Interest',
    icon: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <Input
            label="Space Name"
            placeholder="e.g. animo-developers"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            helperText="This will be used in the URL as r/name"
            required
          />

          <Input
            label="Display Name"
            placeholder="e.g. Animo Developers"
            value={formData.displayName}
            onChange={(e) =>
              setFormData({
                ...formData,
                displayName: e.target.value,
              })
            }
            required
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as any,
              })
            }
            options={CATEGORIES.map((cat) => ({
              value: cat,
              label: cat,
            }))}
          />

          <Textarea
            label="Description"
            placeholder="Describe what this community is for..."
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            required
          />

          <Input
            label="Icon Text"
            placeholder="e.g. AD"
            maxLength={2}
            value={formData.icon}
            onChange={(e) =>
              setFormData({ ...formData, icon: e.target.value })
            }
            helperText="1-2 characters to show if no image is
              uploaded."
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          isLoading={isLoading}
          leftIcon={<Users className="size-4" />}
        >
          Create Space
        </Button>
      </div>
    </form>
  )
}
