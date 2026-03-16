import { useState, useCallback, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService, CreateSpaceDto, SpaceRule } from '../services'
import { useToast } from '@/hooks/ToastContext'
import {
  validateSpaceForm,
  hasErrors as checkHasErrors,
  type FieldErrors,
} from '../utils'

import { SpaceFormData } from '../components/SpaceForm'

export interface CreateSpaceFormData {
  name: string
  displayName: string
  description: string
  category: CreateSpaceDto['category']
  icon: string
  iconType: 'text' | 'image'
  rules: SpaceRule[]
}

const INITIAL_DATA: CreateSpaceFormData = {
  name: '',
  displayName: '',
  description: '',
  category: 'Interest',
  icon: '',
  iconType: 'text',
  rules: [],
}

const CREATE_FIELDS = ['name', 'displayName', 'description', 'category', 'icon']

export const useCreateSpace = () => {
  const navigate = useNavigate()
  const { error: showError } = useToast()

  const [formData, setFormData] = useState<CreateSpaceFormData>(INITIAL_DATA)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onChange = useCallback((data: SpaceFormData) => setFormData(data as CreateSpaceFormData), [])

  const onRulesChange = useCallback((rules: SpaceRule[]) => {
    setFormData((prev) => ({ ...prev, rules }))
  }, [])

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      const nextErrors = validateSpaceForm(formData, CREATE_FIELDS, formData.rules)
      setErrors(nextErrors)

      if (checkHasErrors(nextErrors)) {
        showError('Please fix the errors before submitting')
        return
      }

      setIsSubmitting(true)
      try {
        const { rules, iconType, ...dto } = formData
        const newSpace = await spaceService.createSpace({ ...dto, rules })
        navigate(`/r/${newSpace.name}`)
      } catch (error) {
        showError('Failed to create space. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, navigate, showError]
  )

  return {
    formData,
    errors,
    isSubmitting,
    onChange,
    onRulesChange,
    onSubmit,
    onCancel: () => navigate(-1),
  }
}
