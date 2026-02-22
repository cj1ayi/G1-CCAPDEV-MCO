import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService, CreateSpaceDto } from '../services/spaceService'

export const useCreateSpace = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (data: CreateSpaceDto) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const newSpace = await spaceService.createSpace(data)
      navigate(`/r/${newSpace.name}`)
    } catch (error) {
      console.error('Failed to create space:', error)
      const errorMessage = 'Error creating space. Please try again.'
      setError(errorMessage)
      throw new Error(errorMessage) 
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    handleCreate,
    isSubmitting,
    error,
    onCancel: () => navigate(-1)
  }
}
