import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface SidebarProps {
  variant?: 'home' | 'space' | 'profile'
  className?: string
  spaceInfo?: {
    id: string
    name: string
    displayName: string
    memberCount: number
    onlineCount: number
    description: string
    rules?: string[]
  }
}

interface SpaceItem {
  id: string
  name: string
  icon: string
  color: string
}
