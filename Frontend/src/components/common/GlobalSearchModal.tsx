import React, { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { useAppStore } from '@/stores/useAppStore'
import { Search, FolderGit2, CheckSquare, Cpu, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setSearchModalOpen,
    projects,
    tasks,
    productionOrders,
    setSelectedTaskId
  } = useAppStore()

  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSearchModalOpen])

  if (!isSearchModalOpen) return null

  const cleanQuery = query.toLowerCase().trim()

  const filteredTasks = tasks.filter(
    (t) =>
      !cleanQuery ||
      t.title.toLowerCase().includes(cleanQuery) ||
      t.key.toLowerCase().includes(cleanQuery) ||
      t.projectName.toLowerCase().includes(cleanQuery)
  ).slice(0, 4)

  const filteredProjects = projects.filter(
    (p) =>
      !cleanQuery ||
      p.name.toLowerCase().includes(cleanQuery) ||
      p.key.toLowerCase().includes(cleanQuery) ||
      p.description.toLowerCase().includes(cleanQuery)
  ).slice(0, 3)

  const filteredOrders = productionOrders.filter(
    (o) =>
      !cleanQuery ||
      o.product.toLowerCase().includes(cleanQuery) ||
      o.orderNumber.toLowerCase().includes(cleanQuery)
  ).slice(0, 3)

  return (
    <Dialog
      isOpen={isSearchModalOpen}
      onClose={() => {
        setSearchModalOpen(false)
        setQuery('')
      }}
      maxWidth="md"
      className="p-0 overflow-hidden"
    >
      <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a task key, project name, or order..."
          autoFocus
          className="w-full text-sm bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
        />
        <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] text-slate-400 font-mono">
          ESC
        </kbd>
      </div>

      <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
        {/* Tasks Section */}
        {filteredTasks.length > 0 && (
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Tasks ({filteredTasks.length})
            </div>
            <div className="mt-1 space-y-1">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSearchModalOpen(false)
                    setSelectedTaskId(task.id)
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-mono font-medium text-slate-500 dark:text-slate-400 shrink-0">
                      {task.key}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge status={task.status} />
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {filteredProjects.length > 0 && (
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Projects ({filteredProjects.length})
            </div>
            <div className="mt-1 space-y-1">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSearchModalOpen(false)
                    navigate('/projects')
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {proj.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge health={proj.health} />
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Production Orders Section */}
        {filteredOrders.length > 0 && (
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Production Orders ({filteredOrders.length})
            </div>
            <div className="mt-1 space-y-1">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => {
                    setSearchModalOpen(false)
                    navigate('/production')
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Cpu className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-mono text-slate-500">{ord.orderNumber}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {ord.product}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">{ord.plantLine}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredTasks.length === 0 && filteredProjects.length === 0 && filteredOrders.length === 0 && (
          <div className="py-8 text-center text-slate-400">
            No matching items found for "{query}"
          </div>
        )}
      </div>
    </Dialog>
  )
}
