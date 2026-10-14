/**
 * PulseCore Service & Repository Layer (Phase 12)
 * Decouples UI components from data sources.
 * Future backends can implement these interfaces without changing frontend UI code.
 */

import {
  Project,
  Task,
  ProductionOrder,
  EquipmentUnit,
  AIInsight,
  User,
  Workspace,
  TaskStatus,
  ActivityEvent
} from '@/types'
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_PRODUCTION_ORDERS,
  MOCK_EQUIPMENT,
  INITIAL_AI_INSIGHTS,
  MOCK_USERS,
  MOCK_WORKSPACES,
  INITIAL_ACTIVITIES
} from '@/mocks/mockData'
import { simulateNetworkDelay, ApiError } from './api-client'

// ============================================================================
// 1. Projects Service
// ============================================================================

export interface IProjectService {
  getProjects(): Promise<Project[]>
  getProjectById(id: string): Promise<Project | null>
  createProject(project: Omit<Project, 'id' | 'key' | 'health'>): Promise<Project>
  updateProject(id: string, updates: Partial<Project>): Promise<Project>
  deleteProject(id: string): Promise<boolean>
}

export class MockProjectService implements IProjectService {
  private projects: Project[] = JSON.parse(JSON.stringify(INITIAL_PROJECTS))

  async getProjects(): Promise<Project[]> {
    await simulateNetworkDelay()
    return JSON.parse(JSON.stringify(this.projects))
  }

  async getProjectById(id: string): Promise<Project | null> {
    await simulateNetworkDelay()
    const proj = this.projects.find((p) => p.id === id)
    return proj ? JSON.parse(JSON.stringify(proj)) : null
  }

  async createProject(project: Omit<Project, 'id' | 'key' | 'health'>): Promise<Project> {
    await simulateNetworkDelay()
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      key: project.name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X'),
      health: 'on-track'
    }
    this.projects.push(newProj)
    return JSON.parse(JSON.stringify(newProj))
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await simulateNetworkDelay()
    const index = this.projects.findIndex((p) => p.id === id)
    if (index === -1) throw new ApiError(`Project ${id} not found`, 404)
    this.projects[index] = { ...this.projects[index], ...updates }
    return JSON.parse(JSON.stringify(this.projects[index]))
  }

  async deleteProject(id: string): Promise<boolean> {
    await simulateNetworkDelay()
    const beforeCount = this.projects.length
    this.projects = this.projects.filter((p) => p.id !== id)
    return this.projects.length < beforeCount
  }
}

// ============================================================================
// 2. Tasks Service
// ============================================================================

export interface ITaskService {
  getTasks(): Promise<Task[]>
  getTasksByProject(projectId: string): Promise<Task[]>
  getTaskById(id: string): Promise<Task | null>
  createTask(task: Omit<Task, 'id' | 'key' | 'createdAt'>): Promise<Task>
  updateTask(id: string, updates: Partial<Task>): Promise<Task>
  updateTaskStatus(id: string, status: TaskStatus): Promise<Task>
  deleteTask(id: string): Promise<boolean>
  addTaskComment(taskId: string, user: User, text: string): Promise<Task>
}

export class MockTaskService implements ITaskService {
  private tasks: Task[] = JSON.parse(JSON.stringify(INITIAL_TASKS))

  async getTasks(): Promise<Task[]> {
    await simulateNetworkDelay()
    return JSON.parse(JSON.stringify(this.tasks))
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    await simulateNetworkDelay()
    const filtered = this.tasks.filter((t) => t.projectId === projectId)
    return JSON.parse(JSON.stringify(filtered))
  }

  async getTaskById(id: string): Promise<Task | null> {
    await simulateNetworkDelay()
    const task = this.tasks.find((t) => t.id === id)
    return task ? JSON.parse(JSON.stringify(task)) : null
  }

  async createTask(taskData: Omit<Task, 'id' | 'key' | 'createdAt'>): Promise<Task> {
    await simulateNetworkDelay()
    const count = this.tasks.filter((t) => t.projectId === taskData.projectId).length
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      key: `TSK-${100 + count + 1}`,
      createdAt: new Date().toISOString()
    }
    this.tasks.push(newTask)
    return JSON.parse(JSON.stringify(newTask))
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await simulateNetworkDelay()
    const index = this.tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new ApiError(`Task ${id} not found`, 404)
    this.tasks[index] = { ...this.tasks[index], ...updates }
    return JSON.parse(JSON.stringify(this.tasks[index]))
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    await simulateNetworkDelay()
    const index = this.tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new ApiError(`Task ${id} not found`, 404)
    this.tasks[index] = {
      ...this.tasks[index],
      status,
      completedAt: status === 'done' ? new Date().toISOString() : undefined
    }
    return JSON.parse(JSON.stringify(this.tasks[index]))
  }

  async deleteTask(id: string): Promise<boolean> {
    await simulateNetworkDelay()
    const initial = this.tasks.length
    this.tasks = this.tasks.filter((t) => t.id !== id)
    return this.tasks.length < initial
  }

  async addTaskComment(taskId: string, user: User, text: string): Promise<Task> {
    await simulateNetworkDelay()
    const index = this.tasks.findIndex((t) => t.id === taskId)
    if (index === -1) throw new ApiError(`Task ${taskId} not found`, 404)
    const newComment = {
      id: `c-${Date.now()}`,
      user,
      text,
      createdAt: new Date().toISOString()
    }
    const currentComments = this.tasks[index].comments || []
    this.tasks[index] = {
      ...this.tasks[index],
      comments: [...currentComments, newComment]
    }
    return JSON.parse(JSON.stringify(this.tasks[index]))
  }
}

