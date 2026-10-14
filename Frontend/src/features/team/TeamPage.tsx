import React, { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { useAppStore } from '@/stores/useAppStore'
import { InviteMemberModal } from './InviteMemberModal'
import { User } from '@/types'
import {
  UserPlus,
  Mail,
  Search,
  Users,
  Shield,
  Briefcase,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'

const DEPARTMENTS = [
  'All Departments',
  'Engineering',
  'Software Architecture',
  'Production Control',
  'Hardware & Firmware',
  'Quality Engineering'
] as const

export const TeamPage: React.FC = () => {
  const { teamMembers, addTeamMember, tasks } = useAppStore()
  const [isInviteModalOpen, setInviteModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState<string>('All Departments')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'invited'>('all')

  // Filtered members
  const filteredMembers = teamMembers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDept =
      selectedDept === 'All Departments' || user.department === selectedDept

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && user.status !== 'invited') ||
      (selectedStatus === 'invited' && user.status === 'invited')

    return matchesSearch && matchesDept && matchesStatus
  })

  // Summary counts
  const totalCount = teamMembers.length
  const activeCount = teamMembers.filter((m) => m.status !== 'invited').length
  const invitedCount = teamMembers.filter((m) => m.status === 'invited').length
  const totalAssignedTasks = tasks.filter((t) => t.assignee && t.status !== 'done').length

  const getDeptBadgeColor = (dept?: string) => {
    switch (dept) {
      case 'Engineering':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
      case 'Software Architecture':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
      case 'Production Control':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
      case 'Hardware & Firmware':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
      case 'Quality Engineering':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Directory & Workspace Roles"
        description="Manage cross-functional teams across engineering, manufacturing operations, and quality assurance."
        actions={
          <Button
            size="sm"
            onClick={() => setInviteModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Invite Member
          </Button>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Total Roster</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Active Staff</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{activeCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Pending Invites</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{invitedCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Active Tasks</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalAssignedTasks}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name, email, or role title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Dept:</span>
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="invited">Invited Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((user) => {
          const userTasks = tasks.filter((t) => t.assignee?.id === user.id && t.status !== 'done')
          const urgentTasks = userTasks.filter((t) => t.priority === 'urgent')
          const isInvited = user.status === 'invited'

          return (
            <Card
              key={user.id}
              className="p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <Avatar
                      name={user.name}
                      src={user.avatar}
                      size="lg"
                      status={isInvited ? 'offline' : 'online'}
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {user.name}
                        </h4>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate mt-0.5">
                        {user.role}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${getDeptBadgeColor(
                            user.department
                          )}`}
                        >
                          {user.department || 'General'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      isInvited
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {isInvited ? 'Invited' : 'Active'}
                  </span>
                </div>

                {/* Permissions & Roles Chips */}
                {user.permissions && user.permissions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      <Shield className="w-3 h-3 text-slate-400" />
                      <span>Workspace Rights</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.slice(0, 3).map((perm, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {perm}
                        </span>
                      ))}
                      {user.permissions.length > 3 && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                          +{user.permissions.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Email & Task Load */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[130px]">{user.email}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-semibold ${
                      urgentTasks.length > 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {userTasks.length} active {userTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                  {urgentTasks.length > 0 && (
                    <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded">
                      {urgentTasks.length} urgent
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="p-8 text-center text-slate-400">
          <p className="text-sm font-medium">No team members match your current filters.</p>
        </Card>
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={(newUser) => {
          addTeamMember(newUser)
        }}
      />
    </div>
  )
}
