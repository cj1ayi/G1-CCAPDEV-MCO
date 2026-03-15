import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { postService } from '@/features/posts/services'
import { spaceService } from '@/features/spaces/services/spaceService'
import { Space } from '@/features/spaces/services'
import { useToast } from '@/hooks/ToastContext'

export interface CreatePostFormData {
  title: string
  content: string
  space: string
  imageUrl: string
  tags: string[]
}

export interface CreatePostErrors {
  title?: string
  content?: string
  space?: string
}

export function useCreatePost() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { error: showError, warning: showWarning, success: showSuccess } = useToast()

  const [joinedSpaces, setJoinedSpaces] = useState<Space[]>([])
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<CreatePostErrors>({})

  const [formData, setFormData] = useState<CreatePostFormData>({
    title: '',
    content: '',
    space: searchParams.get('space') ?? '',
    imageUrl: '',
    tags: [],
  })

  const [tagInput, setTagInput] = useState('')

  // ── Load joined spaces ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const { data } = await spaceService.getSpaces()

        if (cancelled) return

        if (!Array.isArray(data)) {
          console.error('useCreatePost: unexpected spaces response', data)
          return
        }

        setJoinedSpaces(data.filter((s) => s.isJoined))
      } catch (err) {
        if (!cancelled) {
          console.error('useCreatePost: failed to load spaces', err)
        }
      } finally {
        if (!cancelled) setIsLoadingSpaces(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  // ── Field helpers ───────────────────────────────────────────────────────────
  const setField = <K extends keyof CreatePostFormData>(
    key: K,
    value: CreatePostFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    // Clear error for the field being edited
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  // ── Tag management ──────────────────────────────────────────────────────────
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (!tag) return

    if (formData.tags.length >= 5) {
      showWarning('Maximum 5 tags allowed')
      return
    }
    if (formData.tags.includes(tag)) {
      showWarning('Tag already added')
      return
    }

    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
    setTagInput('')
  }

  const removeTag = (tagToRemove: string) => {
    if (!tagToRemove) return
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }))
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: CreatePostErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.space.trim()) newErrors.space = 'Please select a space'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const newPost = await postService.createPost({
        title: formData.title.trim(),
        content: formData.content.trim(),
        space: formData.space,
        imageUrl: formData.imageUrl.trim() || undefined,
        tags: formData.tags,
      })

      if (!newPost?.id) {
        throw new Error('Invalid response from server')
      }

      showSuccess('Post created successfully')
      navigate(`/post/${newPost.id}`)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to create post. Please try again.'
      showError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Derived ─────────────────────────────────────────────────────────────────
  const selectedSpace = joinedSpaces.find((s) => s.name === formData.space) ?? null

  return {
    // State
    formData,
    tagInput,
    errors,
    joinedSpaces,
    isLoadingSpaces,
    isSubmitting,
    selectedSpace,
    // Setters
    setField,
    setTagInput,
    // Handlers
    addTag,
    removeTag,
    handleSubmit,
  }
}
