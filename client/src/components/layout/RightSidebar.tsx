import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface RightSidebarProps {
  variant?: 'home' | 'space' | 'minimal'
  className?: string
  spaceInfo?: {
    id: string
    name: string
    displayName: string
    memberCount: number
    onlineCount: number
    description: string
    rules?: string[]
  }
}

// Mock trending hashtags
const trendingHashtags = [
  { tag: 'RinaldoEats', postCount: '67.6k' },
  { tag: 'UAAPSeason86', postCount: '32k' },
  { tag: 'Enlistment', postCount: '12k' },
  { tag: 'Finals', postCount: '8.5k' },
]

export const RightSidebar = ({ variant = 'home', className, spaceInfo }: RightSidebarProps) => {
  const navigate = useNavigate()
  const [showAllRules, setShowAllRules] = useState(false)

  if (variant === 'minimal') {
    return null
  }

  return (
    <aside
      className={cn(
        'w-80 flex-shrink-0 space-y-4 sticky top-20 h-fit',
        'hidden xl:block', // Hidden on mobile/tablet, visible on xl screensrigh
        className
      )}
    >
      {/* Trending Hashtags (Home variant) */}
      {variant === 'home' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary/5 to-transparent">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">
                trending_up
              </span>
              Trending Topics
            </h3>
          </div>

          <div className="p-2">
            {trendingHashtags.map((item, index) => (
              <button
                key={item.tag}
                onClick={() => navigate(`/search?q=${item.tag}`)}
                className="w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </span>
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      #{item.tag}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.postCount} posts
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/trending')}
              fullWidth
              className="text-primary hover:bg-transparent hover:underline"
            >
              View All
            </Button>
          </div>
        </Card>
      )}

      {/* Space Info (Space variant) */}
      {variant === 'space' && spaceInfo && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary/5 to-transparent">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              About Space
            </h3>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {spaceInfo.description}
            </p>

            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Created Oct 24, 2016</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="material-symbols-outlined text-[18px]">public</span>
              <span>Public Space</span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {spaceInfo.memberCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Archers</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    {spaceInfo.onlineCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Online</div>
                </div>
              </div>
            </div>

            <Button variant="primary" size="md" onClick={() => alert('Join')} fullWidth>
              Join Space
            </Button>
          </div>
        </Card>
      )}

      {/* Community Rules */}
      {variant === 'space' && spaceInfo?.rules && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-gray-400">gavel</span>
              Community Rules
            </h3>
          </div>

          <div className="p-4">
            <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700 dark:text-gray-300">
              {spaceInfo.rules.slice(0, showAllRules ? undefined : 3).map((rule, index) => (
                <li key={index} className="pl-2 border-b border-gray-50 dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                  <span className="font-semibold">{rule}</span>
                </li>
              ))}
            </ol>

            {spaceInfo.rules.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllRules(!showAllRules)}
                fullWidth
                className="text-primary hover:bg-transparent hover:underline mt-3"
              >
                {showAllRules ? 'Show Less' : `View all rules`}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* General Community Rules (Home variant) */}
      {variant === 'home' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-gray-400">gavel</span>
              Community Rules
            </h3>
          </div>

          <div className="p-4">
            <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="pl-2 border-b border-gray-50 dark:border-gray-800 pb-2">
                <span className="font-semibold">Be Respectful.</span>
                <br />
                <span className="text-xs text-gray-500">
                  Keep discussions civil. Harassment is not tolerated.
                </span>
              </li>
              <li className="pl-2 border-b border-gray-50 dark:border-gray-800 pb-2">
                <span className="font-semibold">No Spam.</span>
                <br />
                <span className="text-xs text-gray-500">
                  Avoid repetitive posts or self-promotion.
                </span>
              </li>
              <li className="pl-2">
                <span className="font-semibold">Cite Sources.</span>
                <br />
                <span className="text-xs text-gray-500">
                  When sharing news, link to a credible source.
                </span>
              </li>
            </ol>
          </div>
        </Card>
      )}
    </aside>
  )
}

export default RightSidebar
