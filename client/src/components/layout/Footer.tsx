import { MessagesSquare, Heart, ShieldCheck, LifeBuoy, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        "border-t mt-auto transition-colors duration-200",
        "border-border-light dark:border-border-dark",
        "bg-white dark:bg-surface-dark",
        "py-6 md:py-10 px-4 md:px-10" // Reduced vertical padding on mobile
      )}
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
        
        {/* Brand - More compact on mobile */}
        <div className="flex items-center gap-2 md:gap-3 group cursor-default">
          <div className="bg-primary/10 p-1.5 md:p-2 rounded-lg group-hover:bg-primary transition-colors duration-300">
            <MessagesSquare className="h-5 w-5 md:h-6 md:h-6 text-primary group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base md:text-lg leading-none dark:text-white">
              Animo<span className="text-primary">Forums</span>
            </span>
            <span className="text-[9px] md:text-[10px] text-gray-500 font-medium uppercase tracking-tighter">
              DLSU Community Hub
            </span>
          </div>
        </div>

        {/* Links - Horizontal row with smaller gaps on mobile */}
        <nav className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-8 text-[13px] md:text-sm font-semibold">
          <a
            href="#"
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4" /> Guidelines
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <LifeBuoy className="h-3.5 w-3.5 md:h-4 md:w-4" /> Privacy
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
          >
            <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4" /> Report
          </a>
        </nav>

        {/* Credits - Centered on mobile, right-aligned on desktop */}
        <div className="flex flex-col items-center md:items-end gap-0.5">
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 font-medium">
            Made with
            <Heart className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary fill-primary animate-pulse" />
            by the
            <span className="text-primary font-bold">AnimoForums Team</span>
          </div>
          <p className="text-[9px] md:text-[10px] text-gray-400 font-mono">
            © {currentYear} • For Lasallians, By Lasallians
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
