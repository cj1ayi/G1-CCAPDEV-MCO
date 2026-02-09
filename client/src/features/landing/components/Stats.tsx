import { motion } from 'framer-motion'
import CountUp from 'react-countup'

export const Stats = () => {
  return (
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
            <div>
              <span className="flex flex-col items-center gap-3 py-2 px-2">
                <span className="material-symbols-outlined text-primary text-4xl">architecture</span>
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                  <CountUp end={6700} duration={2} separator="," suffix="+" />
                </p>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Lasallians</p>
              </span>
            </div>
            <div>
              <span className="flex flex-col items-center gap-3 py-2 px-2">
                <span className="material-symbols-outlined text-primary text-4xl">forum</span>
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                  <CountUp end={67000} duration={2} separator="," suffix="+" />
                </p>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Discussions</p>
              </span>
            </div>
            <div>
              <span className="flex flex-col items-center gap-3 py-2 px-2">
                <span className="material-symbols-outlined text-primary text-4xl">rocket_launch</span>
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                  <CountUp end={67} duration={2} separator="," suffix="+" />
                </p>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Active Spaces</p>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
