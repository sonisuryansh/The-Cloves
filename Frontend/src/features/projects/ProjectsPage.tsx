import React, { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SearchInput } from '@/components/common/SearchInput'
import { EmptyState } from '@/components/common/EmptyState'
import { Plus, LayoutGrid, List, Calendar, ArrowRight, ArrowUpDown, FolderGit2 } from 'lucide-react'
import { formatDate } from '@/lib/dates'
import { useNavigate } from 'react-router-dom'

export const ProjectsPage: React.FC = () => {
  const { getComputedProjects, setCreateProjectModalOpen } = useAppStore()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'deadline' | 'progress'>('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const projects = getComputedProjects()

  const filteredProjects = projects
    .filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.key.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'deadline') return a.dueDate.localeCompare(b.dueDate)
      if (sortBy === 'progress') return (b.progressPercentage || 0) - (a.progressPercentage || 0)
      return 0
    })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects & Programs"
        description="Comprehensive engineering programs, subsystem deliverables, and milestone tracking."
        actions={
          <Button
            size="sm"
            onClick={() => setCreateProjectModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Project
          </Button>
        }
      />

      {/* Filter and View Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search projects..."
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Plant Operations">Plant Operations</option>
              <option value="Research">Research</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'deadline' | 'progress')}
              className="h-8 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="name">Name</option>
              <option value="deadline">Target Deadline</option>
              <option value="progress">Completion Rate</option>
            </select>
          </div>

          {/* Grid vs List View Toggle */}
          <div className="flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
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
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {project.key}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <Badge health={project.health} />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Deliverables Progress
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {project.progressPercentage}% ({project.completedTasks}/{project.totalTasks})
                  </span>
                </div>

                <ProgressBar value={project.progressPercentage || 0} size="sm" variant="auto" />

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={project.owner.name} src={project.owner.avatar} size="xs" />
                    <span className="truncate max-w-[120px]">{project.owner.name}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due {formatDate(project.dueDate, 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List / Table View */}
      {viewMode === 'list' && (
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {project.key}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {project.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {project.category} • Milestone: {project.nextMilestone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 self-end sm:self-center">
                  <div className="w-32 hidden md:block">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>{project.completedTasks}/{project.totalTasks}</span>
                      <span className="font-semibold">{project.progressPercentage}%</span>
                    </div>
                    <ProgressBar value={project.progressPercentage || 0} size="sm" variant="auto" />
                  </div>

                  <Badge health={project.health} />

                  <span className="text-xs text-slate-500">
                    {formatDate(project.dueDate, 'MMM d')}
                  </span>

                  <Avatar name={project.owner.name} src={project.owner.avatar} size="xs" />

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <EmptyState
          icon={<FolderGit2 className="w-6 h-6" />}
          title="No projects match your filter"
          description="Try modifying search keywords or clear category filters to view all active initiatives."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('')
            setCategoryFilter('all')
            setStatusFilter('all')
          }}
        />
      )}
    </div>
  )
}
