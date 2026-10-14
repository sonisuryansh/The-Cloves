import React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressBarProps {
  value: number // 0 - 100
  max?: number
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'auto'
  size?: 'sm' | 'md' | 'lg'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  showLabel = false,
  variant = 'auto',
  size = 'md'
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  let barColor = 'bg-blue-600'
  if (variant === 'auto') {
    if (percentage >= 80) barColor = 'bg-emerald-500'
    else if (percentage >= 40) barColor = 'bg-blue-600'
    else if (percentage > 0) barColor = 'bg-amber-500'
    else barColor = 'bg-slate-300 dark:bg-slate-700'
  } else if (variant === 'success') {
    barColor = 'bg-emerald-500'
  } else if (variant === 'warning') {
    barColor = 'bg-amber-500'
  } else if (variant === 'destructive') {
    barColor = 'bg-red-500'
  }

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{percentage}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800',
          heightStyles[size]
        )}
      >
        <div
          className={cn('h-full transition-all duration-300 rounded-full', barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
