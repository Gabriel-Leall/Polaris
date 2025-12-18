import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error | null; retry: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, retry }: { error: Error | null; retry: () => void }) {
  return (
    <div className="bg-card rounded-3xl p-6 border border-status-rejected/20">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-status-rejected" />
        <h3 className="text-sm font-semibold text-white">Something went wrong</h3>
      </div>
      
      <p className="text-xs text-secondary mb-4">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      
      <button
        onClick={retry}
        className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-glow text-white text-xs rounded-lg transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        Try Again
      </button>
    </div>
  )
}

export default ErrorBoundary
export { ErrorBoundary, DefaultErrorFallback }