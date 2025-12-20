import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GlobalErrorBoundary } from '@/components/ui/global-error-boundary'
import { ErrorBoundary, WidgetErrorFallback } from '@/components/ui/error-boundary'

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn
const originalConsoleLog = console.log

beforeEach(() => {
  console.error = vi.fn()
  console.warn = vi.fn()
  console.log = vi.fn()
})

afterEach(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
  console.log = originalConsoleLog
})

// Test component that throws errors
const ThrowError = ({ shouldThrow = false, errorMessage = 'Test error' }: { shouldThrow?: boolean; errorMessage?: string }) => {
  if (shouldThrow) {
    throw new Error(errorMessage)
  }
  return <div>No error</div>
}

describe('Error Boundary Integration', () => {
  it('GlobalErrorBoundary catches and displays errors', () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Global error test" />
      </GlobalErrorBoundary>
    )
    
    expect(screen.getByText('Application Error')).toBeInTheDocument()
    expect(screen.getByText('Global error test')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Reload Page')).toBeInTheDocument()
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument()
  })

  it('Widget error boundary shows appropriate fallback', () => {
    render(
      <ErrorBoundary fallback={WidgetErrorFallback} name="TestWidget">
        <ThrowError shouldThrow={true} errorMessage="Widget error test" />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Widget Error')).toBeInTheDocument()
    expect(screen.getByText('This widget encountered an error and couldn\'t load properly.')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('Error boundaries isolate errors to specific components', () => {
    render(
      <div>
        <ErrorBoundary fallback={WidgetErrorFallback} name="Widget1">
          <ThrowError shouldThrow={true} errorMessage="Widget 1 error" />
        </ErrorBoundary>
        <ErrorBoundary fallback={WidgetErrorFallback} name="Widget2">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      </div>
    )
    
    // Widget 1 should show error, Widget 2 should work normally
    expect(screen.getByText('Widget Error')).toBeInTheDocument()
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('Retry functionality works correctly', () => {
    let shouldThrow = true
    const RetryableComponent = () => {
      if (shouldThrow) {
        shouldThrow = false // Only throw once
        throw new Error('Retryable error')
      }
      return <div>Retry successful</div>
    }

    render(
      <ErrorBoundary fallback={WidgetErrorFallback} name="RetryTest">
        <RetryableComponent />
      </ErrorBoundary>
    )
    
    // Error should be displayed initially
    expect(screen.getByText('Widget Error')).toBeInTheDocument()
    
    // Click retry button
    fireEvent.click(screen.getByText('Retry'))
    
    // Should show success after retry
    expect(screen.getByText('Retry successful')).toBeInTheDocument()
  })

  it('Error boundaries work with nested components', () => {
    const OuterComponent = () => <div>Outer works</div>
    const InnerComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) throw new Error('Inner error')
      return <div>Inner works</div>
    }

    render(
      <ErrorBoundary fallback={WidgetErrorFallback} name="Outer">
        <OuterComponent />
        <ErrorBoundary fallback={WidgetErrorFallback} name="Inner">
          <InnerComponent shouldThrow={true} />
        </ErrorBoundary>
      </ErrorBoundary>
    )
    
    // Outer should work, inner should show error
    expect(screen.getByText('Outer works')).toBeInTheDocument()
    expect(screen.getByText('Widget Error')).toBeInTheDocument()
  })
})