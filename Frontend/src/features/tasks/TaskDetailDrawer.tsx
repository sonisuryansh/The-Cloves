import React, { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useAppStore } from '@/stores/useAppStore'
import { formatRelativeTime, formatDate } from '@/lib/dates'
import { MOCK_USERS } from '@/mocks/mockData'
import {
  Calendar,
  Clock,
  Send,
  Trash2,
  CheckCircle2,
  Circle,
  Plus,
  Paperclip,
  Upload,
  Download,
  Edit2,
  Check,
  X
} from 'lucide-react'
import { TaskStatus, TaskPriority } from '@/types'
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'
import { toast } from 'sonner'

export const TaskDetailDrawer: React.FC = () => {
  const {
    selectedTaskId,
    setSelectedTaskId,
    tasks,
    updateTaskStatus,
    updateTask,
    deleteTask,
    addTaskComment,
    toggleTaskSubtask,
    addTaskAttachment,
    deleteTaskAttachment
  } = useAppStore()

  const [commentText, setCommentText] = useState('')
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [descDraft, setDescDraft] = useState('')

  const task = tasks.find((t) => t.id === selectedTaskId)

  if (!selectedTaskId || !task) return null

  const handleStatusChange = (status: TaskStatus) => {
    updateTaskStatus(task.id, status)
    toast.success(`Updated status to ${status.replace('_', ' ')}`)
  }

  const handlePriorityChange = (priority: TaskPriority) => {
    updateTask(task.id, { priority })
    toast.success(`Updated priority to ${priority}`)
  }

  const handleAssigneeChange = (userId: string) => {
    const user = MOCK_USERS.find((u) => u.id === userId)
    updateTask(task.id, { assignee: user })
    toast.success(`Reassigned to ${user?.name || 'Unassigned'}`)
  }

  const handleDueDateChange = (date: string) => {
    updateTask(task.id, { dueDate: date })
    toast.success(`Due date updated to ${formatDate(date)}`)
  }

  const handleSaveTitle = () => {
    if (titleDraft.trim()) {
      updateTask(task.id, { title: titleDraft.trim() })
      toast.success('Task title updated')
    }
    setIsEditingTitle(false)
  }

  const handleSaveDesc = () => {
    updateTask(task.id, { description: descDraft.trim() })
    setIsEditingDesc(false)
    toast.success('Description updated')
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    addTaskComment(task.id, commentText.trim())
    setCommentText('')
    toast.success('Comment posted')
  }

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return
    const newSub = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    }
    updateTask(task.id, { subtasks: [...task.subtasks, newSub] })
    setNewSubtaskTitle('')
    toast.success('Subtask added')
  }

  const handleDeleteSubtask = (stId: string) => {
    updateTask(task.id, {
      subtasks: task.subtasks.filter((s) => s.id !== stId)
    })
    toast.success('Subtask removed')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    addTaskAttachment(task.id, {
      name: file.name,
      sizeBytes: file.size,
      fileType: file.type || 'document'
    })
    toast.success(`Attached ${file.name}`)
  }

  const handleDelete = () => {
    deleteTask(task.id)
    setSelectedTaskId(null)
    toast.success('Task deleted')
  }

  return (
    <>
      <Dialog
        isOpen={Boolean(selectedTaskId)}
        onClose={() => setSelectedTaskId(null)}
        maxWidth="lg"
        className="p-0"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
              {task.key}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              in <span className="font-medium text-slate-700 dark:text-slate-300">{task.projectName}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleting(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Modal Main Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Main content (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Title Editing */}
            <div>
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    autoFocus
                    className="flex-1 text-base font-bold bg-white dark:bg-slate-900 border border-blue-500 rounded px-2 py-1 outline-none"
                  />
                  <Button size="xs" onClick={handleSaveTitle}>
                    Save
                  </Button>
                  <Button size="xs" variant="ghost" onClick={() => setIsEditingTitle(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2 group">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {task.title}
                  </h2>
                  <button
                    onClick={() => {
                      setTitleDraft(task.title)
                      setIsEditingTitle(true)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 rounded transition-opacity"
                    title="Edit title"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Description Editing */}
              {isEditingDesc ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={descDraft}
                    onChange={(e) => setDescDraft(e.target.value)}
                    rows={3}
                    autoFocus
                    className="w-full text-xs p-2.5 rounded-lg border border-blue-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
                  />
                  <div className="flex gap-2">
                    <Button size="xs" onClick={handleSaveDesc}>
                      Save
                    </Button>
                    <Button size="xs" variant="ghost" onClick={() => setIsEditingDesc(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 group relative">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {task.description || (
                      <span className="italic text-slate-400">No description provided. Click to add context.</span>
                    )}
                  </p>
                  <button
                    onClick={() => {
                      setDescDraft(task.description || '')
                      setIsEditingDesc(true)
                    }}
                    className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit description
                  </button>
                </div>
              )}
            </div>

            {/* Subtasks checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
                </h4>
              </div>

              <div className="space-y-1.5">
                {task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs group"
                  >
                    <div
                      onClick={() => toggleTaskSubtask(task.id, st.id)}
                      className="flex items-center gap-2.5 flex-1 cursor-pointer"
                    >
                      {st.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                        {st.title}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteSubtask(st.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                      title="Remove subtask"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add Subtask input */}
                <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a checklist item..."
                    className="flex-1 h-8 px-2.5 text-xs bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Button size="xs" variant="outline" type="submit" leftIcon={<Plus className="w-3 h-3" />}>
                    Add
                  </Button>
                </form>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attachments ({(task.attachments || []).length})</span>
                </h4>
                <label className="cursor-pointer">
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium">
                    <Upload className="w-3 h-3" /> Upload File
                  </span>
                </label>
              </div>

              {(task.attachments || []).length > 0 ? (
                <div className="space-y-1.5">
                  {(task.attachments || []).map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {att.name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          ({(att.sizeBytes / 1024).toFixed(0)} KB)
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => toast.success(`Downloading ${att.name}`)}
                          leftIcon={<Download className="w-3 h-3" />}
                        >
                          Download
                        </Button>
                        <button
                          onClick={() => deleteTaskAttachment(task.id, att.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded"
                          title="Remove attachment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">
                  No files attached to this task.
                </div>
              )}
            </div>

            {/* Comments Thread */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Activity & Comments ({task.comments.length})
              </h4>

              <div className="space-y-3">
                {task.comments.map((comm) => (
                  <div key={comm.id} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <Avatar name={comm.user.name} src={comm.user.avatar} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {comm.user.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatRelativeTime(comm.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {comm.text}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Post comment */}
                <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment or engineering update..."
                    className="flex-1 h-8 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button size="xs" type="submit" leftIcon={<Send className="w-3 h-3" />}>
                    Send
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar Properties (1 col) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4 text-xs h-fit">
            {/* Status Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Assignee Reassignment */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Assignee
              </label>
              <select
                value={task.assignee?.id || ''}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              >
                {MOCK_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Editable */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={(e) => handleDueDateChange(e.target.value)}
                className="w-full h-8 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Effort */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Estimated Effort
              </label>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.estimatedHours || 8} hours</span>
              </div>
            </div>

            {/* Labels */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Labels
              </label>
              <div className="flex flex-wrap gap-1">
                {task.labels.map((lbl, idx) => (
                  <Badge key={idx} variant="secondary">
                    {lbl}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Confirmation for Delete */}
      <ConfirmationDialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        title={`Delete task ${task.key}?`}
        message="This action will permanently remove the task and all attached comments. This operation is simulated locally."
        confirmLabel="Delete Task"
        isDestructive={true}
      />
    </>
  )
}
