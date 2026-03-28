import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProfileTab } from '../types'
import {
  useProfileQuery,
} from './useProfileQuery'

export const useProfileView = () => {
  const { username } = useParams<{
    username: string
  }>()

  const [activeTab, setActiveTab] =
    useState<ProfileTab>('Overview')

  const {
    user,
    posts,
    comments,
    spaces,
    upvotedPosts,
    isLoading,
  } = useProfileQuery(username)

  return {
    user,
    posts,
    comments,
    spaces,
    upvotedPosts,
    isLoading,
    activeTab,
    setActiveTab,
  }
}
