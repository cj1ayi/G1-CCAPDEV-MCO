import { convertObjectId } from '@/lib/apiUtils'
import type { Space } from '../services/spaceService'

// ─── Type Guards ─────────────────────────────────────────────
export const resolveId = (ref: string | { id?: string; _id?: string }): string =>
  typeof ref === 'object' ? (ref.id ?? ref._id ?? '') : ref

// ─── Ownership ───────────────────────────────────────────────
export const isSpaceOwner = (space: Space, userId: string): boolean =>
  resolveId(space.owner) === userId

// ─── Sanitizers ──────────────────────────────────────────────
export const sanitizeInput = <T extends object>(dto: T): T =>
  Object.fromEntries(
    Object.entries(dto).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
  ) as T

// ─── API Space → Domain Space Mapper ─────────────────────────
export const mapApiSpace = (
  raw: any,
  currentUser: { id: string } | null
): Space => {
  const converted = convertObjectId(raw)
  const members: any[] = converted.members ?? []

  return {
    ...converted,
    owner: converted.owner,
    memberCount: members.length,
    isJoined: currentUser
      ? members.some((m: any) => resolveId(m) === currentUser.id)
      : false,
  }
}
