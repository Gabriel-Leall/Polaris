'use client'

import { useState } from 'react'
import { Bug, Play, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { useErrorTesting, errorScenarios } from '@/lib/error-testing'
import { cn } from '@/lib/utils'

/**
 * ErrorTestingPanel - Development tool for testing error scenarios
 * Only available in development mode
 */
function ErrorTestingPanel() {
  const errorTester = useErrorTesting()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)

  // Don't render in production
  if (!errorTester || process.env.NODE_ENV !== 'development') {
    return null
  }

  const handleTriggerError = (scenarioName: string) => {
    try {
      errorTester.triggerError(scenarioName)
    } catch (error) {
      // Error will be caught by error boundary
      console.log('Error triggered successfully:', error)
    }
  }

  const handleTriggerRandomError = () => {
    try {
      errorTester.triggerRandomError()
    } catch (error) {
      console.log('Random error triggered successfully:', error)
    }
  }

  const handleTestMonitoring = () => {
    errorTester.testErrorMonitoring()
  }

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full w-12 h-12 p-0 bg-status-rejected hover:bg-status-rejected/80 shadow-lg"
              title="Error Testing Panel (Development Only)"
            >
              <Bug className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-status-rejected" />
                Error Testing Panel
                <span className="text-xs bg-status-rejected/20 text-status-rejected px-2 py-1 rounded">
                  DEV ONLY
                </span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Quick Actions */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleTriggerRandomError}
                    className="text-xs"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Random Error
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleTestMonitoring}
                    className="text-xs"
                  >
                    <Bug className="w-3 h-3 mr-1" />
                    Test Monitoring
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => errorTester.simulateNetworkError('timeout')}
                    className="text-xs"
                  >
                    Network Error
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => errorTester.simulateDatabaseError('connection')}
                    className="text-xs"
                  >
                    Database Error
                  </Button>
                </div>
              </div>

              {/* Error Scenarios */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Error Scenarios</h3>
                <div className="space-y-1">
                  {errorScenarios.map((scenario) => (
                    <div
                      key={scenario.name}
                      className="border border-glass rounded-lg overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-3 bg-input/50">
                        <button
                          onClick={() => setExpandedScenario(
                            expandedScenario === scenario.name ? null : scenario.name
                          )}
                          className="flex items-center gap-2 text-left flex-1"
                        >
                          {expandedScenario === scenario.name ? (
                            <ChevronDown className="w-4 h-4 text-secondary" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-secondary" />
                          )}
                          <span className="text-sm font-medium text-white">
                            {scenario.name}
                          </span>
                          {!scenario.shouldRetry && (
                            <AlertTriangle className="w-3 h-3 text-status-rejected" />
                          )}
                        </button>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleTriggerError(scenario.name)}
                          className="h-7 px-2 text-xs"
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {expandedScenario === scenario.name && (
                        <div className="p-3 border-t border-glass bg-card/50">
                          <p className="text-xs text-secondary mb-2">
                            {scenario.description}
                          </p>
                          <div className="space-y-1">
                            <div className="text-xs">
                              <span className="text-muted">Error:</span>
                              <span className="text-status-rejected ml-1 font-mono">
                                {scenario.error.message}
                              </span>
                            </div>
                            <div className="text-xs">
                              <span className="text-muted">Retryable:</span>
                              <span className={cn(
                                "ml-1 font-medium",
                                scenario.shouldRetry ? "text-primary" : "text-status-rejected"
                              )}>
                                {scenario.shouldRetry ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div className="text-xs">
                              <span className="text-muted">Expected:</span>
                              <span className="text-white ml-1">
                                {scenario.expectedBehavior}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="text-xs font-semibold text-primary mb-1">Instructions</h4>
                <ul className="text-xs text-secondary space-y-1">
                  <li>• Click any error button to trigger that error scenario</li>
                  <li>• Error boundaries should catch and display appropriate fallbacks</li>
                  <li>• Check browser console for error logs and monitoring events</li>
                  <li>• Test retry functionality where applicable</li>
                  <li>• This panel is only available in development mode</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default ErrorTestingPanel
export { ErrorTestingPanel }