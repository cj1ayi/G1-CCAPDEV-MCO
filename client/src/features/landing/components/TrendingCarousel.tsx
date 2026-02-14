import { 
  useTrendingPosts,
  useThumbnails
} from '../hooks'

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { TrendingUp } from 'lucide-react'
import { CarouselCard } from './CarouselCard'
import { cn } from '@/lib/utils'

export const TrendingCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false })
  ])

  const { posts, handlePostClick, getCategoryColor } = useTrendingPosts(5)
  const thumbnails = useThumbnails(posts)

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div>
            <span className={cn(
              "flex items-center gap-2 text-primary font-semibold mb-2")}>
              <TrendingUp className="h-4 w-4" />
              TRENDING
            </span>
            <h2 className={cn(
              "text-2xl md:text-3xl font-bold text-gray-900 dark:text-white")}
            >
              Top Discussions
            </h2>
          </div>
          
          <Link 
            to="/explore" 
            className={cn(
              "text-primary hover:underline hidden sm:block font-semibold")}
          >
            View all discussions →
          </Link>
        </motion.div>
        
        {/* Carousel Container */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                className={cn(
                  "flex-[0_0_100%] md:flex-[0_0_50%]",
                  "lg:flex-[0_0_33.33%] p-2")}
              >
                <CarouselCard
                  post={post}
                  index={index}
                  thumbnail={thumbnails[String(post.id)]}
                  getCategoryColor={getCategoryColor}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
