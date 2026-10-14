import React, { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/common/EmptyState'
import { formatSmartDueDate, formatRelativeTime, formatDate } from '@/lib/dates'
import {
  FolderGit2,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Sparkles,
  Calendar as CalendarIcon,
  Cpu,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  Check,
  ShieldAlert,
  Info
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { TaskStatus } from '@/types'

export const OverviewDashboard: React.FC = () => {
  const {
    currentUser,
    currentWorkspace,
    getComputedProjects,
    getMyTasks,
    getDashboardKPIs,
    aiInsights,
    markInsightReviewed,
    activities,
    setCreateTaskModalOpen,
    setCreateProjectModalOpen,
    setSelectedTaskId,
    updateTaskStatus
  } = useAppStore()

  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)

  const kpis = getDashboardKPIs()
  const computedProjects = getComputedProjects()
  const myTasks = getMyTasks()

  // Contextual greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleRunAiScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      toast.success('AI Diagnostics complete: 3 critical path factors analyzed')
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* A. Welcome & Contextual Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {getGreeting()}, {currentUser.name.split(' ')[0]}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Demo Sandbox • Local Mock Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Workspace: <span className="font-semibold text-white">{currentWorkspace.name}</span> •{' '}
            {kpis.activeProjects} active initiatives, {kpis.dueSoon} deadlines within 48h, and {kpis.openTasks} open tasks.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRunAiScan}
            isLoading={isScanning}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-300" />}
          >
            Run Risk Scan
          </Button>

          <Button
            size="sm"
            onClick={() => setCreateTaskModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white border-none shadow-sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* B. Four KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Projects */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer" onClick={() => navigate('/projects')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Projects
              </span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {kpis.activeProjects}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                initiatives
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {computedProjects.filter((p) => p.health === 'on-track').length} On Track
              </span>
              <span>•</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {kpis.atRiskProjects} At Risk
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Open Tasks */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer" onClick={() => navigate('/tasks')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Open Tasks
              </span>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {kpis.openTasks}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                active items
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {myTasks.filter((t) => t.status === 'in_progress').length} In Progress
              </span>
              <span>•</span>
              <span>Across 4 projects</span>
            </div>
          </CardContent>
        </Card>

        {/* Due Soon */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer" onClick={() => navigate('/calendar')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Due Soon (48h)
              </span>
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {kpis.dueSoon}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                deadlines
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-amber-600 dark:text-amber-400">
                1 on critical path
              </span>
              <span>•</span>
              <span>Needs prompt action</span>
            </div>
          </CardContent>
        </Card>

        {/* Completed This Week */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer" onClick={() => navigate('/reports')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completed
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {kpis.completedThisWeek}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                delivered
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Calculated from task data
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main 12-Column Grid: 8-Column Primary, 4-Column Secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= PRIMARY COLUMN (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* C. My Tasks Panel */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  <span>My Tasks</span>
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    ({myTasks.length})
                  </span>
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Assigned to you across active engineering and plant projects
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setCreateTaskModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Task
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => navigate('/tasks')}
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                >
                  View All
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
              {myTasks.slice(0, 5).map((task) => {
                const dueDateInfo = task.dueDate ? formatSmartDueDate(task.dueDate) : null
                const isCompleted = task.status === 'done'

                return (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors gap-3 cursor-pointer group"
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Checkbox status toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const nextStatus: TaskStatus = isCompleted ? 'todo' : 'done'
                          updateTaskStatus(task.id, nextStatus)
                          toast.success(`Task marked as ${nextStatus}`)
                        }}
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                        }`}
                        title={isCompleted ? 'Mark incomplete' : 'Mark done'}
                      >
                        {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            {task.key}
                          </span>
                          <span
                            className={`text-xs font-semibold truncate ${
                              isCompleted
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="truncate max-w-[200px]">{task.projectName}</span>
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

              {myTasks.length === 0 && (
                <EmptyState
                  icon={<CheckSquare className="w-6 h-6" />}
                  title="All Caught Up!"
                  description="You currently have no open engineering tasks assigned to you."
                  actionLabel="Add Task"
                  onAction={() => setCreateTaskModalOpen(true)}
                  className="m-4"
                />
              )}
            </CardContent>
          </Card>

          {/* D. Project Progress Panel */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Project Progress</span>
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    (Calculated from task completion)
                  </span>
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Active programs, subsystem milestones, and calculated health
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setCreateProjectModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  New Project
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => navigate('/projects')}
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                >
                  View All Projects
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
              {computedProjects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  onClick={() => navigate('/projects')}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {project.key}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.name}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-2">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge health={project.health} />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {project.progressPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar derived from actual tasks */}
                  <div className="space-y-1.5">
                    <ProgressBar
                      value={project.progressPercentage || 0}
                      size="sm"
                      variant="auto"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>
                        Deliverables: <span className="font-semibold text-slate-700 dark:text-slate-300">{project.completedTasks}</span> of {project.totalTasks} completed
                      </span>
                      <span className="truncate max-w-[280px]">
                        Next Milestone: <span className="italic text-slate-700 dark:text-slate-300">{project.nextMilestone}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {computedProjects.length === 0 && (
                <EmptyState
                  icon={<Layers className="w-6 h-6" />}
                  title="No active projects"
                  description="Initialize a new engineering project or choose an industrial template."
                  actionLabel="New Project"
                  onAction={() => setCreateProjectModalOpen(true)}
                  className="m-4"
                />
              )}
            </CardContent>
          </Card>

          {/* G. Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live audit trail of task transitions, project events, and comments
              </p>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-center justify-between p-3.5 px-5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={act.user.name} src={act.user.avatar} size="xs" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {act.user.name}
                      </span>{' '}
                      <span className="text-slate-500 dark:text-slate-400">
                        {act.action}
                      </span>{' '}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {act.targetTitle}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0 ml-3">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ================= SECONDARY COLUMN (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* E. Upcoming Deadlines */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-amber-500" />
                  <span>Upcoming Deadlines</span>
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Critical milestones in next 7 days
                </p>
              </div>

              <Button
                size="xs"
                variant="ghost"
                onClick={() => navigate('/calendar')}
                rightIcon={<ChevronRight className="w-3 h-3" />}
              >
                Calendar
              </Button>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
              {myTasks
                .filter((t) => t.dueDate && t.status !== 'done')
                .slice(0, 4)
                .map((task) => {
                  const dueDateInfo = formatSmartDueDate(task.dueDate!)
                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="p-3.5 px-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-500">
                          {task.key}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            dueDateInfo.isOverdue
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                              : dueDateInfo.isUrgent
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {dueDateInfo.label}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                        {task.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {task.projectName}
                      </div>
                    </div>
                  )
                })}
            </CardContent>
          </Card>

          {/* F. AI Insights Preview */}
          <Card className="border-indigo-200/70 dark:border-indigo-900/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>AI Insights & Risk</span>
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Evidence-backed predictive analysis
                </p>
              </div>

              <Button
                size="xs"
                variant="ghost"
                onClick={() => navigate('/insights')}
                rightIcon={<ChevronRight className="w-3 h-3" />}
              >
                All Insights
              </Button>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5">
              {/* Sample data label reminder */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-800 dark:text-indigo-200">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-500" />
                <span>
                  Insights are generated from deterministic rules and sample diagnostic models.
                </span>
              </div>

              {aiInsights.slice(0, 2).map((insight) => (
                <div
                  key={insight.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        insight.severity === 'critical'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                          : insight.severity === 'high'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                      }`}
                    >
                      {insight.severity} risk
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(insight.createdAt, 'MMM d, HH:mm')}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {insight.title}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>

                  {/* Detected facts */}
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                      Supporting telemetry:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                      {insight.detectedFacts.slice(0, 2).map((fact, idx) => (
                        <li key={idx}>{fact}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        if (insight.actionTargetRoute) {
                          navigate(insight.actionTargetRoute)
                        } else {
                          navigate('/insights')
                        }
                      }}
                    >
                      {insight.actionLabel}
                    </Button>

                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        markInsightReviewed(insight.id)
                        toast.success('Insight marked as reviewed')
                      }}
                      className="text-slate-400 hover:text-slate-600 text-[10px]"
                    >
                      Mark Reviewed
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
