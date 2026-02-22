import { useMemo } from 'react'

type StrengthLevel =
  | 'weak'
  | 'fair'
  | 'good'
  | 'strong'
  | 'very-strong'

interface PasswordStrength {
  score: number
  level: StrengthLevel
  label: string
  color: string
  percentage: number
  feedback: string[]
}

interface PasswordRule {
  test: (password: string) => boolean
  points: number
  feedback: string
}

const PASSWORD_RULES: PasswordRule[] = [
  {
    test: (pwd) => pwd.length >= 8,
    points: 10,
    feedback: 'Use at least 8 characters',
  },
  {
    test: (pwd) => /[a-z]/.test(pwd),
    points: 5,
    feedback: 'Add a lowercase letter',
  },
  {
    test: (pwd) => /[A-Z]/.test(pwd),
    points: 5,
    feedback: 'Add an uppercase letter',
  },
  {
    test: (pwd) => /\d/.test(pwd),
    points: 5,
    feedback: 'Add a number',
  },
  {
    test: (pwd) =>
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    points: 10,
    feedback: 'Add a special character (!@#$%...)',
  },
  {
    test: (pwd) => new Set(pwd).size >= 5,
    points: 5,
    feedback: 'Use more unique characters',
  },
]

interface StrengthLevelConfig {
  threshold: number
  level: StrengthLevel
  label: string
  color: string
  percentage: number
}

const STRENGTH_LEVELS: StrengthLevelConfig[] = [
  {
    threshold: 0,
    level: 'weak',
    label: 'Weak',
    color: '#EF4444',
    percentage: 25,
  },
  {
    threshold: 30,
    level: 'fair',
    label: 'Fair',
    color: '#F59E0B',
    percentage: 50,
  },
  {
    threshold: 50,
    level: 'good',
    label: 'Good',
    color: '#EAB308',
    percentage: 75,
  },
  {
    threshold: 70,
    level: 'strong',
    label: 'Strong',
    color: '#10B981',
    percentage: 90,
  },
  {
    threshold: 90,
    level: 'very-strong',
    label: 'Very Strong',
    color: '#059669',
    percentage: 100,
  },
]

/**
 * Hook to calculate password strength with real-time feedback.
 *
 * Features:
 * - Evaluates password against multiple security rules
 * - Assigns points based on rule compliance
 * - Provides constructive feedback for failing rules
 * - Categorizes strength into 5 levels with colors
 * - Memoizes calculations for performance
 *
 * @example
 * const { score, level, label, color, feedback } =
 *   usePasswordStrength(password)
 *
 * return (
 *   <>
 *     <div style={{ color }}>
 *       {label} ({score}/100)
 *     </div>
 *     {feedback.map((msg) => (
 *       <p key={msg}>{msg}</p>
 *     ))}
 *   </>
 * )
 */
export const usePasswordStrength = (
  password: string,
): PasswordStrength => {
  const strength = useMemo(() => {
    let baseScore = 0
    let rulesEnforced = 0
    const feedback: string[] = []

    for (const rule of PASSWORD_RULES) {
      if (rule.test(password)) {
        baseScore += rule.points
        rulesEnforced++
      } else {
        feedback.push(rule.feedback)
      }
    }

    const finalScore = baseScore + rulesEnforced * 10

    const strengthLevel =
      [...STRENGTH_LEVELS]
        .reverse()
        .find((level) => finalScore >= level.threshold) ||
      STRENGTH_LEVELS[0]

    return {
      score: finalScore,
      level: strengthLevel.level,
      label: strengthLevel.label,
      color: strengthLevel.color,
      percentage: strengthLevel.percentage,
      feedback:
        feedback.length > 0 ? feedback : ['Great password'],
    }
  }, [password])

  return strength
}
