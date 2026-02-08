// Components
import { Button } from '@/components/ui'
import { HomeLayout } from '@/components/layout/HomeLayout'

// Libraries
import { Link } from 'react-router-dom'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

// Icons & UI
import { GraduationCap, BowArrow, MessagesSquare, Rocket, TrendingUp } from 'lucide-react'

const Home = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false })
  ])

  return (
    <HomeLayout>
      {/* HERO SECTION */}
      <section className="py-16 px-4">
        {/* CONTAINER */}
        <div className="max-w-7xl mx-auto">
          {/* GRID - Two Columns */}
          <div className="grid md:grid-cols-2 gap-8 items-center">

            {/* LEFT COLUMN */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="flex items-center gap-2 py-1 px-3 text-sm font-semibold 
                                        text-primary rounded-full bg-primary/10 w-fit">
                <GraduationCap className="h-4 w-4" />
                DE LA SALLE UNIVERSITY
              </span>
              <h1 className="text-[#101814] dark:text-white text-5xl md:text-6xl 
                                    font-black leading-[1.1] tracking-[-0.03em]">
                Where{' '}
                <span className="text-primary relative inline-block">
                  Lasallians
                  <svg
                    className="absolute w-full h-3 -bottom-1 left-0 text-primary/20"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 10"
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                    />
                  </svg>
                </span>
                <br />
                Connect.
              </h1>

              <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl 
                  leading-relaxed max-w-xl">
                The official community hub for academic support, 
                student life, and everything in between. 
              </p>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg">Sign Up with DLSU Email</Button>
                </Link>
                <Link to="/explore">
                  <Button variant="secondary" size="lg">Explore Guest Access</Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500">
                *Exclusive to students and faculty with @dlsu.edu.ph email.
              </p>
            </motion.div>

            {/* RIGHT COLUMN - Images placeholder */}
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* TODO: Add image cards here */}
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl 
                              h-96 flex items-center justify-center">
                <span className="text-gray-500">Image cards go here</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      {/* STATS SECTION */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Card Box */}
          <motion.div 
            className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-100 dark:border-white/5 p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Grid */}
            <div className="grid grid-cols-3 gap-8 text-center">
              
              {/* Stat 1 */}
              <div>
                <span className="flex flex-col items-center gap-3 py-2 px-2">
                <BowArrow color="#007137"/>
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                  <CountUp end={6700} duration={2} separator="," suffix="+" />
                </p>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Lasallians</p>
                </span>

              </div>
              
              {/* Stat 2 */}
              <div>
                <span className="flex flex-col items-center gap-3 py-2 px-2">
                  <MessagesSquare color="#007137"/>
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                  <CountUp end={67000} duration={2} separator="," suffix="+" />
                </p>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Discussions</p>
                </span>
              </div>
              
              {/* Stat 3 */}
              <div>
                <span className="flex flex-col items-center gap-3 py-2 px-2">
                <Rocket color="#007137" />
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
      {/* TRENDING SECTION */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
        
          {/* Header Row */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Title */}
            <div>
              <span className="flex items-center gap-2 text-primary font-semibold mb-2">
                <TrendingUp className="h-4 w-4" />
                TRENDING
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Top Discussions
              </h2>
            </div>
            
            {/* Link */}
            <Link 
              to="/explore" 
              className="text-primary hover:underline hidden sm:block"
            >
              View all discussions →
            </Link>
          </motion.div>
          
          {/* Carousel */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {/* Card 1 */}
              <div className="flex-[0_0_100%] md:flex-[0_0_33.33%] p-2">
                <motion.div 
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-gray-500">Card 1</span>
                </motion.div>
              </div>
              
              {/* Card 2 */}
              <div className="flex-[0_0_100%] md:flex-[0_0_33.33%] p-2">
                <motion.div 
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="text-gray-500">Card 2</span>
                </motion.div>
              </div>
              
              {/* Card 3 */}
              <div className="flex-[0_0_100%] md:flex-[0_0_33.33%] p-2">
                <motion.div 
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <span className="text-gray-500">Card 3</span>
                </motion.div>
              </div>
              
              {/* Card 4 */}
              <div className="flex-[0_0_100%] md:flex-[0_0_33.33%] p-2">
                <motion.div 
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <span className="text-gray-500">Card 4</span>
                </motion.div>
              </div>
              
              {/* Card 5 */}
              <div className="flex-[0_0_100%] md:flex-[0_0_33.33%] p-2">
                <motion.div 
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <span className="text-gray-500">Card 5</span>
                </motion.div>
              </div>
            </div>
          </div>
          
        </div>
      </section>
</HomeLayout>
  )
}

export default Home
