import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'
import { GlobalSearchModal } from '@/components/common/GlobalSearchModal'
import { CreateTaskModal } from '@/components/forms/CreateTaskModal'
import { CreateProjectModal } from '@/components/forms/CreateProjectModal'
import { TaskDetailDrawer } from '@/features/tasks/TaskDetailDrawer'
import { Toaster } from 'sonner'
import { useAppStore } from '@/stores/useAppStore'
import { X } from 'lucide-react'

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { theme } = useAppStore()

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-72 bg-white dark:bg-slate-900 z-10 shadow-2xl">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main App Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopHeader onMobileMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Interactive Overlays */}
      <GlobalSearchModal />
      <CreateTaskModal />
      <CreateProjectModal />
      <TaskDetailDrawer />
      <Toaster
        theme={theme}
        position="bottom-right"
        richColors
        closeButton
      />
    </div>
  )
}
