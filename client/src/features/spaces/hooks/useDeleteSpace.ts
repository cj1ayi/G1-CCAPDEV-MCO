import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService } from '../services'
import { useToast } from '@/hooks/ToastContext'

export const useDeleteSpace = () => {
  const navigate = useNavigate()
  const { error: showError } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const confirmDelete = useCallback(
    async (spaceId: string) => {
      setIsDeleting(true)
      try {
        await spaceService.deleteSpace(spaceId)
        navigate('/spaces')
      } catch {
        showError('Failed to delete space. Please try again.')
      } finally {
        setIsDeleting(false)
        setIsModalOpen(false)
      }
    },
    [navigate, showError]
  )

  return { isModalOpen, isDeleting, openModal, closeModal, confirmDelete }
}
