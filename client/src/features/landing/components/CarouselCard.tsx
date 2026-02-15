import { 
  MessageSquare, 
  ArrowBigUp 
} from 'lucide-react'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CarouselCardProps } from '../types'

export const CarouselCard = ({ 
  post, 
  index, 
  thumbnail, 
  getCategoryColor 
}: CarouselCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "relative rounded-xl overflow-hidden h-64 cursor-pointer",
        "group transition-transform hover:scale-[1.02]"
      )}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={thumbnail ?? ''} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay gradient - stronger at bottom */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/95",
          "via-black/60 to-black/30")} 
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-5">
        {/* Category Badge */}
        <div>
          <span className={cn(
            "inline-block px-3 py-1.5 rounded-full text-xs",
            "font-bold text-white uppercase tracking-wide",
            getCategoryColor(post.space)
          )}>
            r/{post.space}
          </span>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Title */}
          <h3 className={cn(
            "text-white font-bold text-xl mb-2",
            "line-clamp-2 leading-tight")}
          >
            {post.title}
          </h3>

          {/* Content Preview */}
          {post.content && (
            <p className="text-white/80 text-sm mb-3 line-clamp-1">
              {post.content}
            </p>
          )}

          {/* Stats */}
          <div className={cn(
            "flex items-center gap-4 text-white text-sm font-medium")}>
            <span className="flex items-center gap-1.5">
              <ArrowBigUp className="h-5 w-5 fill-white" />
              {post.upvotes}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              {post.commentCount} {post.commentCount === 1 ? 
                'comment' : 'comments'}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={cn(
        "absolute inset-0 bg-primary/0 group-hover:bg-primary/10",
        "transition-colors")} />
    </motion.div>
  )
}
