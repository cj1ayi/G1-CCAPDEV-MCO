import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export const TrendingCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 2300, stopOnInteraction: false })
  ])

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="flex items-center gap-2 text-primary font-semibold mb-2">
              <TrendingUp className="h-4 w-4" /> TRENDING
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Top Discussions</h2>
          </div>
          <Link to="/explore" className="text-primary hover:underline hidden sm:block">
            View all discussions →
          </Link>
        </motion.div>
        
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-[0_0_100%] md:flex-[0_0_33.33%] p-2">
                <motion.div 
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-gray-500">Card {i}</span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
