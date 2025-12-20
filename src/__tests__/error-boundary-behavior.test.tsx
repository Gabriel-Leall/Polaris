import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ErrorBoundary, DefaultErrorFallback, WidgetErrorFallback, DataErrorFallback, ErrorLogger } from '@/components/ui/error-boundary'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeEach(() => {
  console.error = vi.fn()
  console.warn = vi.fn()
  ErrorLogger.clearStoredErrors()
})

afterEach(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Test component that throws errors
const ThrowError = ({ shouldThrow = false, errorMessage = 'Test error' }: { shouldThrow?: boolean; errorMessage?: string }) => {
  if (shouldThrow) {
    throw new Error(errorMessage)
  }
  return <div>No error</div>
}

// Test component that throws errors on interaction
const ThrowErrorOnClick = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false)
  
  if (shouldThrow) {
    throw new Error('Click error')
  }
  
  return (
    <button onClick={() => setShouldThrow(true)}>
      Click to throw error
    </button>
  )
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders default error fallback when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Test error message" />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Application Error')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('renders custom error fallback when provided', () => {
    const CustomFallback = ({ error, retry }: { error: Error | null; retry: () => void }) => (
      <div>
        <span>Custom error: {error?.message}</span>
        <button onClick={retry}>Custom retry</button>
      </div>
    )

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} errorMessage="Custom error message" />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Custom error: Custom error message')).toBeInTheDocument()
    expect(screen.getByText('Custom retry')).toBeInTheDocument()
  })

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn()
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} errorMessage="Callback test error" />
      </ErrorBoundary>
    )
    
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
  })

  it('retries when retry button is clicked', async () => {
    let shouldThrow = true
    const RetryableComponent = () => {
      if (shouldThrow) {
        shouldThrow = false // Only throw once
        throw new Error('Retryable error')
      }
      return <div>Retry successful</div>
    }

    render(
      <ErrorBoundary>
        <RetryableComponent />
      </ErrorBoundary>
    )
    
    // Error should be displayed initially
    expect(screen.getByText('Application Error')).toBeInTheDocument()
    
    // Click retry button
    fireEvent.click(screen.getByText('Try Again'))
    
    // Should show success after retry
    await waitFor(() => {
      expect(screen.getByText('Retry successful')).toBeInTheDocument()
    })
  })

  it('respects maxRetries limit', () => {
    render(
      <ErrorBoundary maxRetries={2}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    // Click retry button twice (reaching max retries)
    fireEvent.click(screen.getByText('Try Again'))
    fireEvent.click(screen.getByText('Try Again'))
    
    // After max retries, retry button should be disabled or show different message
    expect(screen.getByText('Maximum retry attempts reached. Please reload the page or contact support.')).toBeInTheDocument()
  })

  it('resets error boundary when resetKeys change', () => {
    let resetKey = 'key1'
    const { rerender } = render(
      <ErrorBoundary resetOnPropsChange resetKeys={[resetKey]}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    // Error should be displayed
    expect(screen.getByText('Application Error')).toBeInTheDocument()
    
    // Change reset key
    resetKey = 'key2'
    rerender(
      <ErrorBoundary resetOnPropsChange resetKeys={[resetKey]}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    // Error should be cleared
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('handles errors during user interactions', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorOnClick />
      </ErrorBoundary>
    )
    
    // Initially no error
    expect(screen.getByText('Click to throw error')).toBeInTheDocument()
    
    // Click to trigger error
    fireEvent.click(screen.getByText('Click to throw error'))
    
    // Error boundary should catch the error
    expect(screen.getByText('Application Error')).toBeInTheDocument()
  })
})

describe('Error Fallback Components', () => {
  it('renders WidgetErrorFallback correctly', () => {
    const mockRetry = vi.fn()
    
    render(
      <WidgetErrorFallback 
        error={new Error('Widget error')} 
        retry={mockRetry}
        canRetry={true}
      />
    )
    
    expect(screen.getByText('Widget Error')).toBeInTheDocument()
    expect(screen.getByText('This widget encountered an error and couldn\'t load properly.')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Retry'))
    expect(mockRetry).toHaveBeenCalled()
  })

  it('renders DataErrorFallback correctly', () => {
    const mockRetry = vi.fn()
    
    render(
      <DataErrorFallback 
        error={new Error('Data error')} 
        retry={mockRetry}
        canRetry={true}
      />
    )
    
    expect(screen.getByText('Data Loading Error')).toBeInTheDocument()
    expect(screen.getByText('Failed to load data. Please check your connection and try again.')).toBeInTheDocument()
    expect(screen.getByText('Reload Data')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Reload Data'))
    expect(mockRetry).toHaveBeenCalled()
  })

  it('shows different error types based on error message', () => {
    const networkError = new Error('Network connection failed')
    const databaseError = new Error('Database query failed')
    const timeoutError = new Error('Request timeout')
    
    const { rerender } = render(
      <DefaultErrorFallback error={networkError} retry={() => {}} />
    )
    expect(screen.getByText('Network Error')).toBeInTheDocument()
    
    rerender(<DefaultErrorFallback error={databaseError} retry={() => {}} />)
    expect(screen.getByText('Database Error')).toBeInTheDocument()
    
    rerender(<DefaultErrorFallback error={timeoutError} retry={() => {}} />)
    expect(screen.getByText('Timeout Error')).toBeInTheDocument()
  })
})

describe('ErrorLogger', () => {
  it('logs errors to localStorage', () => {
    const error = new Error('Test error')
    const errorInfo = { componentStack: 'Test component stack' }
    
    ErrorLogger.log(error, errorInfo, 'TestComponent')
    
    const storedErrors = ErrorLogger.getStoredErrors()
    expect(storedErrors).toHaveLength(1)
    expect(storedErrors[0]).toMatchObject({
      message: 'Test error',
      context: 'TestComponent',
      componentStack: 'Test component stack'
    })
  })

  it('limits stored errors to 10', () => {
    // Add 15 errors
    for (let i = 0; i < 15; i++) {
      ErrorLogger.log(new Error(`Error ${i}`), { componentStack: 'Stack' }, 'Test')
    }
    
    const storedErrors = ErrorLogger.getStoredErrors()
    expect(storedErrors).toHaveLength(10)
    
    // Should keep the most recent errors
    expect(storedErrors[9].message).toBe('Error 14')
    expect(storedErrors[0].message).toBe('Error 5')
  })

  it('clears stored errors', () => {
    ErrorLogger.log(new Error('Test error'), { componentStack: 'Stack' }, 'Test')
    expect(ErrorLogger.getStoredErrors()).toHaveLength(1)
    
    ErrorLogger.clearStoredErrors()
    expect(ErrorLogger.getStoredErrors()).toHaveLength(0)
  })
})

describe('Error Boundary Integration', () => {
  it('works with multiple nested error boundaries', () => {
    const OuterError = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) throw new Error('Outer error')
      return <div>Outer component</div>
    }
    
    const InnerError = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) throw new Error('Inner error')
      return <div>Inner component</div>
    }

    render(
      <ErrorBoundary name="Outer">
        <OuterError shouldThrow={false} />
        <ErrorBoundary name="Inner">
          <InnerError shouldThrow={true} />
        </ErrorBoundary>
      </ErrorBoundary>
    )
    
    // Only inner error boundary should catch the error
    expect(screen.getByText('Outer component')).toBeInTheDocument()
    expect(screen.getByText('Application Error')).toBeInTheDocument()
    expect(screen.getByText('Inner error')).toBeInTheDocument()
  })

  it('isolates errors to specific boundaries', () => {
    render(
      <div>
        <ErrorBoundary name="Widget1">
          <ThrowError shouldThrow={true} errorMessage="Widget 1 error" />
        </ErrorBoundary>
        <ErrorBoundary name="Widget2">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      </div>
    )
    
    // Widget 1 should show error, Widget 2 should work normally
    expect(screen.getByText('Widget 1 error')).toBeInTheDocument()
    expect(screen.getByText('No error')).toBeInTheDocument()
  })
})