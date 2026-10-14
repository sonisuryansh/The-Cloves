import { describe, it, expect, beforeEach } from 'vitest'
import {
  projectService,
  taskService,
  productionService,
  insightsService,
  teamService,
  workspaceService,
  getApiClientConfig,
  updateApiClientConfig,
  resetApiClientConfig,
  ApiError
} from '@/services'

describe('Phase 12: Centralized API Client & Configuration', () => {
  beforeEach(() => {
    resetApiClientConfig()
  })

  it('retrieves default API client configuration in mock repository mode', () => {
    const config = getApiClientConfig()
    expect(config.mode).toBe('mock')
    expect(config.baseUrl).toBeDefined()
    expect(config.timeoutMs).toBeGreaterThan(0)
    expect(config.simulateErrors).toBe(false)
  })

  it('updates API configuration dynamically and reflects changes', () => {
    updateApiClientConfig({
      baseUrl: 'https://staging.api.pulsecore.internal/v2',
      mockLatencyMs: 250,
      mode: 'live'
    })

    const updated = getApiClientConfig()
    expect(updated.baseUrl).toBe('https://staging.api.pulsecore.internal/v2')
    expect(updated.mockLatencyMs).toBe(250)
    expect(updated.mode).toBe('live')
  })

  it('throws ApiError when simulateErrors is activated in configuration', async () => {
    updateApiClientConfig({ simulateErrors: true })

    await expect(projectService.getProjects()).rejects.toThrow(ApiError)
    await expect(taskService.getTasks()).rejects.toThrow('Simulated network fault')
  })
})

describe('Phase 12: Typed Services & Repositories', () => {
  beforeEach(() => {
    resetApiClientConfig()
  })

  it('ProjectService: performs CRUD operations on typed projects', async () => {
    const initialProjects = await projectService.getProjects()
    expect(initialProjects.length).toBeGreaterThan(0)

    // Create
    const newProj = await projectService.createProject({
      name: 'Subsea Optical Cable Rig',
      description: 'Testing high-pressure subsea sensor telemetry enclosure.',
      category: 'Hardware',
      status: 'active',
      startDate: '2026-10-01',
      dueDate: '2026-12-31',
      nextMilestone: 'Pressure Chamber Hydro-Test 40 Bar',
      owner: initialProjects[0].owner,
      tags: ['Subsea', 'Pressure']
    })
    expect(newProj.id).toBeDefined()
    expect(newProj.name).toBe('Subsea Optical Cable Rig')

    // Read by ID
    const fetched = await projectService.getProjectById(newProj.id)
    expect(fetched?.name).toBe('Subsea Optical Cable Rig')

    // Update
    const updated = await projectService.updateProject(newProj.id, {
      description: 'Updated high-pressure rating specs.'
    })
    expect(updated.description).toBe('Updated high-pressure rating specs.')

    // Delete
    const deleted = await projectService.deleteProject(newProj.id)
    expect(deleted).toBe(true)
    const afterDelete = await projectService.getProjectById(newProj.id)
    expect(afterDelete).toBeNull()
  })

  it('TaskService: manages tasks, status updates, and comments', async () => {
    const tasks = await taskService.getTasks()
    expect(tasks.length).toBeGreaterThan(0)
    const firstTask = tasks[0]

    // Update status
    const updatedTask = await taskService.updateTaskStatus(firstTask.id, 'done')
    expect(updatedTask.status).toBe('done')
    expect(updatedTask.completedAt).toBeDefined()

    // Add comment
    const withComment = await taskService.addTaskComment(
      firstTask.id,
      firstTask.assignee || tasks[1].reporter!,
      'Service layer unit test comment verification.'
    )
    const latestComment = withComment.comments?.[withComment.comments.length - 1]
    expect(latestComment?.text).toBe('Service layer unit test comment verification.')
  })

  it('ProductionService: manages production orders and equipment telemetry', async () => {
    const orders = await productionService.getOrders()
    expect(orders.length).toBeGreaterThan(0)

    const equipment = await productionService.getEquipment()
    expect(equipment.length).toBeGreaterThan(0)
    expect(equipment[0].efficiency).toBeGreaterThan(0)

    // Update order status
    const firstOrder = orders[0]
    const updatedOrder = await productionService.updateOrderStatus(firstOrder.id, 'completed')
    expect(updatedOrder.status).toBe('completed')
  })

  it('InsightsService: queries AI insights and updates review status', async () => {
    const insights = await insightsService.getInsights()
    expect(insights.length).toBeGreaterThan(0)

    const reviewed = await insightsService.markReviewed(insights[0].id)
    expect(reviewed.isReviewed).toBe(true)
  })

  it('WorkspaceService: exports structured repository snapshot', async () => {
    const dumpStr = await workspaceService.exportWorkspaceData()
    expect(dumpStr).toBeDefined()
    const parsed = JSON.parse(dumpStr)
    expect(parsed.platform).toContain('PulseCore')
    expect(parsed.workspaces).toBeDefined()
    expect(parsed.projects).toBeDefined()
  })
})
