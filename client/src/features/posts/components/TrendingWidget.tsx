import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

const TRENDING = [
  { tag: 'RinaldoEats', count: '67.6k' },
  { tag: 'UAAPSeason86', count: '32k' },
  { tag: 'Enlistment', count: '12k' },
]

export const TrendingWidget = () => {
  const navigate = useNavigate()
  return (
    <Card 
      padding="none" 
      className="overflow-hidden"
    >
      <div className={cn(
        "px-4 py-3 border-b dark:border-gray-800 bg-gradient-to-r",
        "from-primary/5 to-transparent")}>
        <h3 
          className="text-sm font-bold uppercase flex items-center gap-2">
          <span 
            className="material-symbols-outlined text-[18px] text-primary">
            trending_up
          </span>
          Trending Topics
        </h3>
      </div>
      <div className="p-2">
        {TRENDING.map((item) => (
          <button 
            key={item.tag} 
            onClick={() => navigate(`/search?q=${item.tag}`)} 
            className={cn(
              "w-full flex items-center justify-between p-3",
              "rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 group"
            )}
          >
            <div className="text-left">
              <div 
                className="text-sm font-bold group-hover:text-primary"
              >
                #{item.tag}
              </div>
              <div className="text-xs text-gray-500">{item.count} posts</div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}
