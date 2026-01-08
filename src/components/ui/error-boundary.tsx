'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, RefreshCw, Bug, Database, Wifi, Clock } from 'lucide-react'
import { errorMonitoring } from '@/lib/error-monitoring'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  retryCount: number
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error | null; retry: () => void; errorInfo?: React.ErrorInfo | null }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  maxRetries?: number
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
  isolate?: boolean
  name?: string
  className?: string
}

// Error logging service
class ErrorLogger {
  static log(error: Error, errorInfo: React.ErrorInfo, context?: string) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'test-environment',
      url: typeof window !== 'undefined' ? window.location.href : 'test-url',
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Context:', context)
      console.groupEnd()
    }

    // In production, you would send this to your monitoring service
    // Example: Sentry, LogRocket, DataDog, etc.
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorData })
      console.error('Production Error:', errorData)
    }

    // Store in localStorage for debugging
    try {
      if (typeof localStorage !== 'undefined') {
        const existingErrors = JSON.parse(localStorage.getItem('polaris-errors') || '[]')
        existingErrors.push(errorData)
        // Keep only last 10 errors
        const recentErrors = existingErrors.slice(-10)
        localStorage.setItem('polaris-errors', JSON.stringify(recentErrors))
      }
    } catch (storageError) {
      console.warn('Failed to store error in localStorage:', storageError)
    }
  }

  static getStoredErrors() {
    try {
      if (typeof localStorage === 'undefined') return []
      return JSON.parse(localStorage.getItem('polaris-errors') || '[]')
    } catch {
      return []
    }
  }

  static clearStoredErrors() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('polaris-errors')
      }
    } catch {
      // Ignore storage errors
    }
  }
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    
    // Log the error
    ErrorLogger.log(error, errorInfo, this.props.name)
    
    // Report to monitoring service
    errorMonitoring.reportError(error, errorInfo, {
      component: this.props.name,
      metadata: {
        retryCount: this.state.retryCount,
        maxRetries: this.props.maxRetries || 3
      }
    })
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props
    const { hasError } = this.state

    // Reset error boundary when resetKeys change
    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => prevProps.resetKeys?.[index] !== key
      )
      
      if (hasResetKeyChanged) {
        this.resetErrorBoundary()
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    })
  }

  retry = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount >= maxRetries) {
      return
    }

    this.setState(prevState => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))

    // Auto-reset after successful retry
    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({ retryCount: 0 })
    }, 30000) // Reset retry count after 30 seconds
  }

  render() {
    const content = this.state.hasError
      ? (() => {
          const FallbackComponent = this.props.fallback || DefaultErrorFallback
          return (
            <FallbackComponent 
              error={this.state.error} 
              retry={this.retry}
              errorInfo={this.state.errorInfo}
              retryCount={this.state.retryCount}
              maxRetries={this.props.maxRetries || 3}
              canRetry={this.state.retryCount < (this.props.maxRetries || 3)}
            />
          )
        })()
      : this.props.children

    return <div className={cn('relative', this.props.className)}>{content}</div>
  }
}

// Enhanced error fallback component
interface ErrorFallbackProps {
  error: Error | null
  retry: () => void
  errorInfo?: React.ErrorInfo | null
  retryCount?: number
  maxRetries?: number
  canRetry?: boolean
}

function DefaultErrorFallback({ 
  error, 
  retry, 
  errorInfo, 
  retryCount = 0, 
  maxRetries = 3, 
  canRetry = true 
}: ErrorFallbackProps) {
  const getErrorIcon = () => {
    if (!error) return AlertCircle
    
    const message = error.message.toLowerCase()
    if (message.includes('network') || message.includes('fetch')) return Wifi
    if (message.includes('database') || message.includes('supabase')) return Database
    if (message.includes('timeout')) return Clock
    return Bug
  }

  const getErrorType = () => {
    if (!error) return 'Unknown Error'
    
    const message = error.message.toLowerCase()
    if (message.includes('network') || message.includes('fetch')) return 'Network Error'
    if (message.includes('database') || message.includes('supabase')) return 'Database Error'
    if (message.includes('timeout')) return 'Timeout Error'
    if (message.includes('validation')) return 'Validation Error'
    return 'Application Error'
  }

  const ErrorIcon = getErrorIcon()
  const errorHeading = 'Application Error'

  return (
    <div className="bg-card rounded-3xl p-6 border border-status-rejected/20">
      <div className="flex items-center gap-3 mb-4">
        <ErrorIcon className="w-5 h-5 text-status-rejected" />
        <div>
          <h3 className="text-sm font-semibold text-white">{errorHeading}</h3>
          <p className="text-xs text-secondary">{getErrorType()}</p>
          {retryCount > 0 && (
            <p className="text-xs text-secondary">
              Attempt {retryCount} of {maxRetries}
            </p>
          )}
        </div>
      </div>
      
      <p className="text-xs text-secondary mb-4">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      
      {process.env.NODE_ENV === 'development' && errorInfo && (
        <details className="mb-4">
          <summary className="text-xs text-secondary cursor-pointer hover:text-white">
            Technical Details
          </summary>
          <pre className="text-xs text-secondary mt-2 p-2 bg-input rounded overflow-auto max-h-32">
            {error?.stack}
          </pre>
        </details>
      )}
      
      <div className="flex gap-2">
        {canRetry && (
          <button
            onClick={retry}
            className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-glow text-white text-xs rounded-lg transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Try Again
          </button>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-white text-xs rounded-lg transition-colors"
        >
          Reload Page
        </button>
      </div>
      
      {!canRetry && (
        <p className="text-xs text-secondary mt-3">
          Maximum retry attempts reached. Please reload the page or contact support.
        </p>
      )}
    </div>
  )
}

// Specialized error boundaries for different widget types
function WidgetErrorFallback({ retry, canRetry }: ErrorFallbackProps) {
  return (
    <div className="bg-card rounded-3xl p-6 border border-status-rejected/20 h-full flex flex-col items-center justify-center">
      <AlertCircle className="w-8 h-8 text-status-rejected mb-3" />
      <h3 className="text-sm font-semibold text-white mb-2">Widget Error</h3>
      <p className="text-xs text-secondary mb-4 max-w-xs">
        This widget encountered an error and couldn&apos;t load properly.
      </p>
      {canRetry && (
        <button
          onClick={retry}
          className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-glow text-white text-xs rounded-lg transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      )}
    </div>
  )
}

function DataErrorFallback({ retry, canRetry }: ErrorFallbackProps) {
  return (
    <div className="bg-card rounded-3xl p-6 border border-status-rejected/20">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-5 h-5 text-status-rejected" />
        <h3 className="text-sm font-semibold text-white">Data Loading Error</h3>
      </div>
      
      <p className="text-xs text-secondary mb-4">
        Failed to load data. Please check your connection and try again.
      </p>
      
      {canRetry && (
        <button
          onClick={retry}
          className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-glow text-white text-xs rounded-lg transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Reload Data
        </button>
      )}
    </div>
  )
}

// Higher-order component for wrapping widgets with error boundaries
function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary 
      fallback={WidgetErrorFallback}
      name={Component.displayName || Component.name}
      {...errorBoundaryProps}
    >
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorBoundary
export { 
  ErrorBoundary, 
  DefaultErrorFallback, 
  WidgetErrorFallback, 
  DataErrorFallback,
  ErrorLogger,
  withErrorBoundary
}