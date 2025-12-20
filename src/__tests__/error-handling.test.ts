import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ZodError } from 'zod'
import {
  ErrorType,
  PolarisError,
  safeServerAction,
  parseError,
  withRetry,
  ErrorRecovery,
  supabaseCircuitBreaker,
  geminiCircuitBreaker
} from '@/lib/error-handling'



describe('PolarisError', () => {
  it('creates error with correct properties', () => {
    const error = new PolarisError(
      ErrorType.VALIDATION,
      'Invalid input',
      'VAL001',
      { field: 'email' },
      false
    )

    expect(error.type).toBe(ErrorType.VALIDATION)
    expect(error.message).toBe('Invalid input')
    expect(error.code).toBe('VAL001')
    expect(error.details).toEqual({ field: 'email' })
    expect(error.retryable).toBe(false)
  })

  it('serializes to JSON correctly', () => {
    const error = new PolarisError(ErrorType.DATABASE, 'DB error', 'DB001', null, true)
    const json = error.toJSON()

    expect(json).toEqual({
      type: ErrorType.DATABASE,
      message: 'DB error',
      code: 'DB001',
      details: null,
      retryable: true
    })
  })
})

describe('parseError', () => {
  it('parses Zod validation errors', () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['email'],
        message: 'Expected string, received number'
      }
    ])

    const result = parseError(zodError)

    expect(result.type).toBe(ErrorType.VALIDATION)
    expect(result.message).toBe('Invalid input data')
    expect(result.retryable).toBe(false)
    expect(result.details).toEqual(zodError.errors)
  })

  it('parses Supabase errors', () => {
    const supabaseError = {
      code: 'PGRST116',
      message: 'Resource not found',
      details: 'No rows found'
    }

    const result = parseError(supabaseError)

    expect(result.type).toBe(ErrorType.NOT_FOUND)
    expect(result.message).toBe('Resource not found')
    expect(result.code).toBe('PGRST116')
    expect(result.retryable).toBe(false)
  })

  it('parses network errors', () => {
    const networkError = new TypeError('Failed to fetch')

    const result = parseError(networkError)

    expect(result.type).toBe(ErrorType.NETWORK)
    expect(result.message).toBe('Network connection failed')
    expect(result.retryable).toBe(true)
  })

  it('parses authentication errors', () => {
    const authError = new Error('Unauthorized access')

    const result = parseError(authError)

    expect(result.type).toBe(ErrorType.AUTHENTICATION)
    expect(result.message).toBe('Authentication required')
    expect(result.retryable).toBe(false)
  })

  it('parses timeout errors', () => {
    const timeoutError = new Error('Request timeout exceeded')

    const result = parseError(timeoutError)

    expect(result.type).toBe(ErrorType.NETWORK)
    expect(result.message).toBe('Request timed out')
    expect(result.retryable).toBe(true)
  })

  it('handles unknown errors', () => {
    const unknownError = { weird: 'object' }

    const result = parseError(unknownError)

    expect(result.type).toBe(ErrorType.UNKNOWN)
    expect(result.message).toBe('An unexpected error occurred')
    expect(result.details).toBe(unknownError)
    expect(result.retryable).toBe(false)
  })
})

describe('safeServerAction', () => {
  it('returns success result for successful operations', async () => {
    const successfulOperation = async () => 'success data'

    const result = await safeServerAction(successfulOperation, 'test-context')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe('success data')
    }
  })

  it('returns error result for failed operations', async () => {
    const failedOperation = async () => {
      throw new Error('Operation failed')
    }

    const result = await safeServerAction(failedOperation, 'test-context')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.message).toBe('Operation failed')
      expect(result.error.type).toBe(ErrorType.UNKNOWN)
    }
  })

  it('logs errors with context', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const failedOperation = async () => {
      throw new Error('Test error')
    }

    await safeServerAction(failedOperation, 'test-context')

    expect(consoleSpy).toHaveBeenCalledWith(
      'Server Action Error [test-context]:',
      expect.objectContaining({
        error: expect.objectContaining({
          message: 'Test error'
        }),
        originalError: expect.any(Error),
        timestamp: expect.any(String)
      })
    )

    consoleSpy.mockRestore()
  })
})

