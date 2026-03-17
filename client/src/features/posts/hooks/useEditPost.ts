import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '../services'
import { useToast } from '@/hooks/ToastContext'
import type {
  PostFormData,
  PostFormErrors,
} from '../components/PostForm'

export function useEditPost(postId?: string) {
  const navigate = useNavigate()
  const {
    error: showError,
    warning: showWarning,
    success: showSuccess,
  } = useToast()

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    space: '',
    imageUrl: '',
    tags: [],
  })

  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<PostFormErrors>({})
  const [loadError, setLoadError] =
    useState<string | null>(null)

  // ── Fetch post on mount ───────
  useEffect(() => {
    if (!postId) {
      setLoadError('Post ID is required')
      setIsLoading(false)
      return
    }

    let cancelled = false

    const load = async () => {
      try {
        const post = await postService.getPostById(postId)

        if (cancelled) return

        if (!post) {
          setLoadError('Post not found')
          return
        }

        setFormData({
          title: post.title,
          content: post.content,
          space: post.space,
          imageUrl: post.imageUrl || '',
          tags: post.tags || [],
        })
      } catch (err) {
        if (cancelled) return
        const msg = err instanceof Error
          ? err.message
          : 'Failed to load post'
        setLoadError(msg)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [postId])

  // ── Field helpers ─────────────
  const setField = <K extends keyof PostFormData>(
    key: K,
    value: PostFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (key in errors) {
      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }))
    }
  }

  // ── Tags ─────────────────────
  const addTag = () => {
    const result = postService.validateTag(
      tagInput,
      formData.tags,
    )

    if (!result.valid) {
      showWarning(result.error || 'Invalid tag')
      return
    }

    setFormData((prev) => ({
      ...prev,
      tags: [
        ...prev.tags,
        tagInput.trim().toLowerCase(),
      ],
    }))
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    if (!tag) return
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  // ── Validation ────────────────
  const validate = (): boolean => {
    const result = postService.validatePostForm(
      {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl,
      },
      true,
    )
    setErrors(result)
    return Object.keys(result).length === 0
  }

  // ── Submit ──────────────────--
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !postId) return

    setIsSubmitting(true)
    try {
      await postService.updatePost(postId, {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
        tags: formData.tags,
      })
      showSuccess('Post updated successfully')
      navigate(`/post/${postId}`)
    } catch (err) {
      const msg = err instanceof Error
        ? err.message
        : 'Failed to update post'
      showError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (postId) {
      navigate(`/post/${postId}`)
      return
    }

    navigate(-1)
  }

  return {
    formData,
    tagInput,
    errors,
    isLoading,
    isSubmitting,
    loadError,
    setField,
    setTagInput,
    addTag,
    removeTag,
    handleSubmit,
    handleCancel,
  }
}
