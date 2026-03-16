import {
  useState,
  useEffect,
  useCallback,
  FormEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '@/features/auth/services/authService'
import { spaceService, Space, SpaceRule } from '../services'
import { validateAllRules } from '../utils/spaceValidation'
import { useToast } from '@/hooks/ToastContext'
import { validateIcon } from '../utils'
import type { SpaceFormData } from '../components/SpaceForm'

import {
  isSpaceOwner,
  validateField,
  validateSpaceForm,
  hasErrors as checkHasErrors,
  type FieldErrors,
} from '../utils'

const EDIT_FIELDS = [
  'displayName',
  'description',
  'category',
  'icon',
]

/** Fields skipped during per-key validation. */
const SKIP_VALIDATION: (keyof SpaceFormData)[] = [
  'name',
  'rules',
  'iconType',
]

export const useEditSpace = (spaceName?: string) => {
  const navigate = useNavigate()
  const { error: showError } = useToast()

  const [space, setSpace] = useState<Space | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] =
    useState<string | null>(null)

  const [formData, setFormData] = useState<SpaceFormData>({
    displayName: '',
    description: '',
    category: 'Interest',
    icon: '',
    iconType: 'text',
    rules: [],
  })

  const [touched, setTouched] = useState<
    Partial<Record<keyof SpaceFormData, boolean>>
  >({})
  const [errors, setErrors] = useState<FieldErrors>({})

  // ── Load space & verify ownership ──────────────────
  useEffect(() => {
    const load = async () => {
      if (!spaceName) {
        setAuthError('Space not specified')
        setIsLoading(false)
        return
      }

      try {
        const user = await getCurrentUser()

        if (!user) {
          navigate(
            `/login?redirect=/r/${spaceName}/edit`,
          )
          return
        }

        const found =
          await spaceService.getSpaceByName(spaceName)

        if (!found) {
          setAuthError('Space not found')
          setIsLoading(false)
          return
        }

        if (!isSpaceOwner(found, user.id)) {
          setAuthError(
            'Only the space owner can edit this space',
          )
          setIsLoading(false)
          return
        }

        setSpace(found)
        setFormData({
          displayName: found.displayName,
          description: found.description,
          category: found.category,
          icon: found.icon,
          iconType: found.icon?.startsWith('http')
            ? 'image'
            : 'text',
          rules: found.rules.map((r) => ({ ...r })),
        })
      } catch {
        setAuthError('Failed to load space')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [spaceName, navigate])

  // ── Live validation on touched fields ──────────────
  useEffect(() => {
    const nextErrors: FieldErrors = {}
    const keys = Object.keys(touched) as (
      keyof SpaceFormData
    )[]

    for (const key of keys) {
      if (!touched[key]) continue
      if (SKIP_VALIDATION.includes(key)) continue

      if (key === 'icon') {
        const err = validateIcon(
          formData.icon,
          formData.iconType,
        )
        if (err) nextErrors.icon = err
        continue
      }

      const err = validateField(
        key,
        formData[key] as string,
      )
      if (err) (nextErrors as any)[key] = err
    }

    if (touched.rules || formData.rules.length > 0) {
      Object.assign(
        nextErrors,
        validateAllRules(formData.rules),
      )
    }

    setErrors(nextErrors)
  }, [formData, touched])

  // ── Handlers ──────────────────
  const onChange = useCallback(
    (data: SpaceFormData) => setFormData(data),
    [],
  )

  const onBlur = useCallback(
    (field: keyof SpaceFormData) => {
      setTouched((prev) => ({ ...prev, [field]: true }))
    },
    [],
  )

  const onRulesChange = useCallback(
    (rules: SpaceRule[]) => {
      setFormData((prev) => ({ ...prev, rules }))
      setTouched((prev) => ({ ...prev, rules: true }))
    },
    [],
  )

  const onSubmit = useCallback(
    async (e: FormEvent): Promise<void> => {
      e.preventDefault()
      if (!space) return

      setTouched({
        displayName: true,
        description: true,
        category: true,
        icon: true,
        rules: true,
      })

      const nextErrors = validateSpaceForm(
        formData,
        EDIT_FIELDS,
        formData.rules,
      )
      setErrors(nextErrors)

      if (checkHasErrors(nextErrors)) return

      setIsSubmitting(true)
      try {
        await spaceService.updateSpace(space.id, {
          displayName: formData.displayName,
          description: formData.description,
          category: formData.category,
          icon: formData.icon,
          rules: formData.rules,
        })
        navigate(`/r/${space.name}`)
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to save changes'
        showError(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [space, formData, navigate, showError],
  )

  const onCancel = useCallback(() => {
    navigate(space ? `/r/${space.name}` : '/spaces')
  }, [space, navigate])

  return {
    space,
    formData,
    errors,
    isLoading,
    isSubmitting,
    authError,
    onChange,
    onBlur,
    onRulesChange,
    onSubmit,
    onCancel,
  }
}
