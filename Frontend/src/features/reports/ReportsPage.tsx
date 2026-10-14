import React, { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAppStore } from '@/stores/useAppStore'
import { MOCK_USERS } from '@/mocks/mockData'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts'
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Users,
  AlertTriangle,
  Calendar,
  Filter,
  Download
} from 'lucide-react'
import { toast } from 'sonner'

export const ReportsPage: React.FC = () => {
  const { getComputedProjects, tasks, productionOrders } = useAppStore()
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'q4' | 'all'>('30d')

  const projects = getComputedProjects()
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'done' || !t.dueDate) return false
    return new Date(t.dueDate).getTime() < new Date('2026-10-14').getTime()
  }).length

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  // Trend data for completion over sprints (simulated weekly progression)
  const completionTrendData = [
    { week: 'Week 38', Planned: 10, Completed: 8, Velocity: 82 },
    { week: 'Week 39', Planned: 16, Completed: 14, Velocity: 88 },
    { week: 'Week 40', Planned: 22, Completed: 19, Velocity: 86 },
    { week: 'Week 41', Planned: 28, Completed: 24, Velocity: 92 },
    { week: 'Current (W42)', Planned: 34, Completed: completedTasks, Velocity: 94 }
  ]

  // Workload distribution data by team member
  const workloadData = MOCK_USERS.map((user) => {
    const userTasks = tasks.filter((t) => t.assignee?.id === user.id)
    const active = userTasks.filter((t) => t.status !== 'done').length
    const done = userTasks.filter((t) => t.status === 'done').length
    return {
      name: user.name.split(' ')[0],
      Active: active,
      Completed: done,
      department: user.department
    }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engineering & Production Reports"
        description="Delivery velocity, milestone burnup, team workload distribution, and plant performance."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs">
              <button
                onClick={() => setDateRange('7d')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  dateRange === '7d'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setDateRange('30d')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  dateRange === '30d'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setDateRange('q4')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  dateRange === 'q4'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Q4 2026
              </button>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success('Exporting engineering performance CSV...')}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Completion Velocity
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {completionRate}%
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              {completedTasks} of {totalTasks} deliverables closed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Overdue Tasks
            </span>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {overdueTasks}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Requiring deadline rescheduling
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Sprint Hours
            </span>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              88 hrs
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Estimated engineering capacity
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Manufacturing Yield
            </span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              98.2%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              First-pass inspection tolerance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2 Charts Grid: Task Trends & Workload Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Trend */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Deliverable Burnup & Completion Trend</span>
              </CardTitle>
              <p className="text-xs text-slate-500">
                Cumulative completed tasks vs planned velocity
              </p>
            </div>
            <span className="text-[10px] text-slate-400">Weekly Cadence</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Planned" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Completed" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Workload Distribution */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Team Workload Distribution</span>
              </CardTitle>
              <p className="text-xs text-slate-500">
                Active work volume vs completed tasks per engineer
              </p>
            </div>
            <span className="text-[10px] text-slate-400">Current Sprint</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Project Progress Breakdowns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Project Health & Velocity Summaries</span>
          </CardTitle>
          <p className="text-xs text-slate-500">
            Computed execution percentages across all plant and software programs
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {proj.name} ({proj.key})
                  </span>
                  <Badge health={proj.health} />
                </div>
                <span className="text-slate-500">
                  {proj.completedTasks} / {proj.totalTasks} deliverables ({proj.progressPercentage}%)
                </span>
              </div>
              <ProgressBar value={proj.progressPercentage || 0} size="sm" variant="auto" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
