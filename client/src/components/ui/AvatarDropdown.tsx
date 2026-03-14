import { 
  Dropdown, 
  DropdownItem, 
  DropdownSeparator,
  Avatar 
} from '@/components/ui'

import { 
  User, 
  Camera, 
  LogOut,
  Settings,
  Moon,
  Sun
} from 'lucide-react'

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
          alt={user.name} 
          fallback={user.name.charAt(0).toUpperCase()} 
          size="sm"
          className={cn(
            "cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
          )} 
        />
      }
    >
      {/* Profile Section */}
      <div className={cn(
        "px-3 py-2 border-b border-gray-200 dark:border-gray-700"
        )}
      >
        <DropdownItem
          icon={<User className="h-4 w-4" />}
          onClick={() => navigate(`/profile/${user.username || user.name}`)}
        >
          <div>
            <div className="font-semibold">View Profile</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              u/{user.username || user.name}
            </div>
          </div>
        </DropdownItem>
      </div>

      {/* Main Actions */}
      <DropdownItem
        icon={<Camera className="h-4 w-4" />}
        onClick={() => navigate('/profile/edit')}
      >
        Edit Avatar
      </DropdownItem>

      <DropdownItem
        icon={isDark 
          ? <Sun className="h-4 w-4" /> 
          : <Moon className="h-4 w-4" />
        }
        onClick={toggleDarkMode}
      >
        Display Mode
      </DropdownItem>

      <DropdownItem
        icon={<LogOut className="h-4 w-4" />}
        onClick={onLogout}
        destructive
      >
        Log Out
      </DropdownItem>
    </Dropdown>
  )
}
