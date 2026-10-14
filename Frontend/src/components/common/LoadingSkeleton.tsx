import React from 'react'
import { cn } from '@/lib/utils'

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800',
      className
    )}
  />
)

export const DashboardCardSkeleton: React.FC = () => (
  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-36" />
  </div>
)

export const TaskRowSkeleton: React.FC = () => (
  <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
    <div className="flex items-center gap-3">
      <Skeleton className="h-4 w-4 rounded-sm" />
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-48" />
        <Skeleton className="h-2.5 w-24" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="h-5 w-16 rounded-md" />
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  </div>
)
