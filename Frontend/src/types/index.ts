export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: string
  status?: 'active' | 'invited' | 'away'
  joinedDate?: string
  permissions?: string[]
}

export type ProjectHealth = 'on-track' | 'needs-review' | 'at-risk'
export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'planning'
export type ProjectCategory = 'Software' | 'Hardware' | 'Plant Operations' | 'Research'

export interface Project {
  id: string
  key: string
  name: string
  description: string
  category: ProjectCategory
  status: ProjectStatus
  health: ProjectHealth
  owner: User
  startDate: string
  dueDate: string
  nextMilestone: string
  tags: string[]
  // Dynamic metrics derived from tasks
  totalTasks?: number
  completedTasks?: number
  progressPercentage?: number
}

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: ProjectCategory
  tags: string[]
  initialTaskTitles: string[]
}

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskSubtask {
  id: string
  title: string
  completed: boolean
}

export interface TaskComment {
  id: string
  user: User
  text: string
  createdAt: string
}

export interface TaskAttachment {
  id: string
  name: string
  sizeBytes: number
  uploadedAt: string
  fileType: string
}

export interface Task {
  id: string
  key: string
  projectId: string
  projectName: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: User
  reporter: User
  startDate?: string
  dueDate?: string
  labels: string[]
  subtasks: TaskSubtask[]
  dependencies: string[]
  comments: TaskComment[]
  attachments?: TaskAttachment[]
  estimatedHours?: number
  completedAt?: string
  createdAt: string
  order?: number // For Kanban column positioning
}

export type ProductionOrderStatus = 'scheduled' | 'running' | 'delayed' | 'completed'

export interface ProductionStage {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  durationHours: number
  completedPercentage: number
}

export interface ProductionOrder {
  id: string
  orderNumber: string
  product: string
  plantLine: string
  status: ProductionOrderStatus
  targetQuantity: number
  producedQuantity: number
  unit: string
  plannedStart: string
  plannedEnd: string
  actualStart?: string
  responsibleTeam: string
  delayReason?: string
  anomalyDetected?: boolean
  stages?: ProductionStage[]
  batchQualityScore?: number
  scrapCount?: number
}

export interface EquipmentUnit {
  id: string
  name: string
  line: string
  status: 'operational' | 'maintenance' | 'warning' | 'idle'
  efficiency: number // percentage e.g. 94.2
  temperatureC: number
  vibrationMmS: number
  operatingHours: number
  lastMaintenance: string
}

export type InsightCategory = 'deadline_risk' | 'bottleneck' | 'production_anomaly' | 'workload_imbalance'
export type InsightSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface AIInsight {
  id: string
  title: string
  description: string
  category: InsightCategory
  severity: InsightSeverity
  detectedFacts: string[]
  predictedImpact: string
  recommendedAction: string
  actionLabel: string
  actionTargetRoute?: string
  projectReference?: string
  isReviewed: boolean
  createdAt: string
  isSampleData: boolean
}

export interface ActivityEvent {
  id: string
  user: User
  action: string
  targetType: 'task' | 'project' | 'production' | 'milestone'
  targetTitle: string
  targetId: string
  timestamp: string
}

export interface Workspace {
  id: string
  name: string
  code: string
  plan: string
  membersCount: number
}
