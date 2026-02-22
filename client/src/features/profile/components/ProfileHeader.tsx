import { 
  Button,
  Dropdown, 
  DropdownItem, 
  DropdownSeparator, 
  DropdownLabel
} from '@/components/ui'

import { 
  UserPlus, 
  Mail, 
  MoreHorizontal, 
  Settings, 
  LogOut, 
  Edit,
} from 'lucide-react'

import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const ProfileHeader = ({ 
  user, 
  isOwnProfile = false }: { 
    user: any; 
    isOwnProfile?: boolean 
  }) => {

  const navigate = useNavigate()

  return (
    <section>
      {/* COVER IMAGE BG */}
      <div className={cn(
        "relative bg-gray-200 dark:bg-gray-700 h-60 flex",
        "items-center justify-center -mt-4 md:-mt-6"
        )}
      >
        <span className="text-gray-500 dark:text-gray-400">Add a profile cover</span>
      </div>

      {/* BANNER */}
      <div className="bg-white dark:bg-surface-dark relative z-0 p-6 md:p-10">
        <div className={cn(
          "max-w-7xl mx-auto h-full flex flex-col md:flex-row",
          "items-start md:items-center justify-between gap-4"
          )}
        >
          {/* LEFT: IMAGE + TEXT */}
          <div className="flex items-center gap-6 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className={cn(
                  "w-28 h-28 md:w-36 md:h-36 bg-gray-200 dark:bg-gray-700 object-cover",
                  "rounded-full border-4 border-white dark:border-gray-800 shadow-lg",
                  "-mt-14 md:-mt-16"
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="pt-1"
            >
              <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
                {user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">@{user.username}</p>
            </motion.div>
          </div>

          {/* RIGHT: BUTTONS */}
          <div className="flex gap-3 md:mt-0">
            {isOwnProfile ? (
              <>
                {/* OWN PROFILE: Edit button + Settings menu */}
                <Button 
                  leftIcon={<Edit className="h-4 w-4" />} 
                  size="md"
                  onClick={() => navigate('/profile/edit')}
                >
                  Edit Profile
                </Button>
                <Dropdown
                  align="right"
                  trigger={
                    <Button size="md" variant="ghost">
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
                  >
                    Log Out
                  </DropdownItem>
                </Dropdown>
              </>
            ) : (
              <>
                {/* OTHER USER'S PROFILE: Follow + Message buttons only, NO menu */}
                <Button leftIcon={<UserPlus className="h-4 w-4" />} size="md">
                  Follow
                </Button>
                <Button 
                  leftIcon={<Mail className="h-4 w-4" />} 
                  size="md" 
                  variant="secondary"
                >
                  Message
                </Button>
             </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
