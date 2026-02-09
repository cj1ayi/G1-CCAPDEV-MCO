import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { GraduationCap } from 'lucide-react'

export const Hero = () => (
  <section className="py-16 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="flex items-center gap-2 py-1 px-3 text-sm font-semibold text-primary rounded-full bg-primary/10 w-fit">
            <GraduationCap className="h-4 w-4" />
            DE LA SALLE UNIVERSITY
          </span>
          <h1 className="text-[#101814] dark:text-white text-5xl md:text-6xl font-black leading-[1.1] tracking-[-0.03em]">
            Where{' '}
            <span className="text-primary relative inline-block">
              Lasallians
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
              </svg>
            </span>
            <br />
            Connect.
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl">
            The official community hub for academic support, student life, and everything in between. 
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/signup"><Button size="lg">Sign Up with DLSU Email</Button></Link>
            <Link to="/explore"><Button variant="secondary" size="lg">Explore Guest Access</Button></Link>
          </div>
          <p className="text-sm text-gray-500">*Exclusive to students and faculty with @dlsu.edu.ph email.</p>
        </motion.div>
        <motion.div 
          className="hidden md:block"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96 flex items-center justify-center">
            <span className="text-gray-500">Image cards go here</span>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)
