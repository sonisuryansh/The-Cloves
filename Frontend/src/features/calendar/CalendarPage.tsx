import React, { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/common/EmptyState'
import { formatDate, formatSmartDueDate } from '@/lib/dates'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react'
import { Task } from '@/types'

export const CalendarPage: React.FC = () => {
  const {
    tasks,
    projects,
    setCreateTaskModalOpen,
    setSelectedTaskId
  } = useAppStore()

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'timeline'>('month')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')

  const relevantTasks = tasks.filter((t) => {
    if (selectedProjectId !== 'all' && t.projectId !== selectedProjectId) return false
    return Boolean(t.dueDate)
  })

  // Simulated calendar days for October 2026 (starts on Thursday, 31 days)
  // Weekdays: Sun, Mon, Tue, Wed, Thu, Fri, Sat
  // Oct 1, 2026 is a Thursday (index 4)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)
  const paddingBefore = [27, 28, 29, 30] // Sep padding days

  const getTasksForDay = (day: number) => {
    const dateStr = `2026-10-${day.toString().padStart(2, '0')}`
    return relevantTasks.filter((t) => t.dueDate === dateStr)
  }

  // Week View: Current week (Oct 11 - Oct 17, 2026)
  const currentWeekDays = [
    { name: 'Sun', day: 11, dateStr: '2026-10-11' },
    { name: 'Mon', day: 12, dateStr: '2026-10-12' },
    { name: 'Tue', day: 13, dateStr: '2026-10-13' },
    { name: 'Wed', day: 14, dateStr: '2026-10-14', isToday: true },
    { name: 'Thu', day: 15, dateStr: '2026-10-15' },
    { name: 'Fri', day: 16, dateStr: '2026-10-16' },
    { name: 'Sat', day: 17, dateStr: '2026-10-17' }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule, Calendar & Timeline"
        description="Unified milestone scheduling, critical path deliverables, and sprint deadline calendar."
        actions={
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Timeline (Gantt)
              </button>
            </div>

            <Button
              size="sm"
              onClick={() => setCreateTaskModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Deliverable
            </Button>
          </div>
        }
      />

      {/* Calendar Controls & Project Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Button size="icon" variant="outline" className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 px-2 min-w-[130px] text-center">
              {viewMode === 'week' ? 'Oct 11 – 17, 2026' : 'October 2026'}
            </span>
            <Button size="icon" variant="outline" className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <Button size="xs" variant="secondary">
            Current Sprint
          </Button>
        </div>

        {/* Project Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="h-8 px-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Active Initiatives</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.key} — {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= 1. MONTH VIEW ================= */}
      {viewMode === 'month' && (
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center py-2.5 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800">
            {/* September padding days */}
            {paddingBefore.map((d, i) => (
              <div
                key={`pad-${i}`}
                className="min-h-[110px] p-2 bg-slate-50/30 dark:bg-slate-950/20 text-slate-300 dark:text-slate-700 text-xs"
              >
                {d}
              </div>
            ))}

            {/* October days */}
            {daysInMonth.map((day) => {
              const dayTasks = getTasksForDay(day)
              const isToday = day === 14 // Oct 14, 2026

              return (
                <div
                  key={day}
                  className={`min-h-[110px] p-2 transition-colors flex flex-col justify-between ${
                    isToday ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {dayTasks.length} due
                      </span>
                    )}
                  </div>

                  {/* Tasks on this day */}
                  <div className="space-y-1 overflow-y-auto max-h-[85px]">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTaskId(t.id)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate cursor-pointer transition-transform hover:scale-[1.02] flex items-center gap-1 border ${
                          t.status === 'done'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : t.priority === 'urgent'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 font-bold'
                            : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                        title={`${t.key}: ${t.title}`}
                      >
                        <span className="font-mono text-[9px] opacity-75">{t.key}</span>
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================= 2. WEEK VIEW ================= */}
      {viewMode === 'week' && (
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 min-h-[450px]">
            {currentWeekDays.map((col) => {
              const dayTasks = relevantTasks.filter((t) => t.dueDate === col.dateStr)

              return (
                <div
                  key={col.day}
                  className={`flex flex-col p-3 ${
                    col.isToday ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="text-center pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">
                      {col.name}
                    </span>
                    <span
                      className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-sm font-extrabold mt-0.5 ${
                        col.isToday
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {col.day}
                    </span>
                  </div>

                  {/* Tasks list */}
                  <div className="space-y-2 pt-3 flex-1 overflow-y-auto">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-500">
                            {task.key}
                          </span>
                          <Badge priority={task.priority} />
                        </div>
                        <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                          {task.title}
                        </h5>
                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                          <span className="truncate max-w-[90px]">{task.projectName}</span>
                          {task.assignee && (
                            <Avatar name={task.assignee.name} src={task.assignee.avatar} size="xs" />
                          )}
                        </div>
                      </div>
                    ))}

                    {dayTasks.length === 0 && (
                      <div className="text-center py-8 text-[11px] text-slate-300 dark:text-slate-700">
                        No targets
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================= 3. TIMELINE (GANTT) VIEW ================= */}
      {viewMode === 'timeline' && (
        <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Milestone & Task Gantt Progression
              </h3>
              <p className="text-xs text-slate-500">
                Start-to-target execution spans and dependency bottlenecks
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Timescale: Oct 1 — Nov 30, 2026
            </span>
          </div>

          <div className="space-y-4">
            {relevantTasks.map((task, idx) => {
              const isBlocked = task.dependencies.length > 0
              const isDone = task.status === 'done'

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-slate-500">{task.key}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {task.title}
                      </span>
                      {isBlocked && (
                        <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-900 font-medium">
                          Depends on {task.dependencies.join(', ')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {task.startDate ? formatDate(task.startDate, 'MMM d') : 'Oct 10'} → {task.dueDate ? formatDate(task.dueDate, 'MMM d') : 'Oct 20'}
                      </span>
                      <Badge status={task.status} />
                    </div>
                  </div>

                  {/* Gantt Bar representation */}
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isDone
                          ? 'bg-emerald-500'
                          : task.priority === 'urgent'
                          ? 'bg-red-500'
                          : 'bg-blue-600'
                      }`}
                      style={{
                        marginLeft: `${(idx % 4) * 12}%`,
                        width: isDone ? '100%' : `${Math.max(30, 85 - (idx % 3) * 20)}%`
                      }}
                    />
                  </div>
                </div>
              )
            })}

            {relevantTasks.length === 0 && (
              <EmptyState
                icon={<CalendarIcon className="w-6 h-6" />}
                title="No timeline deliverables"
                description="No scheduled tasks found for the selected project filter."
                actionLabel="Reset Project Filter"
                onAction={() => setSelectedProjectId('all')}
                className="m-4"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
