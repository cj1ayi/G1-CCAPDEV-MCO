import { motion } from "framer-motion";
import { MessageSquare, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Post, HeroPostCardProps } from "../types";

export const HeroPostCard = ({ post, thumbnail }: HeroPostCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={cn(
        "relative rounded-2xl overflow-hidden shadow-2xl",
        "aspect-[4/3] w-full max-w-[500px] mx-auto",
        "group cursor-default"
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={thumbnail}
          alt={post.title}
          className="w-full h-full object-cover transition-transform 
            duration-700 group-hover:scale-105"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t",
            "from-black/90 via-black/40 to-transparent"
          )}
        />
      </div>

      {/* Content Layer */}
      <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
        <div>
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-full text-xs",
              "font-bold text-white uppercase bg-primary"
            )}
          >
            r/{post.space}
          </span>
        </div>

        <div className="space-y-3">
          <h3
            className={cn(
              "text-white font-bold text-2xl md:text-3xl",
              "leading-tight"
            )}
          >
            {post.title}
          </h3>

          <div className="flex items-center gap-6 text-white/90 font-medium">
            <span className="flex items-center gap-2">
              <ArrowBigUp className="h-6 w-6 fill-white" />
              {post.upvotes}
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {post.commentCount} comments
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
