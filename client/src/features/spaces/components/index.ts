// ─── Unified Form (replaces CreateSpaceCard, EditSpaceForm, old SpaceForm) ───
export { SpaceForm } from './SpaceForm'
export type { SpaceFormData } from './SpaceForm'

// ─── Backward-compatible aliases ─────────────────────────────
// Old imports still work. Remove these once all pages are migrated.
export { SpaceForm as EditSpaceForm } from './SpaceForm'

// ─── Rules (grouped subfolder) ───────────────────────────────
export { RuleEditor, RulesList, RulesWidget } from './rules'

// ─── Core components ─────────────────────────────────────────
export { SpaceCard } from './SpaceCard'
export { SpaceDeleteModal } from './SpaceDeleteModal'
export { SpaceDirectoryHeader } from './SpaceDirectoryHeader'
export { SpaceEmptyState } from './SpaceEmptyState'
export { SpaceFilters } from './SpaceFilters'
export { SpaceHeader } from './SpaceHeader'
export { SpaceSortBar } from './SpaceSortBar'
export { SpaceAboutWidget } from './SpaceAboutWidget'
export { YourSpacesWidget } from './YourSpacesWidget'
