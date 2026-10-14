import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '@/stores/useAppStore'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Tabs } from '@/components/ui/Tabs'
import { KanbanBoard } from '@/features/kanban/KanbanBoard'
import { formatDate, formatSmartDueDate, formatRelativeTime } from '@/lib/dates'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  FolderGit2,
  Layers,
  Plus,
  Sparkles,
  Upload,
  Download,
  AlertTriangle,
  GanttChartSquare,
  Activity,
  Check
} from 'lucide-react'
import { TaskStatus } from '@/types'
import { toast } from 'sonner'

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    getComputedProjects,
    tasks,
    activities,
    setCreateTaskModalOpen,
    setSelectedTaskId,
    updateTaskStatus
  } = useAppStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [mockFiles, setMockFiles] = useState([
    { id: 'f-1', name: 'System_Architecture_Rev2.pdf', size: '2.4 MB', date: '2026-10-10' },
    { id: 'f-2', name: 'LiDAR_Sensor_Fusion_Spec.docx', size: '1.1 MB', date: '2026-10-12' },
    { id: 'f-3', name: 'CAN_FD_Telemetry_Schema.json', size: '48 KB', date: '2026-10-13' }
  ])

  const projects = getComputedProjects()
  const project = projects.find((p) => p.id === id) || projects[0]

  if (!project) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Project not found.</p>
        <Button onClick={() => navigate('/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    )
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const projectActivities = activities.filter((a) =>
    a.targetId === project.id || projectTasks.some((t) => t.id === a.targetId)
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'board', label: 'Board', icon: <GanttChartSquare className="w-3.5 h-3.5" />, badge: projectTasks.length },
    { id: 'list', label: 'List', icon: <FileText className="w-3.5 h-3.5" />, badge: projectTasks.length },
    { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'files', label: 'Files', icon: <Upload className="w-3.5 h-3.5" />, badge: mockFiles.length },
    { id: 'activity', label: 'Activity', icon: <Activity className="w-3.5 h-3.5" /> }
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const newF = {
      id: `f-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0]
    }
    setMockFiles([newF, ...mockFiles])
    toast.success(`Attached document: ${file.name}`)
  }

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb Link */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link
          to="/projects"
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Projects</span>
        </Link>
        <span>/</span>
        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
          {project.key}
        </span>
      </div>

      {/* Project Hero Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-sm flex items-center justify-center shrink-0">
              {project.key}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {project.name}
                </h1>
                <Badge health={project.health} />
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {project.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              size="sm"
              onClick={() => setCreateTaskModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Task
            </Button>
          </div>
        </div>

        {/* Project Meta Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Deliverables
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {project.completedTasks} / {project.totalTasks} completed ({project.progressPercentage}%)
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Target Deadline
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {formatDate(project.dueDate)}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Lead / Owner
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Avatar name={project.owner.name} src={project.owner.avatar} size="xs" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {project.owner.name}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Next Key Milestone
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5 block">
              {project.nextMilestone}
            </span>
          </div>
        </div>

        {/* Live Progress Bar */}
        <ProgressBar value={project.progressPercentage || 0} size="sm" variant="auto" />
      </div>

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="underline" />

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Health Notice if at risk */}
            {project.health === 'at-risk' && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-300">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Program Risk Advisory</span>
                </div>
                <p className="leading-relaxed">
                  One or more urgent dependency tasks are blocking milestone progression. Task completion is currently below target sprint velocity.
                </p>
              </div>
            )}

            {/* Scope & Engineering Strategy */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Initiative Scope & Objectives
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Critical Tasks Preview */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Open Project Tasks ({projectTasks.filter((t) => t.status !== 'done').length})
                </h3>
                <Button size="xs" variant="ghost" onClick={() => setActiveTab('list')}>
                  View all in List
                </Button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {projectTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {task.key}
                      </span>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge priority={task.priority} />
                      <Badge status={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Next Milestone & Team */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Next Milestone Deliverable
              </h3>
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs">
                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>{project.nextMilestone}</span>
                </div>
                <div className="text-[11px] text-blue-700 dark:text-blue-300 mt-2">
                  Target Due: {formatDate(project.dueDate)}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Project Activity Log
              </h3>
              <div className="space-y-3 text-xs">
                {projectActivities.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5">
                    <Avatar name={act.user.name} src={act.user.avatar} size="xs" />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {act.user.name}
                      </span>{' '}
                      <span className="text-slate-500">{act.action}</span>
                      <div className="text-[10px] text-slate-400">
                        {formatRelativeTime(act.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {projectActivities.length === 0 && (
                  <span className="text-slate-400 text-xs">No recent events logged.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: BOARD (KANBAN) ================= */}
      {activeTab === 'board' && (
        <div className="space-y-4">
          <KanbanBoard projectId={project.id} />
        </div>
      )}

      {/* ================= TAB 3: LIST ================= */}
      {activeTab === 'list' && (
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Deliverables ({projectTasks.length})
            </span>
            <Button
              size="xs"
              onClick={() => setCreateTaskModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Task
            </Button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {projectTasks.map((task) => {
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
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {task.key}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      {task.subtasks.length > 0 && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks completed
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <Badge priority={task.priority} />
                    <Badge status={task.status} />

                    {dueDateInfo && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
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
          </div>
        </div>
      )}

      {/* ================= TAB 4: TIMELINE ================= */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Deliverable Timeline & Critical Path
            </h3>
            <span className="text-xs text-slate-400">
              Target Deadline: {formatDate(project.dueDate)}
            </span>
          </div>

          <div className="space-y-4">
            {projectTasks.map((task, idx) => (
              <div key={task.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500">{task.key}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full ${
                      task.status === 'done'
                        ? 'bg-emerald-500'
                        : task.priority === 'urgent'
                        ? 'bg-red-500'
                        : 'bg-blue-600'
                    }`}
                    style={{
                      width: task.status === 'done' ? '100%' : `${Math.max(25, 100 - idx * 20)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: FILES ================= */}
      {activeTab === 'files' && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Project Attachments & Documents
            </h3>
            <label className="cursor-pointer">
              <input type="file" onChange={handleFileUpload} className="hidden" />
              <Button size="xs" variant="outline" leftIcon={<Upload className="w-3.5 h-3.5" />}>
                Upload Document
              </Button>
            </label>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockFiles.map((file) => (
              <div key={file.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {file.name}
                    </span>
                    <div className="text-[11px] text-slate-400">
                      {file.size} • Uploaded {file.date}
                    </div>
                  </div>
                </div>

                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => toast.success(`Downloaded ${file.name}`)}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: ACTIVITY ================= */}
      {activeTab === 'activity' && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Audit Trail & History
          </h3>

          <div className="space-y-4 text-xs">
            {projectActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <Avatar name={act.user.name} src={act.user.avatar} size="xs" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {act.user.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    {act.action} <span className="font-medium text-slate-800 dark:text-slate-200">{act.targetTitle}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
