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
    createdDate?: string
  }
}

interface TrendingHashtag {
  tag: string
  postCount: string
}

interface Rule {
  title: string
  description?: string
}

// Mock trending hashtags
const TRENDING_HASHTAGS: TrendingHashtag[] = [
  { tag: 'RinaldoEats', postCount: '67.6k' },
  { tag: 'UAAPSeason86', postCount: '32k' },
  { tag: 'Enlistment', postCount: '12k' },
  { tag: 'Finals', postCount: '8.5k' },
]

// General community rules for home variant
const GENERAL_RULES: Rule[] = [
  {
    title: 'Be Respectful.',
    description: 'Keep discussions civil. Harassment is not tolerated.'
  },
  {
    title: 'No Spam.',
    description: 'Avoid repetitive posts or self-promotion.'
  },
  {
    title: 'Cite Sources.',
    description: 'When sharing news, link to a credible source.'
  }
]

const TrendingSection = () => {
  const navigate = useNavigate()

  return (
    <Card padding="none" className="overflow-hidden">
      <div
        className={cn(
          'px-4 py-3 border-b border-gray-200 dark:border-gray-800',
          'bg-gradient-to-r from-primary/5 to-transparent'
        )}
      >
        <h3
          className={cn(
            'text-sm font-bold uppercase tracking-wider',
            'text-gray-900 dark:text-white',
            'flex items-center gap-2'
          )}
        >
          <span
            className="material-symbols-outlined text-[18px] text-primary"
          >
            trending_up
          </span>
          Trending Topics
        </h3>
      </div>

      <div className="p-2">
        {TRENDING_HASHTAGS.map((item, index) => (
          <button
            key={item.tag}
            onClick={() => navigate(`/search?q=${item.tag}`)}
            className={cn(
              'w-full flex items-center justify-between',
              'p-3 rounded-md transition-colors group',
              'hover:bg-gray-50 dark:hover:bg-gray-800'
            )}
            aria-label={`Search for ${item.tag}, ${item.postCount} posts`}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'text-xs font-bold',
                  'text-gray-500 dark:text-gray-400'
                )}
              >
                {index + 1}
              </span>
              <div className="text-left">
                <div
                  className={cn(
                    'text-sm font-bold transition-colors',
                    'text-gray-900 dark:text-white',
                    'group-hover:text-primary'
                  )}
                >
                  #{item.tag}
                </div>
                <div
                  className={cn(
                    'text-xs text-gray-500 dark:text-gray-400'
                  )}
                >
                  {item.postCount} posts
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div
        className={cn(
          'px-4 py-3 border-t',
          'border-gray-200 dark:border-gray-800'
        )}
      >
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
  )
}

interface SpaceInfoSectionProps {
  spaceInfo: NonNullable<RightSidebarProps['spaceInfo']>
}

const SpaceInfoSection = ({ spaceInfo }: SpaceInfoSectionProps) => {
  return (
    <Card padding="none" className="overflow-hidden">
      <div
        className={cn(
          'px-4 py-3 border-b border-gray-200 dark:border-gray-800',
          'bg-gradient-to-r from-primary/5 to-transparent'
        )}
      >
        <h3
          className={cn(
            'text-sm font-bold uppercase tracking-wider',
            'text-gray-900 dark:text-white'
          )}
        >
          About Space
        </h3>
      </div>

      <div className="p-4 space-y-4">
        <p
          className={cn(
            'text-sm leading-relaxed',
            'text-gray-600 dark:text-gray-300'
          )}
        >
          {spaceInfo.description}
        </p>

        <div
          className={cn(
            'flex items-center gap-3 text-sm',
            'text-gray-600 dark:text-gray-300'
          )}
        >
          <span className="material-symbols-outlined text-[18px]">
            calendar_month
          </span>
          <span>
            Created {spaceInfo.createdDate || 'Oct 24, 2016'}
          </span>
        </div>

        <div
          className={cn(
            'flex items-center gap-3 text-sm',
            'text-gray-600 dark:text-gray-300'
          )}
        >
          <span className="material-symbols-outlined text-[18px]">
            public
          </span>
          <span>Public Space</span>
        </div>

        <div
          className={cn(
            'border-t border-gray-200 dark:border-gray-800 pt-4'
          )}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div
                className={cn(
                  'text-lg font-bold',
                  'text-gray-900 dark:text-white'
                )}
              >
                {spaceInfo.memberCount.toLocaleString()}
              </div>
              <div
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Archers
              </div>
            </div>
            <div>
              <div
                className={cn(
                  'text-lg font-bold flex items-center gap-1',
                  'text-gray-900 dark:text-white'
                )}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full bg-green-500 animate-pulse'
                  )}
                  aria-label="Online"
                />
                {spaceInfo.onlineCount}
              </div>
              <div
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Online
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => alert('Join')}
          fullWidth
        >
          Join Space
        </Button>
      </div>
    </Card>
  )
}

