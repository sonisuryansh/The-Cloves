import React, { useState } from 'react'
import {
  Search,
  Bell,
  Plus,
  Menu,
  CheckCircle2,
  FolderPlus,
  FileCheck2,
  AlertTriangle,
  User,
  Settings as SettingsIcon,
  LogOut,
  Info
} from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const TopHeader: React.FC<{ onMobileMenuClick?: () => void }> = ({
  onMobileMenuClick
}) => {
  const {
    currentUser,
    setCreateTaskModalOpen,
    setCreateProjectModalOpen,
    setSearchModalOpen,
    aiInsights
  } = useAppStore()

  const location = useLocation()
  const navigate = useNavigate()
  const [unreadNotifications, setUnreadNotifications] = useState(aiInsights.length + 1)
  const [showNotifications, setShowNotifications] = useState(false)

  // Derive breadcrumbs based on location
  const pathParts = location.pathname.split('/').filter(Boolean)
  const breadcrumbItems = pathParts.length === 0
    ? [{ label: 'Overview' }]
    : pathParts.map((part, index) => {
        const href = `/${pathParts.slice(0, index + 1).join('/')}`
        const formatted = part
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
        return { label: formatted, href }
      })

  const createMenuItems = [
    {
      label: (
        <div className="flex flex-col py-0.5">
          <span className="font-semibold text-slate-800 dark:text-slate-100">New Task</span>
          <span className="text-[10px] text-slate-400">Add an issue, bug, or action item</span>
        </div>
      ),
      icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />,
      onClick: () => setCreateTaskModalOpen(true)
    },
    {
      label: (
        <div className="flex flex-col py-0.5">
          <span className="font-semibold text-slate-800 dark:text-slate-100">New Project</span>
          <span className="text-[10px] text-slate-400">Initialize initiative or subassembly</span>
        </div>
      ),
      icon: <FolderPlus className="w-4 h-4 text-indigo-500" />,
      onClick: () => setCreateProjectModalOpen(true)
    },
    {
      label: (
        <div className="flex flex-col py-0.5">
          <span className="font-semibold text-slate-800 dark:text-slate-100">Log Production Order</span>
          <span className="text-[10px] text-slate-400">Register plant floor work order</span>
        </div>
      ),
      icon: <FileCheck2 className="w-4 h-4 text-emerald-500" />,
      onClick: () => {
        toast.info('Production order wizard is available in Phase 8 (Production Control module)')
        navigate('/production')
      }
    }
  ]

  const userMenuItems = [
    {
      label: 'Signed in as ' + currentUser.name,
      disabled: true,
      icon: <User className="w-4 h-4" />
    },
    { divider: true, label: '' },
    {
      label: 'Account & Preferences',
      icon: <SettingsIcon className="w-4 h-4" />,
      onClick: () => navigate('/settings')
    },
    {
      label: 'Keyboard Shortcuts (Ctrl+K)',
      icon: <Search className="w-4 h-4" />,
      onClick: () => setSearchModalOpen(true)
    },
    { divider: true, label: '' },
    {
      label: 'Switch Workspace Demo',
      icon: <Info className="w-4 h-4" />,
      onClick: () => toast.info('Local Prototype Sandbox: All workspaces switch instantly via the sidebar switcher.')
    },
    {
      label: 'Sign Out (Demo)',
      destructive: true,
      icon: <LogOut className="w-4 h-4" />,
      onClick: () => toast.info('Prototype session preserved locally.')
    }
  ]

  return (
    <header className="h-14 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left Area: Mobile menu & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Middle/Right Area: Search, Theme, Notifications, Create, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search trigger bar */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex items-center gap-2 h-8 px-2.5 sm:px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-all w-28 sm:w-56"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate text-left hidden sm:inline">Search tasks, projects...</span>
          <span className="truncate text-left sm:hidden">Search...</span>
          <kbd className="ml-auto hidden sm:inline-flex items-center px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications & AI Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in-0 zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Notifications & Insights ({unreadNotifications})
                </span>
                <button
                  onClick={() => {
                    setUnreadNotifications(0)
                    toast.success('All notifications marked as read')
                  }}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto mt-2">
                {aiInsights.slice(0, 3).map((ins) => (
                  <div
                    key={ins.id}
                    className="py-2.5 px-1 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setShowNotifications(false)
                      navigate('/insights')
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-600 shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {ins.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {ins.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prominent Create Button */}
        <DropdownMenu
          align="right"
          trigger={
            <Button
              size="sm"
              className="font-medium shadow-xs"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              <span>Create</span>
            </Button>
          }
          items={createMenuItems}
          className="w-64"
        />

        {/* User Profile */}
        <DropdownMenu
          align="right"
          trigger={
            <div className="cursor-pointer pl-1">
              <Avatar
                name={currentUser.name}
                src={currentUser.avatar}
                size="sm"
              />
            </div>
          }
          items={userMenuItems}
          className="w-56"
        />
      </div>
    </header>
  )
}
