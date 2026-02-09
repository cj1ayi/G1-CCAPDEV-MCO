import { cn } from '@/lib/utils'
import { motion } from "framer-motion";

export const ProfileAvatar = () => {
  return (
  /* HERO SECTION */
	<section>
		{/* FULL BLEED */}
		<div className="-mt-6 relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
			{/* COVER IMAGE BG - Images placeholder */}
			<div className="bg-gray-200 dark:bg-gray-700 h-60 flex items-center justify-center">
				<motion.div
					className="hidden md:block"
					initial={{ opacity: 0, y: -30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					viewport={{ once: true }}
				>
					{/* TODO: add profile background code here */}
					<span className="text-gray-500">Image background go here</span>
				</motion.div>
			</div>

			{/* ISSUES WITH OVERFLOW & DISAPPEARING (i crode) */}
			{/* PROFILE IMAGE */}
			<div className="relative">
				<div className="absolute left-4 md:left-24 -bottom-24">
					<motion.div
						className="hidden md:block"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
					>
						{/* TODO: add profile image code here */}
						<img
							src='/avatar.png'
							alt="profile"
							className="w-40 h-40 bg-gray-200 rounded-full border-4 border-white object-cover"
						/>
					</motion.div>
				</div>
			</div>
			</div>
		</section>
  );
};
