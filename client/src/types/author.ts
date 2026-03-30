/** Raw author data as returned by the API */
export interface RawAuthor {
  username: string
  avatar?: string
  badges?: string[]
  displayName?: string
  name?: string
}

/** Normalized author shape used across all UI components */
export interface Author {
  id: string
  name: string
  username: string
  avatar?: string
  badges?: string[]
}

/** Maps a raw API author to the normalized Author shape */
export function mapRawAuthor(
  raw: RawAuthor,
  authorId: string,
): Author {
  return {
    id: authorId,
    name: raw.displayName ?? raw.name ?? raw.username,
    username: raw.username,
    avatar: raw.avatar ?? '',
    badges: raw.badges ?? [],
  }
}
