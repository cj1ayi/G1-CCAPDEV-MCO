import { MessagesSquare, Heart, ShieldCheck, LifeBuoy, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Footer = () => {
  return (
    <footer className="border-t border-border-light dark:border-border-dark py-10 px-6 mt-auto bg-white dark:bg-surface-dark transition-colors">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand */}
        <div className="flex items-center gap-3 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary transition-colors duration-300">
            <MessagesSquare className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none dark:text-white">
              Animo<span className="text-primary">Forums</span>
            </span>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">
              DLSU Community Hub
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-semibold">
          <a href="#" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
            <ShieldCheck className="h-4 w-4" /> Guidelines
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
            <LifeBuoy className="h-4 w-4" /> Privacy
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
            <AlertCircle className="h-4 w-4" /> Report
          </a>
        </nav>

        {/* Credits */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 font-medium">
            Made with <Heart className="h-3.5 w-3.5 text-primary fill-primary animate-pulse" /> by the 
            <span className="text-primary font-bold">AnimoForums Team</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono">
            © {new Date().getFullYear()} • For Lasallians, By Lasallians
          </p>
        </div>
      </div>
    </footer>
  )
}
