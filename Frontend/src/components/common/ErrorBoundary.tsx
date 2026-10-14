import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface ErrorBoundaryProps {
  children?: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    console.error('The Cloves Uncaught Error Boundary:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Application Rendering Interruption
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                A runtime exception occurred in The Cloves UI tree. No workspace or production data was lost.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-red-100/70 dark:bg-red-950/60 border border-red-200 dark:border-red-900/80 text-left overflow-x-auto text-[11px] font-mono text-red-900 dark:text-red-200">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={this.handleReset}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Try To Recover
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={this.handleReload}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Reload Window
              </Button>

              <Button
                size="sm"
                variant="default"
                onClick={this.handleGoHome}
                leftIcon={<Home className="w-3.5 h-3.5" />}
              >
                Return to Overview
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
