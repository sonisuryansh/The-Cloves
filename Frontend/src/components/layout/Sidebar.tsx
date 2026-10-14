import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  FolderGit2,
  Calendar,
  Cpu,
  BrainCircuit,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Zap,
  Building2,
  Plus
} from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

export const Sidebar: React.FC = () => {
  const {
    sidebarCollapsed,
    toggleSidebar,
    currentWorkspace,
    workspaces,
    setCurrentWorkspace,
    tasks,
    currentUser,
    setCreateProjectModalOpen
  } = useAppStore()

  const location = useLocation()

  // Badge counts
  const myOpenTasksCount = tasks.filter(
    (t) => t.assignee?.id === currentUser.id && t.status !== 'done'
  ).length

  const navigationSections = [
    {
      title: 'Workspace',
      items: [
        {
          label: 'Overview',
          path: '/',
          icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
          badge: undefined
        },
        {
          label: 'My Tasks',
          path: '/tasks',
          icon: <CheckSquare className="w-4 h-4 shrink-0" />,
          badge: myOpenTasksCount > 0 ? myOpenTasksCount : undefined
        },
        {
          label: 'Projects',
          path: '/projects',
          icon: <FolderGit2 className="w-4 h-4 shrink-0" />
        },
        {
          label: 'Calendar',
          path: '/calendar',
          icon: <Calendar className="w-4 h-4 shrink-0" />
        }
      ]
    },
    {
      title: 'Operations',
      items: [
        {
          label: 'Production Control',
          path: '/production',
          icon: <Cpu className="w-4 h-4 shrink-0 text-emerald-500" />
        },
        {
          label: 'AI Insights',
          path: '/insights',
          icon: <BrainCircuit className="w-4 h-4 shrink-0 text-indigo-500" />,
          badge: 'AI'
        },
        {
          label: 'Reports',
          path: '/reports',
          icon: <BarChart3 className="w-4 h-4 shrink-0" />
        }
      ]
    },
    {
      title: 'Administration',
      items: [
        {
          label: 'Team Members',
          path: '/team',
          icon: <Users className="w-4 h-4 shrink-0" />
        },
        {
          label: 'Settings',
          path: '/settings',
          icon: <Settings className="w-4 h-4 shrink-0" />
        }
      ]
    }
  ]

  const workspaceMenuItems = [
    ...workspaces.map((ws) => ({
      label: (
        <div className="flex flex-col py-0.5">
          <span className="font-medium text-slate-800 dark:text-slate-200">{ws.name}</span>
          <span className="text-[10px] text-slate-400">{ws.plan} • {ws.membersCount} members</span>
        </div>
      ),
      onClick: () => setCurrentWorkspace(ws),
      icon: <Building2 className="w-4 h-4" />
    })),
    { divider: true, label: '' },
    {
      label: 'Create Workspace...',
      icon: <Plus className="w-4 h-4" />,
      onClick: () => setCreateProjectModalOpen(true)
    }
  ]

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 transition-all duration-300 z-30 select-none shrink-0',
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Brand & Workspace Switcher Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                  The Cloves
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  PPM & Production
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Workspace Switcher */}
        {!sidebarCollapsed ? (
          <DropdownMenu
            align="left"
            trigger={
              <div className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span className="truncate">{currentWorkspace.name}</span>
                </div>
                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            }
            items={workspaceMenuItems}
            className="w-60"
          />
        ) : (
          <div
            className="flex items-center justify-center py-1 cursor-pointer"
            title={currentWorkspace.name}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!sidebarCollapsed && (
              <h4 className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {section.title}
              </h4>
            )}
            {section.items.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative group',
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                  )}
                >
                  {item.icon}
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  {!sidebarCollapsed && item.badge !== undefined && (
                    <span
                      className={cn(
                        'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                        item.badge === 'AI'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {/* Tooltip for collapsed mode */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-md">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        <NavLink
          to="/settings"
          className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <Avatar
            name={currentUser.name}
            src={currentUser.avatar}
            size="sm"
            status="online"
          />
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {currentUser.role}
              </span>
            </div>
          )}
        </NavLink>
      </div>
    </aside>
  )
}
