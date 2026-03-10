import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService, CreateSpaceDto } from '../services/spaceService'
import { useToast } from '@/hooks/ToastContext'
import { SpaceRule } from '../types'

export const useCreateSpace = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { error: showError } = useToast()

const handleCreate = async (data: CreateSpaceDto & { rules?: SpaceRule[] }) => {
  setIsSubmitting(true)
  try {
    const newSpace = await spaceService.createSpace(data)
    navigate(`/r/${newSpace.name}`)
  } catch (error) {
    showError('Failed to create space. Please try again.')
  } finally {
    setIsSubmitting(false)
  }
}
  return {
    handleCreate,
    isSubmitting,
    onCancel: () => navigate(-1)
  }
}

