import { CommentCardProps } from '@/components/comment'
import { getCommentsByPostId, getAllPosts } from '@/lib/mockData'

const STORAGE_KEY = 'animoforums_comments'

/**
 * Seeds localStorage with comments from mockData
 * Run this once to initialize your data
 */
export function seedCommentsToLocalStorage(): void {
  console.log('Starting comment seeding...')

  // Get all post IDs
  const posts = getAllPosts()
  const store: Record<string, CommentCardProps[]> = {}

  // Load comments for each post
  posts.forEach(post => {
    try {
      const comments = getCommentsByPostId(post.id)
      if (comments && comments.length > 0) {
        store[post.id] = comments
        console.log(`Loaded ${comments.length} comments for post "${post.title}"`)
      }
    } catch (err) {
      console.warn(`Could not load comments for post ${post.id}`)
    }
  })

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  
  const totalComments = Object.values(store).reduce((sum, comments) => sum + comments.length, 0)
  console.log(`Seeding complete! ${totalComments} comments across ${Object.keys(store).length} posts`)
}

/**
 * Clears all comments from localStorage
 */
export function clearComments(): void {
  localStorage.removeItem(STORAGE_KEY)
  console.log('All comments cleared')
}

/**
 * Resets comments back to mock data
 */
export function resetToMockData(): void {
  clearComments()
  seedCommentsToLocalStorage()
  console.log('Comments reset to mock data')
}

/**
 * Gets current comment stats
 */
export function getCommentStats(): void {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    console.log('No comments in localStorage')
    return
  }

  const store = JSON.parse(data)
  const postCount = Object.keys(store).length
  const totalComments = Object.values(store).reduce(
    (sum: number, comments: any) => sum + comments.length,
    0
  )

  console.log('📊 Comment Stats:')
  console.log(`  Posts with comments: ${postCount}`)
  console.log(`  Total comments: ${totalComments}`)
  
  Object.entries(store).forEach(([postId, comments]: [string, any]) => {
    console.log(`  Post ${postId}: ${comments.length} comments`)
  })
}

// Expose functions to window for dev console access
if (typeof window !== 'undefined') {
  (window as any).seedComments = seedCommentsToLocalStorage;
  (window as any).clearComments = clearComments;
  (window as any).resetComments = resetToMockData;
  (window as any).commentStats = getCommentStats
}
