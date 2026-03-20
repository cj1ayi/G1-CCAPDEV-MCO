import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { userService } from '../services'
import { ProfileTab } from '../types'
import { useLoadingBar } from '@/hooks'
import { useToast } from '@/hooks/ToastContext'

export const useProfileView = () => {
  const { username } = useParams<{
    username: string
  }>()

  const [user, setUser] =
    useState<any>(null)
  const [posts, setPosts] =
    useState<any[]>([])
  const [comments, setComments] =
    useState<any[]>([])
  const [spaces, setSpaces] =
    useState<any[]>([])
  const [upvotedPosts, setUpvotedPosts] =
    useState<any[]>([])
  const [isLoading, setIsLoading] =
    useState(true)
  const [activeTab, setActiveTab] =
    useState<ProfileTab>('Overview')

  const { startLoading, stopLoading } =
    useLoadingBar()
  const { error: showError } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!username) {
        setIsLoading(false)
        return
      }

      startLoading()
      setIsLoading(true)

      try {
        const fetchedUser =
          await userService
            .getUserByUsername(username)

        if (!fetchedUser) {
          setUser(null)
          return
        }

        setUser(fetchedUser)

        const [
          userPosts,
          userComments,
          userSpaces,
          userUpvoted,
        ] = await Promise.all([
          userService.getUserPosts(
            fetchedUser.id,
          ),
          userService.getUserComments(
            fetchedUser.id,
          ),
          userService.getUserSpaces(
            fetchedUser.id,
          ),
          userService.getUserUpvotedPosts(
            fetchedUser.id,
          ),
        ])

        setPosts(userPosts)
        setComments(userComments)
        setSpaces(userSpaces)
        setUpvotedPosts(userUpvoted)
      } catch {
        showError(
          'Could not load this profile.',
        )
      } finally {
        setIsLoading(false)
        stopLoading()
      }
    }

    fetchData()
  }, [username]) // eslint-disable-line

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
