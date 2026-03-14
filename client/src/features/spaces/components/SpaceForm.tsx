import { FormEvent } from 'react'
import { Card, Input, Textarea, Select, Button } from '@/components/ui'
import { Users, Save } from 'lucide-react'
import { Space, CATEGORIES, SpaceRule } from '../services'
import { RulesList } from './rules'
import { formatNumber } from '@/lib/utils'
import type { FieldErrors } from '../utils'

export interface SpaceFormData {
  name?: string
  displayName: string
  description: string
  category: Space['category']
  icon: string
  iconType: 'text' | 'image'
  rules: SpaceRule[]
}

interface SpaceFormProps {
  mode: 'create' | 'edit'
  space?: Space
  formData: SpaceFormData
  errors: FieldErrors
  isSubmitting: boolean
  onChange: (data: SpaceFormData) => void
  onBlur?: (field: keyof SpaceFormData) => void
  onRulesChange: (rules: SpaceRule[]) => void
  onSubmit: (e: FormEvent) => void
  onCancel: () => void
}

export const SpaceForm = ({
  mode,
  space,
  formData,
  errors,
  isSubmitting,
  onChange,
  onBlur,
  onRulesChange,
  onSubmit,
  onCancel,
}: SpaceFormProps) => {
  const isEdit = mode === 'edit'
  const handleBlur = (field: keyof SpaceFormData) => onBlur?.(field)

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {isEdit && space && (
        <Card className="p-6">
          <h2 className="text-sm font-bold uppercase text-gray-400 mb-4 tracking-wide">
            Space Info (read-only)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="block text-gray-500 mb-1">Space Slug</span>
              <span className="font-semibold dark:text-white">r/{space.name}</span>
            </div>
            <div>
              <span className="block text-gray-500 mb-1">Created</span>
              <span className="font-semibold dark:text-white">{space.createdDate}</span>
            </div>
            <div>
              <span className="block text-gray-500 mb-1">Members</span>
              <span className="font-semibold dark:text-white">{formatNumber(space.memberCount)}</span>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 space-y-5">
        <h2 className="text-sm font-bold uppercase text-gray-400 tracking-wide">General</h2>

        {!isEdit && (
          <Input
            label="Space Name"
            placeholder="e.g. animo-developers"
            value={formData.name ?? ''}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            onBlur={() => handleBlur('name')}
            helperText="This will be used in the URL as r/name"
            error={errors.name}
            required
          />
        )}

        <Input
          label="Display Name"
          placeholder={isEdit ? 'e.g. CCS Student Gov' : 'e.g. Animo Developers'}
          value={formData.displayName}
          maxLength={50}
          required
          error={errors.displayName}
          onChange={(e) => onChange({ ...formData, displayName: e.target.value })}
          onBlur={() => handleBlur('displayName')}
        />

        <Textarea
          label="Description"
          placeholder="Describe what this community is for..."
          rows={4}
          value={formData.description}
          maxLength={500}
          required
          error={errors.description}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          onBlur={() => handleBlur('description')}
        />

        <Select
          label="Category"
          value={formData.category}
          options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          error={errors.category}
          onChange={(e) =>
            onChange({ ...formData, category: e.target.value as SpaceFormData['category'] })
          }
          onBlur={() => handleBlur('category')}
        />

        {/* Icon field with text/image toggle */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Icon <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-2 mb-3">
            <Button
              type="button"
              variant={formData.iconType !== 'image' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onChange({ ...formData, iconType: 'text', icon: '' })}
            >
              Text
            </Button>
            <Button
              type="button"
              variant={formData.iconType === 'image' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onChange({ ...formData, iconType: 'image', icon: '' })}
            >
              Image URL
            </Button>
          </div>

          {formData.iconType === 'image' ? (
            <div className="space-y-2">
              <Input
                placeholder="https://example.com/icon.png"
                value={formData.icon}
                error={errors.icon}
                onChange={(e) => onChange({ ...formData, icon: e.target.value })}
                onBlur={() => handleBlur('icon')}
              />
              {formData.icon && (
                <img
                  src={formData.icon}
                  alt="Icon preview"
                  className="size-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
            </div>
          ) : (
            <Input
              placeholder={isEdit ? 'e.g. CS' : 'e.g. AD'}
              maxLength={10}
              value={formData.icon}
              error={errors.icon}
              helperText="Up to 10 characters shown as the space icon."
              onChange={(e) => onChange({ ...formData, icon: e.target.value })}
              onBlur={() => handleBlur('icon')}
            />
          )}
        </div>
      </Card>

      <Card className="p-6">
        <RulesList
          rules={formData.rules}
          ruleErrors={errors.ruleErrors}
          onChange={onRulesChange}
        />
        {errors.rules && <p className="mt-2 text-sm text-red-500">{errors.rules}</p>}
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          isLoading={isSubmitting}
          leftIcon={isEdit ? <Save className="size-4" /> : <Users className="size-4" />}
        >
          {isEdit ? 'Save Changes' : 'Create Space'}
        </Button>
      </div>
    </form>
  )
}
