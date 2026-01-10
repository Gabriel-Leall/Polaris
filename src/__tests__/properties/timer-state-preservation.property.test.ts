/**
 * Property-based tests for timer state preservation
 * 
 * **Feature: dashboard-layout-enhancement, Property 5: Timer state preservation on stop**
 * **Validates: Requirements 3.3**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { useZenStore } from '@/store/zenStore';

describe('Property 5: Timer state preservation on stop', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useZenStore.setState({
      isZenMode: false,
      isTimerRunning: false,
      timeRemaining: 25 * 60,
      initialDuration: 25 * 60,
    });
  });

  it('should preserve exact remaining time when stop is called', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 99999 }),
        (remainingTime) => {
          // Set up timer with specific remaining time and running state
          useZenStore.setState({
            timeRemaining: remainingTime,
            isTimerRunning: true,
          });

          // Stop the timer
          useZenStore.getState().stopTimer();

          // Verify time is preserved exactly
          const state = useZenStore.getState();
          expect(state.timeRemaining).toBe(remainingTime);
          expect(state.isTimerRunning).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve time when stopping a non-running timer', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 99999 }),
        (remainingTime) => {
          // Set up timer with specific remaining time but not running
          useZenStore.setState({
            timeRemaining: remainingTime,
            isTimerRunning: false,
          });

          // Stop the timer (should be idempotent)
          useZenStore.getState().stopTimer();

          // Verify time is still preserved
          const state = useZenStore.getState();
          expect(state.timeRemaining).toBe(remainingTime);
          expect(state.isTimerRunning).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should allow resuming from preserved time after stop', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 99999 }),
        (remainingTime) => {
          // Set up timer with specific remaining time
          useZenStore.setState({
            timeRemaining: remainingTime,
            isTimerRunning: true,
          });

          // Stop the timer
          useZenStore.getState().stopTimer();
          const timeAfterStop = useZenStore.getState().timeRemaining;

          // Start the timer again
          useZenStore.getState().startTimer();

          // Verify time is still the same (no reset on start)
          const state = useZenStore.getState();
          expect(state.timeRemaining).toBe(timeAfterStop);
          expect(state.isTimerRunning).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