describe('withRetry', () => {
  it('succeeds on first attempt', async () => {
    const operation = vi.fn().mockResolvedValue('success')

    const result = await withRetry(operation, 3)

    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(1)
  })

  it('retries on failure and eventually succeeds', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new PolarisError(ErrorType.NETWORK, 'Network fail 1', undefined, undefined, true))
      .mockRejectedValueOnce(new PolarisError(ErrorType.NETWORK, 'Network fail 2', undefined, undefined, true))
      .mockResolvedValue('success')

    const result = await withRetry(operation, 3, 10) // Short delay for testing

    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(3)
  })

  it('throws after max retries', async () => {
    const operation = vi.fn().mockRejectedValue(new PolarisError(ErrorType.NETWORK, 'Always fails', undefined, undefined, true))

    await expect(withRetry(operation, 2, 10)).rejects.toThrow('Always fails')
    expect(operation).toHaveBeenCalledTimes(2)
  })

  it('does not retry non-retryable errors', async () => {
    const operation = vi.fn().mockImplementation(() => {
      throw new PolarisError(ErrorType.VALIDATION, 'Invalid input', undefined, undefined, false)
    })

    await expect(withRetry(operation, 3, 10)).rejects.toThrow('Invalid input')
    expect(operation).toHaveBeenCalledTimes(1)
  })
})

describe('ErrorRecovery', () => {
  describe('retryWithBackoff', () => {
    it('returns success result on successful retry', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new PolarisError(ErrorType.NETWORK, 'Temporary failure', undefined, undefined, true))
        .mockResolvedValue('success')

      const result = await ErrorRecovery.retryWithBackoff(operation, 2)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('success')
      }
    })

    it('returns error result after max retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Persistent failure'))

      const result = await ErrorRecovery.retryWithBackoff(operation, 2)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.message).toBe('Persistent failure')
      }
    })
  })

  describe('withFallback', () => {
    it('returns primary result when successful', async () => {
      const primary = vi.fn().mockResolvedValue('primary')
      const fallback = vi.fn().mockResolvedValue('fallback')

      const result = await ErrorRecovery.withFallback(primary, fallback)

      expect(result).toBe('primary')
      expect(fallback).not.toHaveBeenCalled()
    })

    it('returns fallback result when primary fails', async () => {
      const primary = vi.fn().mockRejectedValue(new Error('Primary failed'))
      const fallback = vi.fn().mockResolvedValue('fallback')

      const result = await ErrorRecovery.withFallback(primary, fallback)

      expect(result).toBe('fallback')
      expect(fallback).toHaveBeenCalled()
    })
  })

  describe('gracefulDegrade', () => {
    it('returns primary result when successful', async () => {
      const primary = vi.fn().mockResolvedValue('primary')
      const degraded = vi.fn().mockResolvedValue('degraded')

      const result = await ErrorRecovery.gracefulDegrade(primary, degraded)

      expect(result).toBe('primary')
      expect(degraded).not.toHaveBeenCalled()
    })

    it('returns degraded result when primary fails', async () => {
      const primary = vi.fn().mockRejectedValue(new Error('Primary failed'))
      const degraded = vi.fn().mockResolvedValue('degraded')

      const result = await ErrorRecovery.gracefulDegrade(primary, degraded)

      expect(result).toBe('degraded')
      expect(degraded).toHaveBeenCalled()
    })
  })
})

describe('Circuit Breaker', () => {
  beforeEach(() => {
    // Reset circuit breaker state
    const breaker = supabaseCircuitBreaker as any
    breaker.failures = 0
    breaker.state = 'CLOSED'
    breaker.lastFailureTime = 0
  })

  it('allows operations when circuit is closed', async () => {
    const operation = vi.fn().mockResolvedValue('success')

    const result = await supabaseCircuitBreaker.execute(operation)

    expect(result).toBe('success')
    expect(operation).toHaveBeenCalled()
  })

  it('opens circuit after threshold failures', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('Service down'))

    // Fail 5 times to reach threshold
    for (let i = 0; i < 5; i++) {
      try {
        await supabaseCircuitBreaker.execute(operation)
      } catch (error) {
        // Expected to fail
      }
    }

    // Circuit should now be open
    const state = supabaseCircuitBreaker.getState()
    expect(state.state).toBe('OPEN')
    expect(state.failures).toBe(5)
  })

  it('rejects operations when circuit is open', async () => {
    const operation = vi.fn().mockResolvedValue('success')
    
    // Force circuit to open
    const breaker = supabaseCircuitBreaker as any
    breaker.state = 'OPEN'
    breaker.lastFailureTime = Date.now()

    await expect(supabaseCircuitBreaker.execute(operation)).rejects.toThrow('Service temporarily unavailable')
    expect(operation).not.toHaveBeenCalled()
  })

  it('transitions to half-open after timeout', async () => {
    const operation = vi.fn().mockResolvedValue('success')
    
    // Force circuit to open with old timestamp
    const breaker = supabaseCircuitBreaker as any
    breaker.state = 'OPEN'
    breaker.lastFailureTime = Date.now() - 70000 // 70 seconds ago (past timeout)

    const result = await supabaseCircuitBreaker.execute(operation)

    expect(result).toBe('success')
    expect(operation).toHaveBeenCalled()
    
    const state = supabaseCircuitBreaker.getState()
    expect(state.state).toBe('CLOSED') // Should reset to closed after successful operation
  })
})