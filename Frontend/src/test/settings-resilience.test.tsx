import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton, DashboardCardSkeleton } from '@/components/common/LoadingSkeleton'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// Component that intentionally throws for ErrorBoundary testing
const FaultyComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test explosive runtime error in UI tree')
  }
  return <div>Component loaded safely</div>
}

describe('Phase 11: Settings & Workspace Configuration UI', () => {
  it('renders settings page tabs and navigates between them', () => {
    render(<SettingsPage />)

    // Check main title
    expect(screen.getByText('Settings & Platform Configuration')).toBeInTheDocument()

    // Default tab: My Profile
    expect(screen.getByText('User Profile & Credentials')).toBeInTheDocument()

    // Switch to Workspace tab
    const workspaceTabBtn = screen.getByRole('button', { name: /Workspace/i })
    fireEvent.click(workspaceTabBtn)
    expect(screen.getByText('Workspace Details')).toBeInTheDocument()

    // Switch to Appearance tab
    const appearanceTabBtn = screen.getByRole('button', { name: /Appearance/i })
    fireEvent.click(appearanceTabBtn)
    expect(screen.getByText('Appearance & Interface Controls')).toBeInTheDocument()

    // Switch to API & Services tab
    const apiTabBtn = screen.getByRole('button', { name: /API & Services/i })
    fireEvent.click(apiTabBtn)
    expect(screen.getByText('Centralized API & Service Layer Configuration')).toBeInTheDocument()
    expect(screen.getByText('Simulated Network Latency (Mock Pipeline)')).toBeInTheDocument()

    // Switch to Security tab
    const securityTabBtn = screen.getByRole('button', { name: /Security & Audit/i })
    fireEvent.click(securityTabBtn)
    expect(screen.getByText('Security & Authentication Controls')).toBeInTheDocument()
  })
})

describe('Phase 13: Loading, Error, and Empty State Resilience', () => {
  it('renders EmptyState with custom title, description, and triggers onAction callback', () => {
    const handleAction = vi.fn()
    render(
      <EmptyState
        title="Zero Deliverables In Flight"
        description="No tasks are currently scheduled for this sprint cycle."
        actionLabel="Create Deliverable"
        onAction={handleAction}
      />
    )

    expect(screen.getByText('Zero Deliverables In Flight')).toBeInTheDocument()
    expect(screen.getByText('No tasks are currently scheduled for this sprint cycle.')).toBeInTheDocument()

    const actionBtn = screen.getByRole('button', { name: 'Create Deliverable' })
    fireEvent.click(actionBtn)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('renders ErrorState with error message and triggers onRetry', () => {
    const handleRetry = vi.fn()
    render(
      <ErrorState
        title="Telemetry Ingestion Failure"
        message="Failed to establish websocket link to OPC-UA Gateway node."
        onRetry={handleRetry}
      />
    )

    expect(screen.getByText('Telemetry Ingestion Failure')).toBeInTheDocument()
    expect(screen.getByText('Failed to establish websocket link to OPC-UA Gateway node.')).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: /Try Again/i })
    fireEvent.click(retryBtn)
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('renders LoadingSkeleton components without errors', () => {
    const { container } = render(
      <div>
        <Skeleton className="h-4 w-32" />
        <DashboardCardSkeleton />
      </div>
    )

    const pulseElements = container.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })

  it('ErrorBoundary gracefully catches component exceptions and provides recovery buttons', () => {
    // Suppress expected console.error during deliberate error throwing in test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Application Rendering Interruption')).toBeInTheDocument()
    expect(screen.getByText(/Test explosive runtime error in UI tree/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Try To Recover/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reload Window/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Return to Overview/i })).toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })
})
