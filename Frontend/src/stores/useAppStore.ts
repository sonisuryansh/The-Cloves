import { create } from 'zustand'
import {
  Project,
  Task,
  ProductionOrder,
  AIInsight,
  ActivityEvent,
  Workspace,
  User,
  TaskStatus,
  TaskPriority,
  TaskAttachment
} from '@/types'
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_AI_INSIGHTS,
  INITIAL_ACTIVITIES,
  MOCK_WORKSPACES,
  MOCK_USERS,
  CURRENT_USER,
  PROJECT_TEMPLATES
} from '@/mocks/mockData'
import { isToday, isTomorrow, parseISO } from 'date-fns'

interface AppState {
  // Theme & Layout
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  toggleTheme: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Workspaces & Auth
  currentWorkspace: Workspace
  workspaces: Workspace[]
  currentUser: User
  setCurrentWorkspace: (workspace: Workspace) => void

  // Core Data
  projects: Project[]
  tasks: Task[]
  productionOrders: ProductionOrder[]
  aiInsights: AIInsight[]
  activities: ActivityEvent[]
  teamMembers: User[]

  // Modals & Panels
  isCreateTaskModalOpen: boolean
  isCreateProjectModalOpen: boolean
  isSearchModalOpen: boolean
  isNotificationsOpen: boolean
  selectedTaskId: string | null

  setCreateTaskModalOpen: (open: boolean) => void
  setCreateProjectModalOpen: (open: boolean) => void
  setSearchModalOpen: (open: boolean) => void
  setNotificationsOpen: (open: boolean) => void
  setSelectedTaskId: (taskId: string | null) => void

  // Actions
  addTask: (task: Omit<Task, 'id' | 'key' | 'createdAt' | 'comments' | 'subtasks'>) => Task
  updateTask: (taskId: string, updates: Partial<Task>) => void
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  moveTaskInKanban: (activeId: string, overId: string, targetStatus?: TaskStatus) => void
  deleteTask: (taskId: string) => void
  addTaskComment: (taskId: string, text: string) => void
  toggleTaskSubtask: (taskId: string, subtaskId: string) => void
  addTaskAttachment: (taskId: string, file: { name: string; sizeBytes: number; fileType: string }) => void
  deleteTaskAttachment: (taskId: string, attachmentId: string) => void

  addProject: (project: Omit<Project, 'id' | 'key' | 'health'>) => Project
  createProjectFromTemplate: (templateId: string, name: string, description: string, dueDate: string) => Project
  updateProject: (projectId: string, updates: Partial<Project>) => void
  deleteProject: (projectId: string) => void

  markInsightReviewed: (insightId: string) => void
  dismissInsight: (insightId: string) => void

  updateProductionOrderStatus: (orderId: string, status: ProductionOrder['status']) => void
  addTeamMember: (user: User) => void

  // Selectors / Computeds
  getProjectById: (id: string) => Project | undefined
  getComputedProjects: () => Project[]
  getMyTasks: () => Task[]
  getDashboardKPIs: () => {
    activeProjects: number
    openTasks: number
    dueSoon: number
    completedThisWeek: number
    atRiskProjects: number
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial UI state
  theme: 'light',
  sidebarCollapsed: false,
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light'
      if (typeof document !== 'undefined') {
        const root = document.documentElement
        if (nextTheme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
      return { theme: nextTheme }
    })
  },
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

  // Initial Workspace
  currentWorkspace: MOCK_WORKSPACES[0],
  workspaces: MOCK_WORKSPACES,
  currentUser: CURRENT_USER,
  setCurrentWorkspace: (workspace: Workspace) => set({ currentWorkspace: workspace }),

  // Initial Data
  projects: INITIAL_PROJECTS,
  tasks: INITIAL_TASKS,
  productionOrders: INITIAL_PRODUCTION_ORDERS,
  aiInsights: INITIAL_AI_INSIGHTS,
  activities: INITIAL_ACTIVITIES,
  teamMembers: MOCK_USERS,

  // Modals
  isCreateTaskModalOpen: false,
  isCreateProjectModalOpen: false,
  isSearchModalOpen: false,
  isNotificationsOpen: false,
  selectedTaskId: null,

