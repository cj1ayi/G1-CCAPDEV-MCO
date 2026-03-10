import { useState, useEffect, useCallback, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService } from '../services/spaceService'
import {
  Space,
  SpaceRule,
  EditSpaceFormData,
  EditSpaceFormErrors,
} from '../types'
import { getCurrentUser } from '@/features/auth/services/authService'

const DISPLAY_NAME_RE = /^[a-zA-Z0-9 -]+$/

interface UseEditSpaceReturn {
  space: Space | null
  formData: EditSpaceFormData
  errors: EditSpaceFormErrors
  isLoading: boolean
  isSubmitting: boolean
  authError: string | null
  onChange: (data: EditSpaceFormData) => void
  onBlur: (field: keyof EditSpaceFormData) => void
  onRulesChange: (rules: SpaceRule[]) => void
  onSubmit: (e: FormEvent) => Promise<void>
  onCancel: () => void
}

const validateField = (
  field: keyof EditSpaceFormData,
  formData: EditSpaceFormData
): string | undefined => {
  switch (field) {
    case 'displayName': {
      const v = formData.displayName.trim()
      if (!v) return 'Display name is required'
      if (v.length < 3 || v.length > 50) return 'Must be 3–50 characters'
      if (!DISPLAY_NAME_RE.test(v)) return 'Only letters, numbers, spaces and hyphens'
      return undefined
    }
    case 'description': {
      const v = formData.description.trim()
      if (!v) return 'Description is required'
      if (v.length < 10 || v.length > 500) return 'Must be 10–500 characters'
      return undefined
    }
    case 'category':
      return !formData.category ? 'Category is required' : undefined
    case 'icon': {
      const v = formData.icon.trim()
      if (!v) return 'Icon is required'
      if (v.length > 10) return 'Must be at most 10 characters'
      return undefined
    }
    default:
      return undefined
  }
}

const validateRules = (
  rules: SpaceRule[]
): EditSpaceFormErrors['ruleErrors'] => {
  return rules.map(rule => ({
    title: !rule.title.trim() ? 'Title is required' : undefined,
    description: !rule.description.trim() ? 'Description is required' : undefined,
  }))
}

export const useEditSpace = (spaceName?: string): UseEditSpaceReturn => {
  const navigate = useNavigate()

  const [space, setSpace] = useState<Space | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const [formData, setFormData] = useState<EditSpaceFormData>({
    displayName: '',
    description: '',
    category: 'Interest',
    icon: '',
    rules: [],
  })

  const [touched, setTouched] = useState<Partial<Record<keyof EditSpaceFormData, boolean>>>({})
  const [errors, setErrors] = useState<EditSpaceFormErrors>({})

  // Load space and verify ownership
  useEffect(() => {
    const load = async () => {
      if (!spaceName) {
        setAuthError('Space not specified')
        setIsLoading(false)
        return
      }

      const currentUser = getCurrentUser()
      if (!currentUser) {
        navigate(`/login?redirect=/r/${spaceName}/edit`)
        return
      }

      try {
        const found = await spaceService.getSpaceByName(spaceName)

        if (!found) {
          setAuthError('Space not found')
          setIsLoading(false)
          return
        }

        const user = await getCurrentUser()
        if (found.owner !== user?.id) {
          setAuthError('Only the space owner can edit this space')
          setIsLoading(false)
          return
        }

        setSpace(found)
        setFormData({
          displayName: found.displayName,
          description: found.description,
          category: found.category,
          icon: found.icon,
          rules: found.rules.map(r => ({ ...r })),
        })
      } catch {
        setAuthError('Failed to load space')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [spaceName, navigate])

  // Re-validate touched fields whenever formData changes
  useEffect(() => {
    const nextErrors: EditSpaceFormErrors = {}

    for (const key of Object.keys(touched) as (keyof EditSpaceFormData)[]) {
      if (!touched[key]) continue
      if (key === 'rules') continue
      const err = validateField(key, formData)
      if (err) (nextErrors as Record<string, string>)[key] = err
    }

    if (touched.rules || formData.rules.length > 0) {
      const ruleErrors = validateRules(formData.rules)
      const hasRuleError = ruleErrors?.some(e => e.title || e.description)
      if (hasRuleError) nextErrors.ruleErrors = ruleErrors
      if (formData.rules.length < 1) nextErrors.rules = 'At least one rule is required'
    }

    setErrors(nextErrors)
  }, [formData, touched])

  const onChange = useCallback((data: EditSpaceFormData) => {
    setFormData(data)
  }, [])

  const onBlur = useCallback((field: keyof EditSpaceFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const onRulesChange = useCallback((rules: SpaceRule[]) => {
    setFormData(prev => ({ ...prev, rules }))
    setTouched(prev => ({ ...prev, rules: true }))
  }, [])

  const onSubmit = useCallback(
    async (e: FormEvent): Promise<void> => {
      e.preventDefault()
      if (!space) return

      // Touch all fields to surface any hidden errors
      setTouched({
        displayName: true,
        description: true,
        category: true,
        icon: true,
        rules: true,
      })

      // Full validation
      const nextErrors: EditSpaceFormErrors = {}
      const fieldKeys: (keyof EditSpaceFormData)[] = [
        'displayName', 'description', 'category', 'icon',
      ]
      for (const key of fieldKeys) {
        const err = validateField(key, formData)
        if (err) (nextErrors as Record<string, string>)[key] = err
      }

      const ruleErrors = validateRules(formData.rules)
      const hasRuleError = ruleErrors?.some(e => e.title || e.description) ?? false
      if (hasRuleError) nextErrors.ruleErrors = ruleErrors
      if (formData.rules.length < 1) nextErrors.rules = 'At least one rule is required'

      setErrors(nextErrors)

      const hasErrors =
        Object.keys(nextErrors).filter(k => k !== 'ruleErrors').length > 0 ||
        hasRuleError

      if (hasErrors) return

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
        const message = err instanceof Error ? err.message : 'Failed to save changes'
        throw new Error(message)      } finally {
        setIsSubmitting(false)
      }
    },
    [space, formData, navigate]
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
