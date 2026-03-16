import { cn } from '@/lib/utils'

const UPVOTE_ACTIVE = 'text-[#FF6B35]'
const UPVOTE_HOVER = 'hover:text-[#FF6B35]'
const DOWNVOTE_ACTIVE = 'text-[#4A90E2]'
const DOWNVOTE_HOVER = 'hover:text-[#4A90E2]'
const FILL = { fontVariationSettings: "'FILL' 1" }

const VARIANTS = {
  /** Post card — compact vertical column. */
  card: {
    layout: cn(
      'w-12 bg-gray-50 dark:bg-surface-darker',
      'flex flex-col items-center',
      'py-3 gap-1',
      'border-r border-gray-100',
      'dark:border-gray-800 shrink-0',
    ),
    iconSize: 'text-[20px]',
    btnPad: 'p-1',
    hoverBg:
      'hover:bg-gray-200 dark:hover:bg-gray-700',
    scoreSize: 'text-sm font-bold',
    neutralScore:
      'text-gray-900 dark:text-gray-100',
    stopPropagation: true,
  },
  /** Post detail — larger vertical sidebar. */
  detail: {
    layout: cn(
      'hidden sm:flex flex-col items-center',
      'bg-gray-50 dark:bg-surface-darker',
      'rounded-l-xl px-3 py-6 gap-2',
      'border-r border-gray-100',
      'dark:border-gray-800',
    ),
    iconSize: 'text-[24px]',
    btnPad: 'p-2',
    hoverBg:
      'hover:bg-gray-200 dark:hover:bg-gray-700',
    scoreSize: 'text-base font-bold',
    neutralScore:
      'text-gray-900 dark:text-gray-100',
    stopPropagation: false,
  },
  /** Comment — inline horizontal. */
  comment: {
    layout: 'flex items-center gap-2',
    iconSize: 'text-[18px]',
    btnPad: 'p-1',
    hoverBg:
      'hover:bg-gray-100 dark:hover:bg-gray-800',
    scoreSize: cn(
      'text-xs font-bold',
      'min-w-[24px] text-center',
    ),
    neutralScore:
      'text-gray-700 dark:text-gray-300',
    stopPropagation: true,
  },
  /** Mobile post detail — compact horizontal. */
  mobile: {
    layout: cn(
      'flex items-center gap-1',
      'bg-gray-100 dark:bg-gray-800',
      'rounded-lg p-1',
    ),
    iconSize: 'text-[20px]',
    btnPad: 'p-1',
    hoverBg: '',
    scoreSize: 'font-bold text-sm mx-1',
    neutralScore: '',
    stopPropagation: false,
  },
} as const

type VoteVariant = keyof typeof VARIANTS

export interface VoteButtonsProps {
  score: number
  isUpvoted?: boolean
  isDownvoted?: boolean
  onUpvote?: () => void
  onDownvote?: () => void
  variant?: VoteVariant
  className?: string
}

function buildBtnClass(
  isActive: boolean,
  activeColor: string,
  hoverColor: string,
  pad: string,
  hoverBg: string,
) {
  const base = cn(pad, 'rounded transition-colors')

  if (isActive) return cn(base, activeColor, hoverBg)

  return cn(base, 'text-gray-400', hoverColor, hoverBg)
}

function buildScoreClass(
  isUpvoted: boolean,
  isDownvoted: boolean,
  scoreSize: string,
  neutralScore: string,
) {
  if (isUpvoted) return cn(scoreSize, UPVOTE_ACTIVE)
  if (isDownvoted) return cn(scoreSize, DOWNVOTE_ACTIVE)

  return cn(scoreSize, neutralScore)
}

export const VoteButtons = ({
  score,
  isUpvoted = false,
  isDownvoted = false,
  onUpvote,
  onDownvote,
  variant = 'card',
  className,
}: VoteButtonsProps) => {
  const v = VARIANTS[variant]

  const handleClick = (
    e: React.MouseEvent,
    handler?: () => void,
  ) => {
    if (v.stopPropagation) e.stopPropagation()
    handler?.()
  }

  const upClass = buildBtnClass(
    isUpvoted,
    UPVOTE_ACTIVE,
    UPVOTE_HOVER,
    v.btnPad,
    v.hoverBg,
  )

  const downClass = buildBtnClass(
    isDownvoted,
    DOWNVOTE_ACTIVE,
    DOWNVOTE_HOVER,
    v.btnPad,
    v.hoverBg,
  )

  const scoreClass = buildScoreClass(
    isUpvoted,
    isDownvoted,
    v.scoreSize,
    v.neutralScore,
  )

  return (
    <div className={cn(v.layout, className)}>
      <button
        onClick={(e) => handleClick(e, onUpvote)}
        className={upClass}
        aria-label="Upvote"
      >
        <span
          className={cn(
            'material-symbols-outlined',
            v.iconSize,
          )}
          style={isUpvoted ? FILL : undefined}
        >
          shift
        </span>
      </button>

      <span className={scoreClass}>{score}</span>

      <button
        onClick={(e) => handleClick(e, onDownvote)}
        className={downClass}
        aria-label="Downvote"
      >
        <span
          className={cn(
            'material-symbols-outlined',
            v.iconSize,
            'rotate-180',
          )}
          style={isDownvoted ? FILL : undefined}
        >
          shift
        </span>
      </button>
    </div>
  )
}
