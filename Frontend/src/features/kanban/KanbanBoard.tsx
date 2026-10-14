import React, { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '@/types'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { useAppStore } from '@/stores/useAppStore'
import { SearchInput } from '@/components/common/SearchInput'
import { MOCK_USERS } from '@/mocks/mockData'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'

export interface KanbanBoardProps {
  projectId?: string
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'in_review', title: 'In Review' },
  { id: 'done', title: 'Done' }
]

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const {
    tasks,
    moveTaskInKanban,
    setSelectedTaskId,
    addTask,
    projects,
    currentUser
  } = useAppStore()

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')

  // Setup pointer sensor with threshold so clicking cards opens modal without triggering drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Scope tasks if projectId is provided
  const relevantTasks = projectId
    ? tasks.filter((t) => t.projectId === projectId)
    : tasks

  // Apply filters
  const filteredTasks = relevantTasks.filter((t) => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    if (assigneeFilter !== 'all' && t.assignee?.id !== assigneeFilter) return false
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

  // Group tasks by column
  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((t) => t.status === status)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const found = tasks.find((t) => t.id === active.id)
    if (found) {
      setActiveTask(found)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    // Find if over is a column
    const isOverColumn = COLUMNS.some((col) => col.id === overId)
    if (isOverColumn) {
      const targetStatus = overId as TaskStatus
      const task = tasks.find((t) => t.id === activeId)
      if (task && task.status !== targetStatus) {
        moveTaskInKanban(activeId, overId, targetStatus)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // If dropped over a column directly
    const isOverColumn = COLUMNS.some((col) => col.id === overId)
    if (isOverColumn) {
      moveTaskInKanban(activeId, overId, overId as TaskStatus)
      return
    }

    // Dropped over another task
    const overTask = tasks.find((t) => t.id === overId)
    if (overTask) {
      moveTaskInKanban(activeId, overId, overTask.status)
    }
  }

  const handleQuickCreate = (title: string, status: TaskStatus) => {
    const targetProj = projectId
      ? projects.find((p) => p.id === projectId)
      : projects[0]

    const newTask = addTask({
      projectId: targetProj?.id || 'proj-1',
      projectName: targetProj?.name || 'Default Project',
      title,
      description: '',
      status,
      priority: 'medium',
      assignee: currentUser,
      reporter: currentUser,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      labels: ['Feature'],
      dependencies: []
    })

    toast.success(`Created task ${newTask.key} in ${status.replace('_', ' ')}`)
  }

  return (
    <div className="space-y-4">
      {/* Board Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Filter board tasks..."
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
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

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Assignee:</span>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">Everyone</option>
              {MOCK_USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DndContext Board Columns Container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[500px]">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              onTaskClick={setSelectedTaskId}
              onQuickCreateTask={handleQuickCreate}
            />
          ))}
        </div>

        {/* Drag Overlay for smooth preview */}
        <DragOverlay>
          {activeTask ? (
            <KanbanCard task={activeTask} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
