import {
  useState,
  useCallback,
  FormEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  spaceService,
  SpaceRule,
} from '../services'
import type { CreateSpaceDto } from '../services'
import { useToast } from '@/hooks/ToastContext'
import type {
  SpaceFormData,
} from '../components/SpaceForm'
import {
  useJoinedSpaces,
} from '../hooks/JoinedSpacesContext'
import {
  validateSpaceForm,
  hasErrors as checkHasErrors,
  type FieldErrors,
} from '../utils'

const INITIAL_DATA: SpaceFormData = {
  name: '',
  displayName: '',
  description: '',
  category: 'Interest',
  icon: '',
  iconType: 'text',
  rules: [],
}

const CREATE_FIELDS = [
  'name',
  'displayName',
  'description',
  'category',
  'icon',
]

export const useCreateSpace = () => {
  const navigate = useNavigate()
  const {
    error: showError,
    success: showSuccess,
  } = useToast()
  const { refresh: refreshSpaces } =
    useJoinedSpaces()

  const [formData, setFormData] =
    useState<SpaceFormData>(INITIAL_DATA)
  const [errors, setErrors] =
    useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const onChange = useCallback(
    (data: SpaceFormData) => setFormData(data),
    [],
  )

  const onRulesChange = useCallback(
    (rules: SpaceRule[]) => {
      setFormData((prev) => ({
        ...prev,
        rules,
      }))
    },
    [],
  )

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      const nextErrors = validateSpaceForm(
        formData,
        CREATE_FIELDS,
        formData.rules,
      )
      setErrors(nextErrors)

      if (checkHasErrors(nextErrors)) {
        showError(
          'Please fix the errors'
          + ' before submitting',
        )
        return
      }

      setIsSubmitting(true)
      try {
        const { rules, iconType, ...rest } =
          formData

        if (!rest.name) {
          showError('Space name is required')
          return
        }

        const dto: CreateSpaceDto & {
          rules: SpaceRule[]
        } = {
          ...rest,
          name: rest.name,
          rules,
        }

        const created =
          await spaceService.createSpace(dto)
        refreshSpaces()
        showSuccess(
          `r/${created.name} created!`,
        )
        navigate(`/r/${created.name}`)
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : ''

        if (
          msg.includes('duplicate') ||
          msg.includes('E11000') ||
          msg.includes('already exists')
        ) {
          showError(
            'A space with this name already'
            + ' exists. Choose a different name.',
          )
        } else if (msg) {
          showError(msg)
        } else {
          showError(
            'Failed to create space.'
            + ' Please try again.',
          )
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      formData,
      navigate,
      showError,
      showSuccess,
      refreshSpaces,
    ],
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
