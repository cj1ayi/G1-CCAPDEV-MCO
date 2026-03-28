import { useQuery } from '@tanstack/react-query'
import {
  postService,
} from '@/features/posts/services'

export function usePostDetailQuery(
  postId?: string,
) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () =>
      postService.getPostById(postId!),
    enabled: !!postId,
  })
}
