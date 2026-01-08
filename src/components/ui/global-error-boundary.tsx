'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { ErrorBoundary, ErrorLogger } from './error-boundary'

interface GlobalErrorFallbackProps {
  error: Error | null
  retry: () => void
  errorInfo?: React.ErrorInfo | null
}

function GlobalErrorFallback({ error, retry, errorInfo }: GlobalErrorFallbackProps) {
  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleReportError = () => {
    // In production, this would send error to monitoring service
    const errorData = {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // For now, copy to clipboard for user to report
    navigator.clipboard.writeText(JSON.stringify(errorData, null, 2)).then(() => {
      alert('Error details copied to clipboard. Please report this to support.')
    }).catch(() => {
      console.error('Failed to copy error details:', errorData)
    })
  }

  return (
    <div className="min-h-screen bg-main flex items-center justify-center p-6">
      <div className="bg-card rounded-3xl p-8 border border-status-rejected/20 max-w-md w-full flex flex-col items-center">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-status-rejected mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Application Error</h1>
          <p className="text-sm text-secondary">
            Something went wrong and the application couldn&apos;t recover.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-input rounded-xl text-left">
            <h3 className="text-sm font-semibold text-white mb-2">Error Details:</h3>
            <p className="text-xs text-secondary font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={retry}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-glow text-white text-sm font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={handleReload}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-secondary/80 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>

          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-input hover:bg-input/80 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>

          <button
            onClick={handleReportError}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-transparent hover:bg-white/5 text-secondary hover:text-white text-sm font-medium rounded-xl transition-colors border border-glass"
          >
            <Bug className="w-4 h-4" />
            Report Error
          </button>
        </div>

        <div className="mt-6 pt-6 border border-glass">
          <p className="text-xs text-secondary">
            If this problem persists, please contact support with the error details.
          </p>
        </div>
      </div>
    </div>
  )
}

interface GlobalErrorBoundaryProps {
  children: React.ReactNode
}

/**
 * GlobalErrorBoundary - Top-level error boundary for the entire application
 * Provides comprehensive error handling and recovery options
 */
function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={GlobalErrorFallback}
      name="GlobalErrorBoundary"
      maxRetries={1}
      onError={(error, errorInfo) => {
        // Log critical application errors
        ErrorLogger.log(error, errorInfo, 'GlobalErrorBoundary')
        
        // In production, send to monitoring service
        if (process.env.NODE_ENV === 'production') {
          // Example: Sentry.captureException(error, { 
          //   extra: { errorInfo, level: 'fatal' } 
          // })
          console.error('Critical application error:', { error, errorInfo })
        }
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default GlobalErrorBoundary
export { GlobalErrorBoundary, GlobalErrorFallback }