interface RulesSectionProps {
  rules?: string[]
  variant: 'home' | 'space'
}

const RulesSection = ({ rules, variant }: RulesSectionProps) => {
  const [showAllRules, setShowAllRules] = useState(false)

  const displayRules: Rule[] = 
    variant === 'home' 
      ? GENERAL_RULES 
      : rules?.map(rule => ({ title: rule })) || []

  const visibleRules = 
    showAllRules 
      ? displayRules 
      : displayRules.slice(0, 3)

  return (
    <Card padding="none" className="overflow-hidden">
      <div
        className={cn(
          'px-4 py-3 border-b border-gray-200 dark:border-gray-800',
          'bg-gray-50 dark:bg-gray-800/50'
        )}
      >
        <h3
          className={cn(
            'text-sm font-bold uppercase tracking-wider',
            'text-gray-900 dark:text-white',
            'flex items-center gap-2'
          )}
        >
          <span
            className={cn(
              'material-symbols-outlined text-[16px] text-gray-400'
            )}
          >
            gavel
          </span>
          Community Rules
        </h3>
      </div>

      <div className="p-4">
        <ol
          className={cn(
            'list-decimal list-inside space-y-3 text-sm',
            'text-gray-700 dark:text-gray-300'
          )}
        >
          {visibleRules.map((rule, index) => (
            <li
              key={index}
              className={cn(
                'pl-2 border-b border-gray-50 dark:border-gray-800',
                'pb-2 last:border-0 last:pb-0'
              )}
            >
              <span className="font-semibold">{rule.title}</span>
              {rule.description && (
                <>
                  <br />
                  <span className="text-xs text-gray-500">
                    {rule.description}
                  </span>
                </>
              )}
            </li>
          ))}
        </ol>

        {displayRules.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllRules(!showAllRules)}
            fullWidth
            className={cn(
              'text-primary hover:bg-transparent hover:underline mt-3'
            )}
            aria-expanded={showAllRules}
          >
            {showAllRules ? 'Show Less' : 'View all rules'}
          </Button>
        )}
      </div>
    </Card>
  )
}

export const RightSidebar = ({
  variant = 'home',
  className,
  spaceInfo
}: RightSidebarProps) => {
  if (variant === 'minimal') {
    return null
  }

  return (
    <aside
      className={cn(
        'w-80 flex-shrink-0 space-y-4 sticky top-20 h-fit',
        'hidden xl:block',
        className
      )}
      aria-label="Sidebar"
    >
      {variant === 'home' && <TrendingSection />}

      {variant === 'space' && spaceInfo && (
        <>
          <SpaceInfoSection spaceInfo={spaceInfo} />
          <RulesSection rules={spaceInfo.rules} variant="space" />
        </>
      )}

      {variant === 'home' && <RulesSection variant="home" />}
    </aside>
  )
}

export default RightSidebar
