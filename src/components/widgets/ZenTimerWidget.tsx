'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorBoundary, WidgetErrorFallback } from '@/components/ui/error-boundary'
import { useZenStore } from '@/store/zenStore'
import { cn } from '@/lib/utils'

interface ZenTimerWidgetProps {
  className?: string | undefined
}

interface TimerState {
  minutes: number
  seconds: number
  isRunning: boolean
  totalSeconds: number
  initialDuration: number
}

const ZenTimerWidgetCore = ({ className }: ZenTimerWidgetProps) => {
  const { isZenMode, setZenMode } = useZenStore()
  
  const [timerState, setTimerState] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    totalSeconds: 25 * 60,
    initialDuration: 25 * 60
  })

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerState.isRunning && timerState.totalSeconds > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          const newTotalSeconds = prev.totalSeconds - 1
          const newMinutes = Math.floor(newTotalSeconds / 60)
          const newSeconds = newTotalSeconds % 60

          // Auto-pause when timer reaches zero
          if (newTotalSeconds <= 0) {
            return {
              ...prev,
              minutes: 0,
              seconds: 0,
              totalSeconds: 0,
              isRunning: false
            }
          }

          return {
            ...prev,
            minutes: newMinutes,
            seconds: newSeconds,
            totalSeconds: newTotalSeconds
          }
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [timerState.isRunning, timerState.totalSeconds])

  // Zen mode integration - activate zen mode when timer starts
  useEffect(() => {
    if (timerState.isRunning && !isZenMode) {
      setZenMode(true)
    } else if (!timerState.isRunning && isZenMode && timerState.totalSeconds === timerState.initialDuration) {
      // Only deactivate zen mode if timer was reset to initial state
      setZenMode(false)
    }
  }, [timerState.isRunning, isZenMode, setZenMode, timerState.totalSeconds, timerState.initialDuration])

  const handlePlayPause = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }))
  }, [])

  const handleReset = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      minutes: Math.floor(prev.initialDuration / 60),
      seconds: prev.initialDuration % 60,
      totalSeconds: prev.initialDuration,
      isRunning: false
    }))
  }, [])

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = ((timerState.initialDuration - timerState.totalSeconds) / timerState.initialDuration) * 100

  return (
    <div className={cn("glass-card rounded-3xl p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-white">Zen Timer</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            disabled={timerState.totalSeconds === timerState.initialDuration}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-white mb-2 font-mono">
          {formatTime(timerState.minutes, timerState.seconds)}
        </div>
        <div className="text-sm text-secondary">
          {timerState.isRunning ? 'Focus time' : 'Ready to focus'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-input rounded-full h-1">
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Play/Pause Button */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handlePlayPause}
          disabled={timerState.totalSeconds === 0}
          className={cn(
            "h-16 w-16 rounded-full p-0 transition-all duration-200",
            timerState.isRunning && "glow-primary"
          )}
        >
          {timerState.isRunning ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>
      </div>

      {/* Zen Mode Indicator */}
      {isZenMode && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-primary font-medium">Zen Mode Active</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Wrapper component with error boundary
const ZenTimerWidget = ({ className }: ZenTimerWidgetProps) => {
  return (
    <ErrorBoundary 
      fallback={WidgetErrorFallback}
      name="ZenTimerWidget"
      maxRetries={2}
    >
      <ZenTimerWidgetCore className={className} />
    </ErrorBoundary>
  )
}

export default ZenTimerWidget
export { ZenTimerWidget }