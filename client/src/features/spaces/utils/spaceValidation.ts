import type { SpaceRule } from '../services/spaceService'

// ─── Constants ───────────────────────────────────────────────
const DISPLAY_NAME_RE = /^[a-zA-Z0-9 -]+$/
const SPACE_NAME_RE = /^[a-z0-9-]+$/

// ─── Field Validators ────────────────────────────────────────

export const validateDisplayName = (value: string): string | undefined => {
  const v = value.trim()
  if (!v) 
    return 'Display name is required'

  if (v.length < 3 || v.length > 50) 
    return 'Must be 3–50 characters'

  if (!DISPLAY_NAME_RE.test(v)) 
    return 'Only letters, numbers, spaces and hyphens'

  return undefined
}

export const validateDescription = (value: string): string | undefined => {
  const v = value.trim()

  if (!v) 
    return 'Description is required'

  if (v.length < 10 || v.length > 500) 
    return 'Must be 10–500 characters'

  return undefined
}

export const validateCategory = (value: string): string | undefined =>
  !value ? 'Category is required' : undefined

export const validateIcon = (value: string): string | undefined => {
  const v = value.trim()

  if (!v) 
    return 'Icon is required'

  if (v.length > 10) 
    return 'Must be at most 10 characters'

  return undefined
}

export const validateSpaceName = (value: string): string | undefined => {
  const v = value.trim()

  if (!v) 
    return 'Space name is required'

  if (v.length < 3 || v.length > 30) 
    return 'Must be 3–30 characters'

  if (!SPACE_NAME_RE.test(v)) 
    return 'Only lowercase letters, numbers and hyphens'

  return undefined
}

// ─── Composite Validators ────────────────────────────────────

export interface FieldErrors {
  name?: string
  displayName?: string
  description?: string
  category?: string
  icon?: string
  rules?: string
  ruleErrors?: { title?: string; description?: string }[]
}

const FIELD_VALIDATORS: Record<string, (value: string) => string | undefined> = {
  displayName: validateDisplayName,
  description: validateDescription,
  category: validateCategory,
  icon: validateIcon,
  name: validateSpaceName,
}

export const validateField = (field: string, value: string): string | undefined =>
  FIELD_VALIDATORS[field]?.(value)

export const validateRules = (
  rules: SpaceRule[]
): { title?: string; description?: string }[] =>
  rules.map((rule) => ({
    title: !rule.title.trim() ? 'Title is required' : undefined,
    description: !rule.description.trim() ? 'Description is required' : undefined,
  }))

export const validateAllRules = (
  rules: SpaceRule[]
): { ruleErrors?: { title?: string; description?: string }[]; rules?: string } => {
  const errors: { ruleErrors?: { title?: string; description?: string }[]; rules?: string } = {}

  if (rules.length < 1) {
    errors.rules = 'At least one rule is required'
  }

  const ruleErrors = validateRules(rules)
  const hasRuleError = ruleErrors.some((e) => e.title || e.description)
  if (hasRuleError) errors.ruleErrors = ruleErrors

  return errors
}

export const validateSpaceForm = (
  data: Record<string, any>,
  fields: string[],
  rules: SpaceRule[]
): FieldErrors => {
  const errors: FieldErrors = {}

  for (const field of fields) {
    const err = validateField(field, data[field] ?? '')
    if (err) (errors as any)[field] = err
  }

  const ruleErrors = validateAllRules(rules)
  Object.assign(errors, ruleErrors)

  return errors
}

export const hasErrors = (errors: FieldErrors): boolean =>
  Object.keys(errors).filter((k) => k !== 'ruleErrors').length > 0 ||
  (errors.ruleErrors?.some((e) => e.title || e.description) ?? false)
