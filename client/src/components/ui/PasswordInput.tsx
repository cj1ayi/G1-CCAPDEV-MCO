import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePasswordStrength } from '@/hooks/usePasswordStrength'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showStrength?: boolean
}

export const PasswordInput = ({
  value,
  onChange,
  placeholder = 'Min. 8 characters',
  showStrength = true,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const strength = usePasswordStrength(value)

  return (
    <div className="w-full">
      {/* Label */}
      <label className={cn(
        "block text-base font-semibold mb-2",
        "text-gray-700 dark:text-gray-200"
        )}
      >
        Password
      </label>

      {/* Input */}
      <div className="relative">
        <div className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2",
          "text-gray-400 pointer-events-none"
          )}
        >
          <Lock className="h-5 w-5" />
        </div>

        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border bg-white dark:bg-surface-dark',
            'px-4 py-3 pl-10 pr-10 text-sm text-gray-900 dark:text-white',
            'placeholder:text-gray-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary/20',
            'focus:border-primary',
            'border-gray-200 dark:border-gray-700'
          )}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "text-gray-400 hover:text-gray-600"
          )}
        >
          {
            showPassword ? 
            <EyeOff className="h-5 w-5" /> : 
            <Eye className="h-5 w-5" />
          }
        </button>
      </div>

      {/* Strength Indicator */}
      {showStrength && value && (
        <div className="mt-2 space-y-2">
          {/* Strength Bars */}
          <div className="flex gap-1">
            {[25, 50, 75, 100].map((threshold) => (
              <div
                key={threshold}
                className={cn(
                  'h-1 flex-1 rounded-full transition-all duration-300',
                  strength.percentage >= threshold
                    ? 'opacity-100'
                    : 'bg-gray-200 dark:bg-gray-700 opacity-100'
                )}
                style={{
                  backgroundColor:
                    strength.percentage >= threshold ? 
                    strength.color : undefined,
                }}
              />
            ))}
          </div>

          {/* Strength Label */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" 
              style={{ color: strength.color }}
            >
              Strength: {strength.label}
            </span>
            <span className="text-xs text-gray-500">
              {strength.score}/100
            </span>
          </div>

          {/* Feedback */}
          {strength.feedback.length > 0 && 
            strength.level !== 'very-strong' && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <ul className="list-disc list-inside space-y-0.5">
                {strength.feedback.slice(0, 3).map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
