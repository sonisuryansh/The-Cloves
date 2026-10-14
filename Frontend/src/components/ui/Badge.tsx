import React from 'react'
import { cn } from '@/lib/utils'
import { TaskPriority, TaskStatus, ProjectHealth } from '@/types'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'neutral'
  priority?: TaskPriority
  status?: TaskStatus
  health?: ProjectHealth
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  priority,
  status,
  health,
  dot,
  children,
  ...props
}) => {
  let resolvedClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  let label = children

  if (priority) {
    switch (priority) {
      case 'urgent':
        resolvedClass = 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
        label = label || 'Urgent'
        break
      case 'high':
        resolvedClass = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
        label = label || 'High'
        break
      case 'medium':
        resolvedClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
        label = label || 'Medium'
        break
      case 'low':
        resolvedClass = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
        label = label || 'Low'
        break
    }
  } else if (status) {
    switch (status) {
      case 'todo':
        resolvedClass = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
        label = label || 'To Do'
        break
      case 'in_progress':
        resolvedClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300'
        label = label || 'In Progress'
        break
      case 'in_review':
        resolvedClass = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300'
        label = label || 'In Review'
        break
      case 'done':
        resolvedClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
        label = label || 'Done'
        break
    }
  } else if (health) {
    switch (health) {
      case 'on-track':
        resolvedClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
        label = label || 'On Track'
        break
      case 'needs-review':
        resolvedClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
        label = label || 'Needs Review'
        break
      case 'at-risk':
        resolvedClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300'
        label = label || 'At Risk'
        break
    }
  } else {
    switch (variant) {
      case 'default':
        resolvedClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300'
        break
      case 'secondary':
        resolvedClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
        break
      case 'outline':
        resolvedClass = 'border border-slate-300 bg-transparent text-slate-700 dark:border-slate-700 dark:text-slate-300'
        break
      case 'success':
        resolvedClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
        break
      case 'warning':
        resolvedClass = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
        break
      case 'destructive':
        resolvedClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300'
        break
      case 'neutral':
        resolvedClass = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        break
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md border',
        resolvedClass,
        className
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />}
      {label}
    </span>
  )
}
