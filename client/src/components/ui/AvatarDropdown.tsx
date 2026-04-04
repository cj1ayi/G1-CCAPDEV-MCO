import { 
  Dropdown, 
  DropdownItem,
  Avatar 
} from '@/components/ui'

import { 
  Camera, 
  LogOut,
  Info
} from 'lucide-react'

import { DarkModeToggle } from '@/components/ui/DarkModeToggle'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface AvatarDropdownProps {
  user: {
    name: string
    username?: string
    avatarUrl?: string
  }
  onLogout?: () => void
}

export const AvatarDropdown = ({ 
  user, 
  onLogout 
}: AvatarDropdownProps) => {
  const navigate = useNavigate()
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <Dropdown
      align="right"
      trigger={
        <Avatar 
          src={user.avatarUrl}
          name={user.name}
          alt={user.name}
          size="sm"
          className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
        />
      }
    >
      {/* Profile section — avatar + name/username */}
      <div
        className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        onClick={() => navigate(`/profile/${user.username || user.name}`)}
      >
        <div className="flex items-center gap-3">
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            alt={user.name}
            size="md"
          />
          <div>
            <div className="font-semibold text-sm text-gray-900 dark:text-white">
              View Profile
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              u/{user.username || user.name}
            </div>
          </div>
        </div>
      </div>

      <DropdownItem
        icon={<Info className="h-4 w-4" />}
        onClick={() => navigate('/about')}
      >
        About Us
      </DropdownItem>


      {/* Actions */}
      <DropdownItem
        icon={<Camera className="h-4 w-4" />}
        onClick={() => navigate('/profile/edit')}
      >
        Edit Avatar
      </DropdownItem>

      {/* Theme toggle */}
      <div
        className="px-4 py-2 border-t border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
      </div>

      {/* Destructive — always last */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <DropdownItem
          icon={<LogOut className="h-4 w-4" />}
          onClick={onLogout}
          destructive
        >
          Log Out
        </DropdownItem>
      </div>
    </Dropdown>
  )
}
