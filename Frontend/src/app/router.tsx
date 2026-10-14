import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { OverviewDashboard } from '@/features/dashboard/OverviewDashboard'
import { TasksPage } from '@/features/tasks/TasksPage'
import { ProjectsPage } from '@/features/projects/ProjectsPage'
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage'
import { CalendarPage } from '@/features/calendar/CalendarPage'
import { ProductionPage } from '@/features/production/ProductionPage'
import { AiInsightsPage } from '@/features/ai-insights/AiInsightsPage'
import { ReportsPage } from '@/features/reports/ReportsPage'
import { TeamPage } from '@/features/team/TeamPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <AppLayout />
      </ErrorBoundary>
    ),
    errorElement: (
      <ErrorBoundary>
        <AppLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <OverviewDashboard />
      },
      {
        path: 'tasks',
        element: <TasksPage />
      },
      {
        path: 'projects',
        element: <ProjectsPage />
      },
      {
        path: 'projects/:id',
        element: <ProjectDetailPage />
      },
      {
        path: 'calendar',
        element: <CalendarPage />
      },
      {
        path: 'production',
        element: <ProductionPage />
      },
      {
        path: 'insights',
        element: <AiInsightsPage />
      },
      {
        path: 'ai-insights',
        element: <Navigate to="/insights" replace />
      },
      {
        path: 'reports',
        element: <ReportsPage />
      },
      {
        path: 'team',
        element: <TeamPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
])
