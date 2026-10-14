import React, { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { SearchInput } from '@/components/common/SearchInput'
import { EmptyState } from '@/components/common/EmptyState'
import { KanbanBoard } from '@/features/kanban/KanbanBoard'
import { formatSmartDueDate } from '@/lib/dates'
import { Plus, Check, Filter, LayoutGrid, List, CheckSquare } from 'lucide-react'
import { TaskStatus, TaskPriority } from '@/types'
import { toast } from 'sonner'

export const TasksPage: React.FC = () => {
  const {
    tasks,
    setCreateTaskModalOpen,
    setSelectedTaskId,
    updateTaskStatus
  } = useAppStore()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list')

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        t.title.toLowerCase().includes(q) ||
        t.key.toLowerCase().includes(q) ||
        t.projectName.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks & Engineering Deliverables"
        description="Track, prioritize, and manage engineering tasks across active projects."
        actions={
          <div className="flex items-center gap-2.5">
            {/* View Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'board'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Kanban Board View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              size="sm"
              onClick={() => setCreateTaskModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Task
            </Button>
          </div>
        }
      />

      {viewMode === 'board' ? (
        <KanbanBoard />
      ) : (
        <>
          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-full sm:w-72">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by title, key, or project..."
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task List Table */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === 'done'
                const dueDateInfo = task.dueDate ? formatSmartDueDate(task.dueDate) : null

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors gap-3 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const next: TaskStatus = isCompleted ? 'todo' : 'done'
                          updateTaskStatus(task.id, next)
                          toast.success(`Task moved to ${next}`)
                        }}
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                        }`}
                      >
                        {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-500">
                            {task.key}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              isCompleted
                                ? 'line-through text-slate-400'
                                : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span>{task.projectName}</span>
                          {task.subtasks.length > 0 && (
                            <>
                              <span>•</span>
                              <span>
                                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <Badge priority={task.priority} />
                      <Badge status={task.status} />

                      {dueDateInfo && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            dueDateInfo.isOverdue
                              ? 'text-red-700 bg-red-50 dark:bg-red-950/60 dark:text-red-300'
                              : dueDateInfo.isUrgent
                              ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {dueDateInfo.label}
                        </span>
                      )}

                      {task.assignee && (
                        <Avatar
                          name={task.assignee.name}
                          src={task.assignee.avatar}
                          size="xs"
                        />
                      )}
                    </div>
                  </div>
                )
              })}

              {filteredTasks.length === 0 && (
                <EmptyState
                  icon={<CheckSquare className="w-6 h-6" />}
                  title="No tasks found"
                  description="No deliverables match your search query or filter selection."
                  actionLabel="Clear Filters"
                  onAction={() => {
                    setSearch('')
                    setStatusFilter('all')
                    setPriorityFilter('all')
                  }}
                  className="m-4"
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
