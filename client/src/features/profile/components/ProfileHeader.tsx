import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  Avatar,
} from '@/components/ui'

import {
  UserPlus,
  Mail,
  MoreHorizontal,
  Settings,
  LogOut,
  Edit,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                src={user.avatar}
                name={user.name}
                size="2xl"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  u/{user.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
              ) : (
                <>
                  <Button leftIcon={<UserPlus className="h-4 w-4" />} size="sm">
                    Follow
                  </Button>
                  <Button
                    leftIcon={<Mail className="h-4 w-4" />}
                    size="sm"
                    variant="secondary"
                  >
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
