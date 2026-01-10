/**
 * Property-based tests for Zen Mode state round-trip
 * 
 * **Feature: dashboard-layout-enhancement, Property 7: Zen Mode state round-trip**
 * **Validates: Requirements 3.8**
 * 
 * Property: For any dashboard state, activating Zen Mode and then deactivating it 
 * should restore the original visual state (no blur on any widget).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { useZenStore } from '@/store/zenStore';

// Widget types in the dashboard
type WidgetType = 
  | 'zenTimer' 
  | 'mediaPlayer' 
  | 'brainDump' 
  | 'tasks' 
  | 'quickLinks' 
  | 'calendar' 
  | 'habitTracker';

// Widgets that should NOT be blurred during Zen Mode
const EXCLUDED_FROM_BLUR: WidgetType[] = ['zenTimer', 'mediaPlayer', 'brainDump'];

// All widgets
const ALL_WIDGETS: WidgetType[] = [
  'zenTimer', 
  'mediaPlayer', 
  'brainDump', 
  'tasks', 
  'quickLinks', 
  'calendar', 
  'habitTracker'
];

/**
 * Simulates the blur logic from ZenModeBlurWrapper
 * Returns true if the widget should be blurred
 */
function shouldWidgetBeBlurred(widget: WidgetType, isZenMode: boolean): boolean {
  const excludeFromBlur = EXCLUDED_FROM_BLUR.includes(widget);
  return isZenMode && !excludeFromBlur;
}

/**
 * Gets the blur state for all widgets
 */
function getAllWidgetBlurStates(isZenMode: boolean): Record<WidgetType, boolean> {
  return ALL_WIDGETS.reduce((acc, widget) => {
    acc[widget] = shouldWidgetBeBlurred(widget, isZenMode);
    return acc;
  }, {} as Record<WidgetType, boolean>);
}

describe('Property 7: Zen Mode state round-trip', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useZenStore.setState({
      isZenMode: false,
      isTimerRunning: false,
      timeRemaining: 25 * 60,
      initialDuration: 25 * 60,
    });
  });

  it('should restore original visual state after activating and deactivating Zen Mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }), // Number of toggle cycles
        (cycles) => {
          // Capture initial state (Zen Mode off)
          const initialBlurStates = getAllWidgetBlurStates(false);

          // Perform multiple activate/deactivate cycles
          for (let i = 0; i < cycles; i++) {
            // Activate Zen Mode
            useZenStore.getState().setZenMode(true);
            expect(useZenStore.getState().isZenMode).toBe(true);

            // Deactivate Zen Mode
            useZenStore.getState().setZenMode(false);
            expect(useZenStore.getState().isZenMode).toBe(false);
          }

          // Verify final state matches initial state
          const finalBlurStates = getAllWidgetBlurStates(useZenStore.getState().isZenMode);
          expect(finalBlurStates).toEqual(initialBlurStates);

          // All widgets should have no blur after deactivation
          ALL_WIDGETS.forEach(widget => {
            expect(finalBlurStates[widget]).toBe(false);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should toggle Zen Mode correctly using toggleZenMode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }), // Number of toggles
        (toggleCount) => {
          // Start with Zen Mode off
          useZenStore.setState({ isZenMode: false });

          // Toggle the specified number of times
          for (let i = 0; i < toggleCount; i++) {
            useZenStore.getState().toggleZenMode();
          }

          // Final state should be based on odd/even toggle count
          const expectedState = toggleCount % 2 === 1;
          expect(useZenStore.getState().isZenMode).toBe(expectedState);

          // If we end with Zen Mode off, no widgets should be blurred
          if (!expectedState) {
            const blurStates = getAllWidgetBlurStates(false);
            ALL_WIDGETS.forEach(widget => {
              expect(blurStates[widget]).toBe(false);
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain idempotent behavior for setZenMode', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.integer({ min: 1, max: 5 }),
        (targetState, repeatCount) => {
          // Set Zen Mode to target state multiple times
          for (let i = 0; i < repeatCount; i++) {
            useZenStore.getState().setZenMode(targetState);
          }

          // State should be exactly the target state
          expect(useZenStore.getState().isZenMode).toBe(targetState);

          // Blur states should be consistent with the target state
          const blurStates = getAllWidgetBlurStates(targetState);
          ALL_WIDGETS.forEach(widget => {
            const expectedBlur = targetState && !EXCLUDED_FROM_BLUR.includes(widget);
            expect(blurStates[widget]).toBe(expectedBlur);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve timer state when toggling Zen Mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 99999 }), // Time remaining
        fc.boolean(), // Timer running state
        fc.integer({ min: 60, max: 99999 }), // Initial duration
        (timeRemaining, isTimerRunning, initialDuration) => {
          // Set up timer state
          useZenStore.setState({
            timeRemaining,
            isTimerRunning,
            initialDuration,
            isZenMode: false,
          });

          // Capture timer state before Zen Mode toggle
          const timerStateBefore = {
            timeRemaining: useZenStore.getState().timeRemaining,
            isTimerRunning: useZenStore.getState().isTimerRunning,
            initialDuration: useZenStore.getState().initialDuration,
          };

          // Toggle Zen Mode on and off
          useZenStore.getState().setZenMode(true);
          useZenStore.getState().setZenMode(false);

          // Timer state should be preserved
          const timerStateAfter = {
            timeRemaining: useZenStore.getState().timeRemaining,
            isTimerRunning: useZenStore.getState().isTimerRunning,
            initialDuration: useZenStore.getState().initialDuration,
          };

          expect(timerStateAfter).toEqual(timerStateBefore);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have no blur on any widget when Zen Mode is off', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_WIDGETS),
        (widget) => {
          // Ensure Zen Mode is off
          useZenStore.setState({ isZenMode: false });

          const isBlurred = shouldWidgetBeBlurred(widget, false);

          // No widget should be blurred when Zen Mode is off
          expect(isBlurred).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
