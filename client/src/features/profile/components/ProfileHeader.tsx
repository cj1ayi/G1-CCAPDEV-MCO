import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem, 
  DropdownSeparator, DropdownLabel } from '@/components/ui/Dropdown'
import { cn } from '@/lib/utils'
import { motion } from "framer-motion"
import { Camera, UserPlus, Mail, MoreHorizontal, 
  User, Settings, LogOut } from 'lucide-react'

export const ProfileHeader = ({ user }: { user: any }) => {
  return (
    <section>
      {/* COVER IMAGE BG */}
      <div className={cn(
        "relative bg-gray-200 dark:bg-gray-700 h-60 flex",
        "items-center justify-center -mt-4 md:-mt-6"
        )}
      >
        <span className="text-gray-500">Add a profile cover</span>
        <button
          className={cn(
            'absolute bottom-4 right-4 px-3 py-1.5',
            'text-xs font-semibold rounded-full',
            'bg-black/60 text-white backdrop-blur',
            'hover:bg-black/80 transition',
            'flex items-center gap-2'
          )}
        >
          <Camera className="w-4 h-4" />
          Edit Cover
        </button>
      </div>

      {/* BANNER */}
      <div className="bg-white dark:bg-gray-700 relative z-0 p-6 md:p-10">
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
                  "w-28 h-28 md:w-36 md:h-36 bg-gray-200 object-cover",
                  "rounded-full border-4 border-white shadow-lg",
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
              <p className="text-[#5e8d75] mt-1">@{user.username}</p>
            </motion.div>
          </div>

          {/* RIGHT: BUTTONS */}
          <div className="flex gap-3 md:mt-0">
            <Button leftIcon={<UserPlus className="h-4 w-4" />} size="md">
              Follow
            </Button>
            <Button 
              leftIcon={
                <Mail className="h-4 w-4" />
              } 
              size="md" 
              variant="secondary"
            >
              Message
            </Button>
            <Dropdown
              trigger={
                <Button size="md" variant="ghost">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              }
            >
              <DropdownLabel>Account</DropdownLabel>
              <DropdownItem 
                icon={
                  <User className="h-4 w-4" />
                }
              >
                Profile
              </DropdownItem>
              <DropdownItem 
                icon={<Settings className="h-4 w-4" />}
              >
                Settings
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem 
                icon={<LogOut className="h-4 w-4" />} 
                destructive
              >
                Report
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </section>
  )
}