// ============================================================================
// 3. Production Service
// ============================================================================

export interface IProductionService {
  getOrders(): Promise<ProductionOrder[]>
  getOrderById(id: string): Promise<ProductionOrder | null>
  updateOrderStatus(id: string, status: ProductionOrder['status']): Promise<ProductionOrder>
  getEquipment(): Promise<EquipmentUnit[]>
}

export class MockProductionService implements IProductionService {
  private orders: ProductionOrder[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTION_ORDERS))
  private equipment: EquipmentUnit[] = JSON.parse(JSON.stringify(MOCK_EQUIPMENT))

  async getOrders(): Promise<ProductionOrder[]> {
    await simulateNetworkDelay()
    return JSON.parse(JSON.stringify(this.orders))
  }

  async getOrderById(id: string): Promise<ProductionOrder | null> {
    await simulateNetworkDelay()
    const order = this.orders.find((o) => o.id === id)
    return order ? JSON.parse(JSON.stringify(order)) : null
  }

  async updateOrderStatus(id: string, status: ProductionOrder['status']): Promise<ProductionOrder> {
    await simulateNetworkDelay()
    const index = this.orders.findIndex((o) => o.id === id)
    if (index === -1) throw new ApiError(`Production order ${id} not found`, 404)
    this.orders[index] = { ...this.orders[index], status }
    return JSON.parse(JSON.stringify(this.orders[index]))
  }

  async getEquipment(): Promise<EquipmentUnit[]> {
    await simulateNetworkDelay()
    return JSON.parse(JSON.stringify(this.equipment))
  }
}

// ============================================================================
// 4. AI Insights Service
// ============================================================================

export interface IInsightsService {
  getInsights(): Promise<AIInsight[]>
  markReviewed(id: string): Promise<AIInsight>
  dismissInsight(id: string): Promise<boolean>
}

export class MockInsightsService implements IInsightsService {
  private insights: AIInsight[] = JSON.parse(JSON.stringify(INITIAL_AI_INSIGHTS))

  async getInsights(): Promise<AIInsight[]> {
    await simulateNetworkDelay()
    return JSON.parse(JSON.stringify(this.insights))
  }

  async markReviewed(id: string): Promise<AIInsight> {
    await simulateNetworkDelay()
    const index = this.insights.findIndex((i) => i.id === id)
    if (index === -1) throw new ApiError(`Insight ${id} not found`, 404)
    this.insights[index] = { ...this.insights[index], isReviewed: true }
    return JSON.parse(JSON.stringify(this.insights[index]))
  }

  async dismissInsight(id: string): Promise<boolean> {
    await simulateNetworkDelay()
    const initial = this.insights.length
    this.insights = this.insights.filter((i) => i.id !== id)
    return this.insights.length < initial
  }
}

// ============================================================================
// 5. Team & Workspace Service
// ============================================================================

export interface ITeamService {
  getTeamMembers(): Promise<User[]>
  inviteMember(user: User): Promise<User>
  updateMemberRole(userId: string, role: string, permissions: string[]): Promise<User>
}

export class MockTeamService implements ITeamService {
  private members: User[] = JSON.parse(JSON.stringify(MOCK_USERS))

  async getTeamMembers(): Promise<User[]> {
    await simulateNetworkDelay()
    return JSON.parse(JSON.stringify(this.members))
  }

  async inviteMember(user: User): Promise<User> {
    await simulateNetworkDelay()
    this.members.push(user)
    return JSON.parse(JSON.stringify(user))
  }

  async updateMemberRole(userId: string, role: string, permissions: string[]): Promise<User> {
    await simulateNetworkDelay()
    const index = this.members.findIndex((m) => m.id === userId)
    if (index === -1) throw new ApiError(`User ${userId} not found`, 404)
    this.members[index] = { ...this.members[index], role, permissions }
    return JSON.parse(JSON.stringify(this.members[index]))
  }
}

export interface IWorkspaceService {
  getWorkspaces(): Promise<Workspace[]>
  updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace>
  exportWorkspaceData(): Promise<string>
}

export class MockWorkspaceService implements IWorkspaceService {
  private workspaces: Workspace[] = JSON.parse(JSON.stringify(MOCK_WORKSPACES))

  async getWorkspaces(): Promise<Workspace[]> {
    await simulateNetworkDelay()
    return JSON.parse(JSON.stringify(this.workspaces))
  }

  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace> {
    await simulateNetworkDelay()
    const index = this.workspaces.findIndex((w) => w.id === id)
    if (index === -1) throw new ApiError(`Workspace ${id} not found`, 404)
    this.workspaces[index] = { ...this.workspaces[index], ...updates }
    return JSON.parse(JSON.stringify(this.workspaces[index]))
  }

  async exportWorkspaceData(): Promise<string> {
    await simulateNetworkDelay()
    const dump = {
      exportedAt: new Date().toISOString(),
      platform: 'PulseCore AI Project Control & Monitoring',
      version: '1.0.0',
      workspaces: this.workspaces,
      projects: INITIAL_PROJECTS,
      tasks: INITIAL_TASKS,
      productionOrders: INITIAL_PRODUCTION_ORDERS,
      aiInsights: INITIAL_AI_INSIGHTS,
      teamMembers: MOCK_USERS
    }
    return JSON.stringify(dump, null, 2)
  }
}

// Singletons for global application use
export const projectService: IProjectService = new MockProjectService()
export const taskService: ITaskService = new MockTaskService()
export const productionService: IProductionService = new MockProductionService()
export const insightsService: IInsightsService = new MockInsightsService()
export const teamService: ITeamService = new MockTeamService()
export const workspaceService: IWorkspaceService = new MockWorkspaceService()

export * from './api-client'
