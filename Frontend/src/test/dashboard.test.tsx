import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAppStore } from '@/stores/useAppStore'

describe('Design System UI Components', () => {
  it('renders Badge with priority styling correctly', () => {
    render(<Badge priority="urgent" />)
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('renders ProgressBar with correct percentage and aria bounds', () => {
    const { container } = render(<ProgressBar value={75} max={100} showLabel={true} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
    const bar = container.querySelector('.bg-blue-600, .bg-emerald-500, .bg-amber-500')
    expect(bar).toBeInTheDocument()
  })
})

describe('Application Store & Dynamic Calculations', () => {
  it('correctly derives KPIs and computed project progress from tasks', () => {
    const store = useAppStore.getState()
    const kpis = store.getDashboardKPIs()
    expect(kpis.activeProjects).toBeGreaterThan(0)
    expect(kpis.openTasks).toBeGreaterThan(0)

    const computedProjects = store.getComputedProjects()
    expect(computedProjects.length).toBeGreaterThan(0)
    const firstProj = computedProjects[0]
    expect(firstProj.totalTasks).toBeDefined()
    expect(firstProj.completedTasks).toBeDefined()
    expect(firstProj.progressPercentage).toBeDefined()
  })

  it('updates project progress dynamically when a task is completed', () => {
    const store = useAppStore.getState()
    const initialProjects = store.getComputedProjects()
    const targetProject = initialProjects[0]
    const initialCompleted = targetProject.completedTasks || 0

    // Complete a task in that project
    const projectTask = store.tasks.find((t) => t.projectId === targetProject.id && t.status !== 'done')
    if (projectTask) {
      store.updateTaskStatus(projectTask.id, 'done')
      const updatedProjects = useAppStore.getState().getComputedProjects()
      const updatedTarget = updatedProjects.find((p) => p.id === targetProject.id)
      expect(updatedTarget?.completedTasks).toBe(initialCompleted + 1)
    }
  })
})

describe('Phase 4: Project Templates & Management', () => {
  it('instantiates project from template and populates initial tasks', () => {
    const initialProjectsCount = useAppStore.getState().projects.length

    const newProject = useAppStore.getState().createProjectFromTemplate(
      'tmpl-1',
      'Test Hardware Subsystem',
      'Test description',
      '2026-11-20'
    )

    expect(newProject.id).toBeDefined()
    expect(useAppStore.getState().projects.length).toBe(initialProjectsCount + 1)

    // Check that starter tasks were created
    const projectTasks = useAppStore.getState().tasks.filter((t) => t.projectId === newProject.id)
    expect(projectTasks.length).toBeGreaterThan(0)
    expect(projectTasks[0].projectName).toBe('Test Hardware Subsystem')
  })
})

describe('Phase 5: Task Management & Attachments', () => {
  it('adds and removes attachments from a task', () => {
    const task = useAppStore.getState().tasks[0]
    expect(task).toBeDefined()

    useAppStore.getState().addTaskAttachment(task.id, {
      name: 'Schematic_v1.pdf',
      sizeBytes: 102400,
      fileType: 'application/pdf'
    })

    const updatedTask = useAppStore.getState().tasks.find((t) => t.id === task.id)
    const attachment = updatedTask?.attachments?.find((a) => a.name === 'Schematic_v1.pdf')
    expect(attachment).toBeDefined()

    // Remove attachment
    if (attachment) {
      useAppStore.getState().deleteTaskAttachment(task.id, attachment.id)
      const afterDeleteTask = useAppStore.getState().tasks.find((t) => t.id === task.id)
      expect(afterDeleteTask?.attachments?.some((a) => a.id === attachment.id)).toBe(false)
    }
  })
})

describe('Phase 6: Kanban Board Drag-and-Drop State', () => {
  it('moves task between columns in Kanban and updates status and project metrics', () => {
    const todoTask = useAppStore.getState().tasks.find((t) => t.status === 'todo')
    expect(todoTask).toBeDefined()

    if (todoTask) {
      // Move to in_progress
      useAppStore.getState().moveTaskInKanban(todoTask.id, 'in_progress', 'in_progress')
      let currentTask = useAppStore.getState().tasks.find((t) => t.id === todoTask.id)
      expect(currentTask?.status).toBe('in_progress')

      // Move to done
      useAppStore.getState().moveTaskInKanban(todoTask.id, 'done', 'done')
      currentTask = useAppStore.getState().tasks.find((t) => t.id === todoTask.id)
      expect(currentTask?.status).toBe('done')
      expect(currentTask?.completedAt).toBeDefined()

      // Verify that completed count in project recalculated correctly
      const targetProject = useAppStore.getState().getComputedProjects().find((p) => p.id === todoTask.projectId)
      expect(targetProject?.completedTasks).toBeGreaterThan(0)
    }
  })
})

describe('Phase 7: Calendar & Timeline Logic', () => {
  it('identifies tasks with start and due dates for timeline Gantt rendering', () => {
    const tasks = useAppStore.getState().tasks
    const timelineTasks = tasks.filter((t) => t.startDate && t.dueDate)
    expect(timelineTasks.length).toBeGreaterThan(0)

    // Verify dates are ISO parseable
    const firstTimelineTask = timelineTasks[0]
    expect(new Date(firstTimelineTask.startDate!).getTime()).not.toBeNaN()
    expect(new Date(firstTimelineTask.dueDate!).getTime()).not.toBeNaN()
  })

  it('verifies task dependency relationship for critical path planning', () => {
    const tasks = useAppStore.getState().tasks
    const taskWithDeps = tasks.find((t) => t.dependencies && t.dependencies.length > 0)
    expect(taskWithDeps).toBeDefined()
    if (taskWithDeps && taskWithDeps.dependencies) {
      const depKeyOrId = taskWithDeps.dependencies[0]
      const parentTask = tasks.find((t) => t.id === depKeyOrId || t.key === depKeyOrId)
      expect(parentTask).toBeDefined()
    }
  })
})

describe('Phase 8: Production Control & Telemetry', () => {
  it('manages production orders and updates batch status', () => {
    const orders = useAppStore.getState().productionOrders
    expect(orders.length).toBeGreaterThan(0)

    const runningOrder = orders.find((o) => o.status === 'running')
    expect(runningOrder).toBeDefined()

    if (runningOrder) {
      // Complete order
      useAppStore.getState().updateProductionOrderStatus(runningOrder.id, 'completed')
      const updated = useAppStore.getState().productionOrders.find((o) => o.id === runningOrder.id)
      expect(updated?.status).toBe('completed')
    }
  })

  it('verifies production stages and quality yield metrics', () => {
    const orders = useAppStore.getState().productionOrders
    const orderWithStages = orders.find((o) => o.stages && o.stages.length > 0)
    expect(orderWithStages).toBeDefined()
    expect(orderWithStages?.stages?.length).toBeGreaterThan(0)
    expect(orderWithStages?.batchQualityScore).toBeGreaterThan(0)
  })
})

describe('Phase 9: AI Intelligence & Risk Telemetry', () => {
  it('contains evidence-backed root cause analysis and predicted outcomes', () => {
    const insights = useAppStore.getState().aiInsights
    expect(insights.length).toBeGreaterThan(0)

    const firstInsight = insights[0]
    expect(firstInsight.detectedFacts.length).toBeGreaterThan(0)
    expect(firstInsight.predictedImpact).toBeDefined()
    expect(firstInsight.recommendedAction).toBeDefined()
  })

  it('marks insight as reviewed and supports dismissing recommendations', () => {
    const insight = useAppStore.getState().aiInsights[0]
    expect(insight).toBeDefined()

    // Mark as reviewed
    useAppStore.getState().markInsightReviewed(insight.id)
    let currentInsight = useAppStore.getState().aiInsights.find((i) => i.id === insight.id)
    expect(currentInsight?.isReviewed).toBe(true)

    // Dismiss insight
    const initialCount = useAppStore.getState().aiInsights.length
    useAppStore.getState().dismissInsight(insight.id)
    expect(useAppStore.getState().aiInsights.length).toBe(initialCount - 1)
  })
})

describe('Phase 10: Reports & Team Management', () => {
  it('verifies team roster is initialized with department rights and permissions', () => {
    const members = useAppStore.getState().teamMembers
    expect(members.length).toBeGreaterThanOrEqual(5)

    const leadEngineer = members.find((m) => m.name === 'Alex Morgan')
    expect(leadEngineer?.department).toBe('Engineering')
    expect(leadEngineer?.permissions?.length).toBeGreaterThan(0)
  })

  it('adds a newly invited team member with invited status to workspace roster', () => {
    const initialCount = useAppStore.getState().teamMembers.length

    useAppStore.getState().addTeamMember({
      id: 'usr-new-99',
      name: 'Jordan Hayes',
      email: 'jordan.h@thecloves.internal',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=80',
      role: 'Robotics Integration Specialist',
      department: 'Hardware & Firmware',
      status: 'invited',
      joinedDate: '2026-10-14',
      permissions: ['Create & Edit Tasks', 'View Production Telemetry']
    })

    const updatedMembers = useAppStore.getState().teamMembers
    expect(updatedMembers.length).toBe(initialCount + 1)
    const jordan = updatedMembers.find((m) => m.id === 'usr-new-99')
    expect(jordan?.status).toBe('invited')
    expect(jordan?.permissions).toContain('View Production Telemetry')
  })
})
