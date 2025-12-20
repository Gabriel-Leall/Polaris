import { ZodError } from 'zod'

// Error types for better error handling
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType
  message: string
  code?: string | undefined
  details?: unknown
  retryable: boolean
}

export class PolarisError extends Error {
  public readonly type: ErrorType
  public readonly code?: string | undefined
  public readonly details?: unknown
  public readonly retryable: boolean

  constructor(type: ErrorType, message: string, code?: string | undefined, details?: unknown, retryable = false) {
    super(message)
    this.name = 'PolarisError'
    this.type = type
    this.code = code
    this.details = details
    this.retryable = retryable
  }

  toJSON(): AppError {
    return {
      type: this.type,
      message: this.message,
      code: this.code,
      details: this.details,
      retryable: this.retryable
    }
  }
}

// Result type for Server Actions
export type Result<T, E = AppError> = 
  | { success: true; data: T }
  | { success: false; error: E }

// Safe wrapper for Server Actions
export async function safeServerAction<T>(
  action: () => Promise<T>,
  context?: string
): Promise<Result<T>> {
  try {
    const data = await action()
    return { success: true, data }
  } catch (error) {
    const appError = parseError(error)
    
    // Log error for monitoring
    console.error(`Server Action Error [${context}]:`, {
      error: appError,
      originalError: error,
      timestamp: new Date().toISOString()
    })

    return { success: false, error: appError }
  }
}

// Parse different error types into standardized AppError
export function parseError(error: unknown): AppError {
  // PolarisError objects (should be handled first)
  if (error instanceof PolarisError) {
    return error.toJSON()
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return {
      type: ErrorType.VALIDATION,
      message: 'Invalid input data',
      details: error.errors,
      retryable: false
    }
  }

  // Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string; details?: string }
    
    switch (supabaseError.code) {
      case 'PGRST116':
        return {
          type: ErrorType.NOT_FOUND,
          message: 'Resource not found',
          code: supabaseError.code,
          retryable: false
        }
      case '23505':
        return {
          type: ErrorType.VALIDATION,
          message: 'Duplicate entry',
          code: supabaseError.code,
          retryable: false
        }
      case '42501':
        return {
          type: ErrorType.AUTHORIZATION,
          message: 'Insufficient permissions',
          code: supabaseError.code,
          retryable: false
        }
      default:
        return {
          type: ErrorType.DATABASE,
          message: supabaseError.message || 'Database operation failed',
          code: supabaseError.code,
          details: supabaseError.details,
          retryable: true
        }
    }
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network connection failed',
      retryable: true
    }
  }

  // Standard Error objects
  if (error instanceof Error) {
    // Check for specific error patterns
    const message = error.message.toLowerCase()
    
    if (message.includes('timeout')) {
      return {
        type: ErrorType.NETWORK,
        message: 'Request timed out',
        retryable: true
      }
    }
    
    if (message.includes('unauthorized') || message.includes('authentication')) {
      return {
        type: ErrorType.AUTHENTICATION,
        message: 'Authentication required',
        retryable: false
      }
    }
    
    if (message.includes('forbidden') || message.includes('permission')) {
      return {
        type: ErrorType.AUTHORIZATION,
        message: 'Access denied',
        retryable: false
      }
    }

    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
      retryable: false
    }
  }

  // Fallback for unknown error types
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
    details: error,
    retryable: false
  }
}

// Retry mechanism for retryable operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
  backoff = 2
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      // Check if error is retryable before deciding to retry
      const appError = parseError(error)
      if (!appError.retryable) {
        throw lastError
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(backoff, attempt - 1)))
    }
  }

  throw lastError!
}

// Circuit breaker pattern for preventing cascading failures
class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'

  constructor(
    private readonly threshold = 5,
    private readonly timeout = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN'
      } else {
        throw new PolarisError(
          ErrorType.UNKNOWN,
          'Service temporarily unavailable',
          'CIRCUIT_BREAKER_OPEN',
          undefined,
          true
        )
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    this.state = 'CLOSED'
  }

  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN'
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime
    }
  }
}

// Global circuit breaker instances for different services
export const supabaseCircuitBreaker = new CircuitBreaker(5, 60000)
export const geminiCircuitBreaker = new CircuitBreaker(3, 30000)

// Error recovery strategies
export const ErrorRecovery = {
  // Retry with exponential backoff
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 3
  ): Promise<Result<T>> {
    try {
      const result = await withRetry(operation, maxRetries)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: parseError(error) }
    }
  },

  // Fallback to cached data
  async withFallback<T>(
    operation: () => Promise<T>,
    fallback: () => Promise<T> | T
  ): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      console.warn('Primary operation failed, using fallback:', error)
      return await fallback()
    }
  },

  // Graceful degradation
  async gracefulDegrade<T, F>(
    operation: () => Promise<T>,
    degradedOperation: () => Promise<F>
  ): Promise<T | F> {
    try {
      return await operation()
    } catch (error) {
      console.warn('Operation failed, degrading gracefully:', error)
      return await degradedOperation()
    }
  }
}

// Error boundary helpers
export function createErrorBoundaryProps(name: string) {
  return {
    name,
    onError: (error: Error, errorInfo: React.ErrorInfo) => {
      console.error(`Error Boundary [${name}]:`, { error, errorInfo })
      
      // In production, send to monitoring service
      if (process.env.NODE_ENV === 'production') {
        // Example: Sentry.captureException(error, { extra: { errorInfo, component: name } })
      }
    },
    maxRetries: 3,
    resetOnPropsChange: true
  }
}