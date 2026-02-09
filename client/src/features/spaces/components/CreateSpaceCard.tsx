import { Card } from '@/components/ui'
import { Plus } from 'lucide-react'

export const CreateSpaceCard = () => (
  <Card className="flex flex-col items-center justify-center bg-transparent border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300 h-full cursor-pointer min-h-[200px]">
    <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors mb-4">
      <Plus className="size-8" />
    </div>
    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Create a Space</h3>
    <p className="text-gray-500 text-sm text-center">Start a new community for your interests.</p>
  </Card>
)
