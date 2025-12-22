import { ErrorLogger } from '@/components/ui/error-boundary'
import { parseError, ErrorType } from './error-handling'

interface ErrorContext {
  userId?: string | undefined
  sessionId?: string | undefined
  component?: string | undefined
  action?: string | undefined
  metadata?: Record<string, unknown> | undefined
}

interface MonitoringConfig {
  enabled: boolean
  endpoint?: string
  apiKey?: string
  environment: 'development' | 'production' | 'test'
  maxRetries: number
  batchSize: number
  flushInterval: number
}

class ErrorMonitoringService {
  private config: MonitoringConfig
  private errorQueue: Array<{
    error: Error
    errorInfo?: React.ErrorInfo | undefined
    context?: ErrorContext | undefined
    timestamp: string
  }> = []
  private flushTimer: NodeJS.Timeout | null = null

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = {
      enabled: process.env.NODE_ENV === 'production',
      environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      maxRetries: 3,
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      ...config
    }

    if (this.config.enabled) {
      this.startFlushTimer()
    }
  }

  /**
   * Report an error to the monitoring service
   */
  reportError(
    error: Error, 
    errorInfo?: React.ErrorInfo | undefined, 
    context?: ErrorContext | undefined
  ): void {
    // Always log locally first
    ErrorLogger.log(error, errorInfo || { componentStack: '' }, context?.component)

    if (!this.config.enabled) {
      return
    }

    // Add to queue for batch processing
    this.errorQueue.push({
      error,
      errorInfo,
      context,
      timestamp: new Date().toISOString()
    })

    // Flush immediately for critical errors
    const parsedError = parseError(error)
    if (this.isCriticalError(parsedError.type)) {
      this.flush()
    } else if (this.errorQueue.length >= this.config.batchSize) {
      this.flush()
    }
  }

  /**
   * Report a custom event or metric
   */
  reportEvent(
    eventName: string, 
    properties?: Record<string, unknown> | undefined,
    context?: ErrorContext | undefined
  ): void {
    if (!this.config.enabled) {
      console.log(`Event: ${eventName}`, { properties, context })
      return
    }

    // In production, send to analytics service
    this.sendEvent({
      event: eventName,
      properties,
      context,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Set user context for error reporting
   */
  setUserContext(userId: string, metadata?: Record<string, unknown> | undefined): void {
    if (typeof window !== 'undefined') {
      (window as Window & { __errorMonitoringContext?: { userId: string; metadata?: Record<string, unknown>; sessionId?: string } }).__errorMonitoringContext = {
        userId,
        ...(metadata && { metadata }),
        sessionId: this.generateSessionId()
      }
    }
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(
    message: string, 
    category: string = 'user',
    level: 'info' | 'warning' | 'error' = 'info',
    data?: Record<string, unknown> | undefined
  ): void {
    const breadcrumb = {
      message,
      category,
      level,
      ...(data && { data }),
      timestamp: new Date().toISOString()
    }

    if (typeof window !== 'undefined') {
      const breadcrumbs = (window as Window & { __errorBreadcrumbs?: Array<{ timestamp: string; message: string; level: string; category?: string; data?: Record<string, unknown> }> }).__errorBreadcrumbs || []
      breadcrumbs.push(breadcrumb)
      
      // Keep only last 50 breadcrumbs
      if (breadcrumbs.length > 50) {
        breadcrumbs.shift()
      }
      
      (window as Window & { __errorBreadcrumbs?: Array<{ timestamp: string; message: string; level: string; category?: string; data?: Record<string, unknown> }> }).__errorBreadcrumbs = breadcrumbs
    }

    if (this.config.environment === 'development') {
      console.log(`Breadcrumb [${category}]:`, breadcrumb)
    }
  }

  /**
   * Flush queued errors to monitoring service
   */
  private async flush(): Promise<void> {
    if (this.errorQueue.length === 0) {
      return
    }

    const errors = [...this.errorQueue]
    this.errorQueue = []

    try {
      await this.sendErrors(errors)
    } catch (sendError) {
      console.error('Failed to send errors to monitoring service:', sendError)
      
      // Re-queue errors for retry (up to maxRetries)
      errors.forEach(errorData => {
        const retryCount = (errorData as { retryCount?: number }).retryCount || 0
        if (retryCount < this.config.maxRetries) {
          this.errorQueue.push({
            ...errorData,
            retryCount: retryCount + 1
          } as typeof errorData & { retryCount: number })
        }
      })
    }
  }

  /**
   * Send errors to monitoring service
   */
  private async sendErrors(errors: Array<{
    error: Error
    errorInfo?: React.ErrorInfo | undefined
    context?: ErrorContext | undefined
    timestamp: string
  }>): Promise<void> {
    if (!this.config.endpoint) {
      // Mock sending - in production this would be Sentry, LogRocket, etc.
      console.log('Would send errors to monitoring service:', errors.length)
      return
    }

    const payload = {
      errors: errors.map(({ error, errorInfo, context, timestamp }) => ({
        message: error.message,
        stack: error.stack,
        name: error.name,
        componentStack: errorInfo?.componentStack,
        context,
        timestamp,
        environment: this.config.environment,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        breadcrumbs: typeof window !== 'undefined' ? (window as Window & { __errorBreadcrumbs?: Array<{ timestamp: string; message: string; level: string; category?: string; data?: Record<string, unknown> }> }).__errorBreadcrumbs : undefined
      }))
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Monitoring service responded with ${response.status}`)
    }
  }

  /**
   * Send custom event to analytics service
   */
  private async sendEvent(eventData: {
    event: string
    properties?: Record<string, unknown> | undefined
    context?: ErrorContext | undefined
    timestamp: string
  }): Promise<void> {
    // Mock implementation - in production this would integrate with analytics
    console.log('Analytics event:', eventData)
  }

  /**
   * Check if error type is critical and needs immediate attention
   */
  private isCriticalError(errorType: ErrorType): boolean {
    return [
      ErrorType.DATABASE,
      ErrorType.AUTHENTICATION,
      ErrorType.AUTHORIZATION
    ].includes(errorType)
  }

  /**
   * Generate a session ID for tracking user sessions
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Start the flush timer for batch processing
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
    
    // Flush any remaining errors
    this.flush()
  }
}

// Global instance
const errorMonitoring = new ErrorMonitoringService({
  enabled: process.env.NODE_ENV === 'production',
  // In production, configure with actual monitoring service
  // endpoint: process.env.NEXT_PUBLIC_MONITORING_ENDPOINT,
  // apiKey: process.env.MONITORING_API_KEY,
})

// Performance monitoring helpers
export const performanceMonitoring = {
  /**
   * Measure and report performance metrics
   */
  measurePerformance<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now()
    
    return operation()
      .then(result => {
        const duration = performance.now() - startTime
        errorMonitoring.reportEvent('performance_metric', {
          operation: operationName,
          duration,
          success: true
        })
        return result
      })
      .catch(error => {
        const duration = performance.now() - startTime
        errorMonitoring.reportEvent('performance_metric', {
          operation: operationName,
          duration,
          success: false,
          error: error.message
        })
        throw error
      })
  },

  /**
   * Report slow operations
   */
  reportSlowOperation(operationName: string, duration: number, threshold: number = 1000): void {
    if (duration > threshold) {
      errorMonitoring.reportEvent('slow_operation', {
        operation: operationName,
        duration,
        threshold
      })
    }
  }
}

export { errorMonitoring, ErrorMonitoringService, type ErrorContext, type MonitoringConfig }