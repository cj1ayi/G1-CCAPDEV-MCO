import {
  useQuery,
} from '@tanstack/react-query'
import { userService } from '../services'
import type {
  UserComment,
  UserSpace,
} from '../services/userService'
import { Post } from '@/features/posts/types'

export function useProfileQuery(
  username?: string,
) {
  const userQuery = useQuery({
    queryKey: ['profile', username],
    queryFn: () =>
      userService.getUserByUsername(
        username!,
      ),
    enabled: !!username,
  })

  const userId = userQuery.data?.id

  const postsQuery = useQuery({
    queryKey: [
      'profile-posts',
      userId,
    ],
    queryFn: () =>
      userService.getUserPosts(userId!),
    enabled: !!userId,
  })

  const commentsQuery = useQuery({
    queryKey: [
      'profile-comments',
      userId,
    ],
    queryFn: () =>
      userService.getUserComments(
        userId!,
      ),
    enabled: !!userId,
  })

  const spacesQuery = useQuery({
    queryKey: [
      'profile-spaces',
      userId,
    ],
    queryFn: () =>
      userService.getUserSpaces(userId!),
    enabled: !!userId,
  })

  const upvotedQuery = useQuery({
    queryKey: [
      'profile-upvoted',
      userId,
    ],
    queryFn: () =>
      userService.getUserUpvotedPosts(
        userId!,
      ),
    enabled: !!userId,
  })

  return {
    user: userQuery.data ?? null,
    posts: (
      postsQuery.data ?? []
    ) as Post[],
    comments: (
      commentsQuery.data ?? []
    ) as UserComment[],
    spaces: (
      spacesQuery.data ?? []
    ) as UserSpace[],
    upvotedPosts: (
      upvotedQuery.data ?? []
    ) as Post[],
    isLoading: userQuery.isLoading,
  }
}
