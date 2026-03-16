import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  Avatar,
} from '@/components/ui'

import {
  MoreHorizontal,
  Settings,
  LogOut,
  Edit,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

export const ProfileHeader = ({
  user,
  isOwnProfile = false,
  onLogout,
}: {
  user: any
  isOwnProfile?: boolean
  onLogout?: () => void
}) => {
  const navigate = useNavigate()

  return (
    <section>
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Left: Avatar + name */}
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                src={user.avatar}
                name={user.name}
                size="2xl"
                className="shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {user.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  u/{user.username}
                </p>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {isOwnProfile ? (
                <>
                  <Button
                    leftIcon={<Edit className="h-4 w-4" />}
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate('/profile/edit')}
                  >
                    Edit Profile
                  </Button>
                  <Dropdown
                    align="right"
                    trigger={
                      <Button size="sm" variant="ghost" className="!px-2">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    }
                  >
                    <DropdownLabel>Account</DropdownLabel>
                    <DropdownItem
                      icon={<Settings className="h-4 w-4" />}
                      onClick={() => navigate('/profile/edit')}
                    >
                      Settings
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem
                      icon={<LogOut className="h-4 w-4" />}
                      destructive
                      onClick={onLogout}
                    >
                      Log Out
                    </DropdownItem>
                  </Dropdown>
                </>
              ) : null }
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
