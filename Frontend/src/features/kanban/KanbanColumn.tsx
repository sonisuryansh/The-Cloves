import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '@/types'
import { KanbanCard } from './KanbanCard'
import { Button } from '@/components/ui/Button'
import { Plus, X, CheckCircle2, Clock, CircleDot, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface KanbanColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onQuickCreateTask: (title: string, status: TaskStatus) => void
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  onTaskClick,
  onQuickCreateTask
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      status: id
    }
  })

  const [isAdding, setIsAdding] = useState(false)
  const [quickTitle, setQuickTitle] = useState('')

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickTitle.trim()) return
    onQuickCreateTask(quickTitle.trim(), id)
    setQuickTitle('')
    setIsAdding(false)
  }

  const columnIcons: Record<TaskStatus, React.ReactNode> = {
    todo: <CircleDot className="w-3.5 h-3.5 text-slate-400" />,
    in_progress: <Clock className="w-3.5 h-3.5 text-blue-500" />,
    in_review: <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />,
    done: <Check className="w-3.5 h-3.5 text-emerald-500" />
  }

  const columnHeaders: Record<TaskStatus, string> = {
    todo: 'border-t-slate-400',
    in_progress: 'border-t-blue-500',
    in_review: 'border-t-purple-500',
    done: 'border-t-emerald-500'
  }

  const taskIds = tasks.map((t) => t.id)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col flex-1 min-w-[280px] max-w-[340px] rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/80 p-3 transition-colors',
        'border-t-3',
        columnHeaders[id],
        isOver && 'ring-2 ring-blue-500/40 bg-blue-50/30 dark:bg-blue-950/20'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          {columnIcons[id]}
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {title}
          </h3>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inline Quick Task Creator */}
      {isAdding && (
        <form onSubmit={handleQuickSubmit} className="mb-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-500 shadow-sm animate-in fade-in-0 duration-150">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            className="w-full text-xs bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          <div className="flex items-center justify-end gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setQuickTitle('')
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <Button size="xs" type="submit">
              Add
            </Button>
          </div>
        </form>
      )}

      {/* Sortable Task Cards List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 min-h-[160px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center h-32 rounded-lg border border-dashed border-slate-300/80 dark:border-slate-800 text-center p-4">
            <span className="text-[11px] text-slate-400">No tasks in {title}</span>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              + Create task
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
