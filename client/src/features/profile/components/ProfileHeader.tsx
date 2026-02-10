import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem, DropdownSeparator, 
    DropdownLabel } from '@/components/ui/Dropdown'

import { cn } from '@/lib/utils'
import { motion } from "framer-motion";
import { Camera, UserPlus, Mail, MoreHorizontal, User, Settings, LogOut } 
from 'lucide-react'
import defaultUser from '@/assets/default.png' 

export const ProfileHeader = ({ user }: { user: any }) => {
  return (
		<section>
			{/* FULL BLEED */}
			<div className="z-10 -mt-6 relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
				{/* COVER IMAGE BG - Images placeholder */}
				<div className="relative bg-gray-200 dark:bg-gray-700 h-60 flex items-center justify-center">
					{/* TODO: add profile background code here */}
					<span className="text-gray-500">Add a profile cover</span>
					{/* TODO: add bg image edit functionality */}
					<button
						className={cn(
							'absolute',
							'bottom-4 right-4 px-3 py-1.5', 
							'text-xs font-semibold',
							'rounded-full',
							'bg-black/60 text-white', 
							'backdrop-blur',
							'hover:bg-black/80', 
							'transition',
							'flex items-center gap-2'
						)}
					>
						<Camera className="w-4 h-4"  />
						Edit Cover
					</button>
				</div>

				{/* BANNER */}
				<div className="bg-white h-58 md:h-32 dark:bg-gray-700 relative z-0 p-10">
					<div className="max-w-7xl mx-auto h-full flex flex-col 
						md:flex-row items-start md:items-center justify-between">
						{/* RIGHT IMAGE */}
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
									className=" w-36 h-36 sm:28 sm:28 
										bg-gray-200 object-cover rounded-full 
										border-4 border-white object-cover shadow-lg mb-10"
								/>
							</motion.div>
							
							<motion.div 
								initial={{ opacity: 0, y: -30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								viewport={{ once: true }}
							>
								{/* RIGHT TEXT */}
								<div className="pt-1">
									<h1 className="text-3xl font-bold">
										{user.name}
									</h1>
									<p className="text-[#5e8d75] mt-1">
										@{user.username}
									</p>
								</div>
							</motion.div>
						</div>

						{/* LEFT BUTTONS */}
						<div className="mt-4 md:mt-0 flex gap-3 ">
							<Button leftIcon={<UserPlus className="h-4 w-4" />} size="md">
								Follow
							</Button>
							<Button leftIcon={<Mail className="h-4 w-4" />} size="md" variant="secondary">
								Message
							</Button>
							<Dropdown 
								trigger={
									<Button size="md" variant="ghost">
										<MoreHorizontal className="h-5 w-5"/>
									</Button>
								}
							>
								{/*ngl idk what to put here so these are just temporary*/}
								<DropdownLabel>Account</DropdownLabel>
								<DropdownItem icon={<User className="h-4 w-4" />}>
									Profile
								</DropdownItem>
								<DropdownItem icon={<Settings className="h-4 w-4" />}>
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

			</div>
		</section>
  );
};
