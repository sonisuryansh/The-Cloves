import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatSmartDueDate } from '@/lib/dates'
import { CheckSquare, CheckCircle2, GripVertical, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface KanbanCardProps {
  task: Task
  onClick?: () => void
  isOverlay?: boolean
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, onClick, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task
    }
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1
  }

  const dueDateInfo = task.dueDate ? formatSmartDueDate(task.dueDate) : null
  const isCompleted = task.status === 'done'

  const cardContent = (
    <div
      className={cn(
        'group relative flex flex-col p-3.5 rounded-xl border bg-white dark:bg-slate-900 transition-all select-none',
        'border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm cursor-pointer',
        isDragging && 'border-blue-500 ring-2 ring-blue-500/20 shadow-md',
        isOverlay && 'shadow-xl border-blue-500 ring-2 ring-blue-500/30 rotate-1 cursor-grabbing'
      )}
      onClick={onClick}
    >
      {/* Top Row: Key, Drag Handle & Priority */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <button
            {...attributes}
            {...listeners}
            className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded cursor-grab active:cursor-grabbing focus:outline-none"
            title="Drag to reorder or move column"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {task.key}
          </span>
        </div>

        <Badge priority={task.priority} />
      </div>

      {/* Task Title */}
      <h4
        className={cn(
          'text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug',
          isCompleted && 'line-through text-slate-400 dark:text-slate-500'
        )}
      >
        {task.title}
      </h4>

      {/* Tags / Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels.slice(0, 2).map((label, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              {label}
            </span>
          ))}
          {task.labels.length > 2 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{task.labels.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer Meta Row: Subtasks, Attachments, Due Date, Assignee */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          {task.subtasks.length > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-slate-400" />
              <span>
                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
              </span>
            </span>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Paperclip className="w-3 h-3 text-slate-400" />
              <span>{task.attachments.length}</span>
            </span>
          )}

          {dueDateInfo && (
            <span
              className={cn(
                'text-[10px] font-medium px-1.5 py-0.2 rounded',
                dueDateInfo.isOverdue
                  ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                  : dueDateInfo.isUrgent
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'text-slate-400'
              )}
            >
              {dueDateInfo.label}
            </span>
          )}
        </div>

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

  if (isOverlay) {
    return cardContent
  }

  return (
    <div ref={setNodeRef} style={style}>
      {cardContent}
    </div>
  )
}
