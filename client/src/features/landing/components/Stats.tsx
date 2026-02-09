import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { MessagesSquare, Rocket, Users } from 'lucide-react'

export const Stats = () => (
  <section className="py-14 px-4">
    <div className="max-w-7xl mx-auto">
      <motion.div 
        className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-100 dark:border-white/5 p-6 md:p-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <Users className="text-primary h-8 w-8" />
            <p className="text-3xl font-extrabold"><CountUp end={67000} duration={2} separator="," />+</p>
            <p className="text-xs text-gray-500 uppercase">Lasallians</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MessagesSquare className="text-primary h-8 w-8" />
            <p className="text-3xl font-extrabold"><CountUp end={67000} duration={2} separator="," />+</p>
            <p className="text-xs text-gray-500 uppercase">Discussions</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Rocket className="text-primary h-8 w-8" />
            <p className="text-3xl font-extrabold"><CountUp end={67} duration={2} />+</p>
            <p className="text-xs text-gray-500 uppercase">Active Spaces</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)
