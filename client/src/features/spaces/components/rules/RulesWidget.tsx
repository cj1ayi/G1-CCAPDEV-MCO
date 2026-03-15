import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import { SpaceRule } from '../../services'

const GENERAL_RULES: SpaceRule[] = [
  { title: 'Be Respectful.', description: 'Keep discussions civil. Harassment is not tolerated.' },
  { title: 'No Spam.', description: 'Avoid repetitive posts or self-promotion.' },
  { title: 'Cite Sources.', description: 'When sharing news, link to a credible source.' },
]

interface RulesWidgetProps {
  rules?: SpaceRule[]
}

export const RulesWidget = ({ rules }: RulesWidgetProps) => {
  const [showAll, setShowAll] = useState(false)

  const displayRules = rules && rules.length > 0 ? rules : GENERAL_RULES
  const visibleRules = showAll ? displayRules : displayRules.slice(0, 3)

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-4 py-3 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-sm font-bold uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-gray-400">gavel</span>
          Community Rules
        </h3>
      </div>
      <div className="p-4">
        <ol className="list-decimal list-inside space-y-3 text-sm">
          {visibleRules.map((rule, i) => (
            <li key={i} className="pl-2 border-b dark:border-gray-800 pb-2 last:border-0">
              <span className="font-semibold">{rule.title}</span>
              {rule.description && (
                <p className="text-xs text-gray-500 ml-4 mt-1">{rule.description}</p>
              )}
            </li>
          ))}
        </ol>
        {displayRules.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => setShowAll(!showAll)}
            className="text-primary mt-3"
          >
            {showAll ? 'Show Less' : 'View All Rules'}
          </Button>
        )}
      </div>
    </Card>
  )
}
