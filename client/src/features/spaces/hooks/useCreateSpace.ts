import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService, CreateSpaceDto } from '../services/spaceService'

export const useCreateSpace = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async (data: CreateSpaceDto) => {
    setIsSubmitting(true)
    try {
      const newSpace = await spaceService.createSpace(data)
      navigate(`/space/${newSpace.name}`)
    } catch (error) {
      console.error('Failed to create space:', error)
      alert('Error creating space. Please try again.')
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
