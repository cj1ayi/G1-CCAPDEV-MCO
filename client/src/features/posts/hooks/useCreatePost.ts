import { useState, useEffect } from 'react'
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import {
  postService,
} from '@/features/posts/services'
import {
  spaceService,
} from '@/features/spaces/services/spaceService'
import { Space } from '@/features/spaces/services'
import { useToast } from '@/hooks/ToastContext'

import type {
  PostFlair,
} from '../components/PostForm'

export interface CreatePostFormData {
  title: string
  content: string
  space: string
  imageUrl: string
  tags: string[]
  flair?: PostFlair
}

export interface CreatePostErrors {
  title?: string
  content?: string
  space?: string
  imageUrl?: string
}

export function useCreatePost() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    error: showError,
    warning: showWarning,
    success: showSuccess,
  } = useToast()

  const [allSpaces, setAllSpaces] =
    useState<Space[]>([])
  const [isLoadingSpaces, setIsLoadingSpaces] =
    useState(true)
  const [isSubmitting, setIsSubmitting] =
    useState(false)
  const [errors, setErrors] =
    useState<CreatePostErrors>({})

  const [formData, setFormData] =
    useState<CreatePostFormData>({
      title: '',
      content: '',
      space: searchParams.get('space') ?? '',
      imageUrl: '',
      tags: [],
      flair: undefined,
    })

  const [tagInput, setTagInput] = useState('')

  // Load ALL spaces
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const { data } =
          await spaceService.getSpaces()

        if (cancelled) return

        if (!Array.isArray(data)) {
          console.error(
            'useCreatePost: unexpected',
            data,
          )
          return
        }

        // Joined first, then rest
        const joined = data.filter(
          (s) => s.isJoined,
        )
        const other = data.filter(
          (s) => !s.isJoined,
        )
        setAllSpaces([...joined, ...other])
      } catch (err) {
        if (!cancelled) {
          console.error(
            'useCreatePost: failed',
            err,
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSpaces(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const setField = <
    K extends keyof CreatePostFormData,
  >(
    key: K,
    value: CreatePostFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
    if (key in errors) {
      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }))
    }
  }

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

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }))
    setTagInput('')
  }

  const removeTag = (tagToRemove: string) => {
    if (!tagToRemove) return
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter(
        (t) => t !== tagToRemove,
      ),
    }))
  }

  const validate = (): boolean => {
    const next: CreatePostErrors = {}

    const stripInvisible = (s: string) =>
      s.replace(/\p{Cf}/gu, '').trim()

    const visibleTitle = stripInvisible(
      formData.title,
    )
    if (!visibleTitle) {
      next.title = 'Title is required'
    } else if (visibleTitle.length < 5) {
      next.title =
        'Title must be at least 5 characters'
    }

    if (!stripInvisible(formData.content)) {
      next.content = 'Content is required'
    }

    if (!formData.space.trim()) {
      next.space = 'Please select a space'
    }

    const imageUrl = formData.imageUrl.trim()
    if (imageUrl) {
      try {
        const url = new URL(imageUrl)
        if (
          !['http:', 'https:'].includes(
            url.protocol,
          )
        ) {
          next.imageUrl =
            'Must start with http:// or https://'
        }
      } catch {
        next.imageUrl =
          'Image URL must be a valid URL'
      }
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const newPost =
        await postService.createPost({
          title: formData.title.trim(),
          content: formData.content.trim(),
          space: formData.space,
          imageUrl:
            formData.imageUrl.trim()
            || undefined,
          tags: formData.tags,
          flair: formData.flair,
        })

      if (!newPost?.id) {
        throw new Error(
          'Invalid response from server',
        )
      }

      showSuccess('Post created successfully')
      navigate(`/post/${newPost.id}`)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to create post.'
      showError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedSpace =
    allSpaces.find(
      (s) => s.name === formData.space,
    ) ?? null

  return {
    formData,
    tagInput,
    errors,
    allSpaces,
    isLoadingSpaces,
    isSubmitting,
    selectedSpace,
    setField,
    setTagInput,
    addTag,
    removeTag,
    handleSubmit,
  }
}
