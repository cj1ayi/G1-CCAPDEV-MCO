import { Button } from '@/components/ui/Button'

import { cn } from '@/lib/utils'
import { motion } from "framer-motion";
import { Camera, UserPlus, Mail, MoreHorizontal, User, Settings, LogOut } 
from 'lucide-react'

export const ProfileNavbar = () => {
  return (
		<section>
			<div className="relative w-screen left-1/2 -ml-[50vw] bg-white dark:bg-gray-800
				z-0">
  <div
    className="flex items-center justify-center gap-8 border-b border-border-light dark:border-border-dark
               overflow-x-auto no-scrollbar px-4 md:px-10 py-4"
  >
    <a className="pb-3 border-b-2 border-primary text-primary font-semibold text-sm whitespace-nowrap px-1" href="#">
      Overview
    </a>

    <a className="pb-3 border-b-2 border-transparent hover:text-[#101814] dark:hover:text-gray-200 font-medium text-sm whitespace-nowrap px-1 transition-colors" href="#">
      Posts
    </a>

    <a className="pb-3 border-b-2 border-transparent hover:text-[#101814] dark:hover:text-gray-200 font-medium text-sm whitespace-nowrap px-1 transition-colors" href="#">
      Comments
    </a>

    <a className="pb-3 border-b-2 border-transparent hover:text-[#101814] dark:hover:text-gray-200 font-medium text-sm whitespace-nowrap px-1 transition-colors" href="#">
      Spaces
    </a>

    <a className="pb-3 border-b-2 border-transparent hover:text-[#101814] dark:hover:text-gray-200 font-medium text-sm whitespace-nowrap px-1 transition-colors" href="#">
      Upvoted
    </a>
  </div>
</div>

			{/*
			<div className="flex items-center gap-8 border-b border-border-light 
				dark:border-border-dark overflow-x-auto no-scrollbar mt-3"
			>
				<a className="
					pb-3 border-b-2 border-primary text-primary 
					font-semibold text-sm whitespace-nowrap px-1" href="#"
				>
					Overview
				</a>
				<a className="pb-3 border-b-2 border-transparent 
					hover:text-[#101814] dark:hover:text-gray-200 font-medium text-sm 
					whitespace-nowrap px-1 transition-colors" href="#"
				>
					Posts
				</a>
				<a className="pb-3 border-b-2 border-transparent 
					hover:text-[#101814] dark:hover:text-gray-200 font-medium text-sm 
					whitespace-nowrap px-1 transition-colors" href="#"
				>
					Comments
				</a>
				<a className="pb-3 border-b-2 border-transparent 
					hover:text-[#101814] dark:hover:text-gray-200 font-medium text-sm 
					whitespace-nowrap px-1 transition-colors" href="#"
				>
					Spaces
				</a>
				<a className="pb-3 border-b-2 border-transparent 
					hover:text-[#101814] dark:hover:text-gray-200 font-medium text-sm 
					whitespace-nowrap px-1 transition-colors" href="#"
				>
					Upvoted
				</a>
			</div>
*/}
		</section>
  );
};