  setCreateTaskModalOpen: (open) => set({ isCreateTaskModalOpen: open }),
  setCreateProjectModalOpen: (open) => set({ isCreateProjectModalOpen: open }),
  setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),
  setNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),

  // Task Actions
  addTask: (taskData) => {
    const state = get()
    const targetProject = state.projects.find((p) => p.id === taskData.projectId)
    const projectKey = targetProject?.key || 'TSK'
    const nextNum = state.tasks.filter((t) => t.projectId === taskData.projectId).length + 101
    const newId = `task-${Date.now()}`

    const newTask: Task = {
      ...taskData,
      id: newId,
      key: `${projectKey}-${nextNum}`,
      projectName: targetProject?.name || taskData.projectName,
      comments: [],
      subtasks: [],
      attachments: [],
      createdAt: new Date().toISOString()
    }

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      user: state.currentUser,
      action: 'created task',
      targetType: 'task',
      targetTitle: `${newTask.key}: ${newTask.title}`,
      targetId: newTask.id,
      timestamp: new Date().toISOString()
    }

    set((s) => ({
      tasks: [newTask, ...s.tasks],
      activities: [newActivity, ...s.activities]
    }))

    return newTask
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    }))
  },

  updateTaskStatus: (taskId, status) => {
    const state = get()
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task) return

    const completedAt = status === 'done' ? new Date().toISOString() : undefined

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      user: state.currentUser,
      action: `moved task to ${status.replace('_', ' ')}:`,
      targetType: 'task',
      targetTitle: `${task.key}: ${task.title}`,
      targetId: task.id,
      timestamp: new Date().toISOString()
    }

    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, status, completedAt: completedAt ?? (status !== 'done' ? undefined : t.completedAt) } : t
      ),
      activities: [newActivity, ...s.activities]
    }))
  },

  moveTaskInKanban: (activeId, overId, targetStatus) => {
    const state = get()
    const activeTask = state.tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    let nextStatus = activeTask.status
    if (targetStatus && targetStatus !== activeTask.status) {
      nextStatus = targetStatus
    }

    // Check if over is another task
    const overTask = state.tasks.find((t) => t.id === overId)
    if (overTask && overTask.status !== activeTask.status) {
      nextStatus = overTask.status
    }

    const completedAt = nextStatus === 'done' ? new Date().toISOString() : undefined

    const updatedTasks = [...state.tasks]
    const activeIndex = updatedTasks.findIndex((t) => t.id === activeId)
    const overIndex = updatedTasks.findIndex((t) => t.id === overId)

    // Update status
    updatedTasks[activeIndex] = {
      ...updatedTasks[activeIndex],
      status: nextStatus,
      completedAt
    }

    // If dropped over another task, reorder
    if (overIndex !== -1 && activeIndex !== overIndex) {
      const [moved] = updatedTasks.splice(activeIndex, 1)
      updatedTasks.splice(overIndex, 0, moved)
    }

    // Log activity if status changed
    let nextActivities = state.activities
    if (nextStatus !== activeTask.status) {
      const newActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        user: state.currentUser,
        action: `moved board card to ${nextStatus.replace('_', ' ')}:`,
        targetType: 'task',
        targetTitle: `${activeTask.key}: ${activeTask.title}`,
        targetId: activeTask.id,
        timestamp: new Date().toISOString()
      }
      nextActivities = [newActivity, ...state.activities]
    }

    set({ tasks: updatedTasks, activities: nextActivities })
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
      selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId
    }))
  },

  addTaskComment: (taskId, text) => {
    const state = get()
    const newComment = {
      id: `comm-${Date.now()}`,
      user: state.currentUser,
      text,
      createdAt: new Date().toISOString()
    }

    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t
      )
    }))
  },

  toggleTaskSubtask: (taskId, subtaskId) => {
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== taskId) return t
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          )
        }
      })
    }))
  },

  addTaskAttachment: (taskId, file) => {
    const newAtt: TaskAttachment = {
      id: `att-${Date.now()}`,
      name: file.name,
      sizeBytes: file.sizeBytes,
      uploadedAt: new Date().toISOString(),
      fileType: file.fileType
    }
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, attachments: [...(t.attachments || []), newAtt] } : t
      )
    }))
  },

  deleteTaskAttachment: (taskId, attachmentId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, attachments: (t.attachments || []).filter((a) => a.id !== attachmentId) }
          : t
      )
    }))
  },

  // Project Actions
  addProject: (projectData) => {
    const state = get()
    const key = projectData.name
      .replace(/[^A-Za-z0-9]/g, '')
      .substring(0, 4)
      .toUpperCase() || 'PRJ'
    const newId = `proj-${Date.now()}`

    const newProject: Project = {
      ...projectData,
      id: newId,
      key,
      health: 'on-track'
    }

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      user: state.currentUser,
      action: 'created project',
      targetType: 'project',
      targetTitle: newProject.name,
      targetId: newProject.id,
      timestamp: new Date().toISOString()
    }

    set((s) => ({
      projects: [newProject, ...s.projects],
      activities: [newActivity, ...s.activities]
    }))

    return newProject
  },

  createProjectFromTemplate: (templateId, name, description, dueDate) => {
    const state = get()
    const template = PROJECT_TEMPLATES.find((t) => t.id === templateId) || PROJECT_TEMPLATES[0]
    const key = name
      .replace(/[^A-Za-z0-9]/g, '')
      .substring(0, 4)
      .toUpperCase() || 'TMPL'
    const newId = `proj-${Date.now()}`

    const newProject: Project = {
      id: newId,
      key,
      name,
      description: description || template.description,
      category: template.category,
      status: 'active',
      health: 'on-track',
      owner: state.currentUser,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || '2026-12-31',
      nextMilestone: template.initialTaskTitles[0] || 'Phase 1 Architecture Review',
      tags: [...template.tags]
    }

    // Generate starter tasks from template
    const starterTasks: Task[] = template.initialTaskTitles.map((title, idx) => ({
      id: `task-${Date.now()}-${idx}`,
      key: `${key}-${101 + idx}`,
      projectId: newId,
      projectName: name,
      title,
      description: `Deliverable generated from ${template.name} template standard engineering procedure.`,
      status: idx === 0 ? 'in_progress' : 'todo',
      priority: idx === 0 ? 'high' : 'medium',
      assignee: state.currentUser,
      reporter: state.currentUser,
      startDate: new Date().toISOString().split('T')[0],
      dueDate,
      labels: [template.category, 'Template'],
      subtasks: [
        { id: `st-init-${idx}-1`, title: 'Draft technical specifications', completed: idx === 0 },
        { id: `st-init-${idx}-2`, title: 'Execute verification test plan', completed: false }
      ],
      dependencies: [],
      comments: [],
      attachments: [],
      estimatedHours: 12,
      createdAt: new Date().toISOString()
    }))

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      user: state.currentUser,
      action: `instantiated project from template "${template.name}":`,
      targetType: 'project',
      targetTitle: newProject.name,
      targetId: newProject.id,
      timestamp: new Date().toISOString()
    }

    set((s) => ({
      projects: [newProject, ...s.projects],
      tasks: [...starterTasks, ...s.tasks],
      activities: [newActivity, ...s.activities]
    }))

    return newProject
  },

  updateProject: (projectId, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
    }))
  },

  deleteProject: (projectId) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
      tasks: state.tasks.filter((t) => t.projectId !== projectId)
    }))
  },

  // Insight Actions
  markInsightReviewed: (insightId) => {
    set((state) => ({
      aiInsights: state.aiInsights.map((ins) =>
        ins.id === insightId ? { ...ins, isReviewed: true } : ins
      )
    }))
  },

  dismissInsight: (insightId) => {
    set((state) => ({
      aiInsights: state.aiInsights.filter((ins) => ins.id !== insightId)
    }))
  },

  updateProductionOrderStatus: (orderId, status) => {
    set((state) => ({
      productionOrders: state.productionOrders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      )
    }))
  },

  addTeamMember: (user) => {
    set((state) => ({
      teamMembers: [...state.teamMembers, user]
    }))
  },

  // Selectors & Computeds
  getProjectById: (id) => {
    return get().projects.find((p) => p.id === id)
  },

  getComputedProjects: () => {
    const { projects, tasks } = get()
    return projects.map((project) => {
      const projectTasks = tasks.filter((t) => t.projectId === project.id)
      const totalTasks = projectTasks.length
      const completedTasks = projectTasks.filter((t) => t.status === 'done').length
      const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

      // Derive health dynamically if any blocker or high overdue task
      let computedHealth = project.health
      const hasBlocker = projectTasks.some((t) => t.priority === 'urgent' && t.status !== 'done')
      if (hasBlocker && progressPercentage < 50) {
        computedHealth = 'at-risk'
      } else if (progressPercentage >= 80) {
        computedHealth = 'on-track'
      }

      return {
        ...project,
        totalTasks,
        completedTasks,
        progressPercentage,
        health: computedHealth
      }
    })
  },

  getMyTasks: () => {
    const { tasks, currentUser } = get()
    return tasks
      .filter((t) => t.assignee?.id === currentUser.id)
      .sort((a, b) => {
        const weight: Record<TaskPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 }
        if (a.status === 'done' && b.status !== 'done') return 1
        if (a.status !== 'done' && b.status === 'done') return -1
        return weight[b.priority] - weight[a.priority]
      })
  },

  getDashboardKPIs: () => {
    const { projects, tasks } = get()
    const activeProjects = projects.filter((p) => p.status === 'active').length
    const openTasks = tasks.filter((t) => t.status !== 'done').length

    const dueSoon = tasks.filter((t) => {
      if (t.status === 'done' || !t.dueDate) return false
      try {
        const d = parseISO(t.dueDate)
        return isToday(d) || isTomorrow(d)
      } catch {
        return false
      }
    }).length

    const completedThisWeek = tasks.filter((t) => t.status === 'done').length
    const atRiskProjects = projects.filter((p) => p.health === 'at-risk').length

    return {
      activeProjects,
      openTasks,
      dueSoon,
      completedThisWeek,
      atRiskProjects
    }
  }
}))
