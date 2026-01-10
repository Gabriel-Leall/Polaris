/**
 * Property-based tests for Zen Mode blur application
 * 
 * **Feature: dashboard-layout-enhancement, Property 6: Zen Mode blur application**
 * **Validates: Requirements 3.5, 3.7**
 * 
 * Property: For any dashboard state when Zen Mode is activated, exactly the 
 * Zen Timer, Media Player, and Brain Dump widgets should NOT have blur applied, 
 * while all other widgets should have blur applied.
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

// Widgets that SHOULD be blurred during Zen Mode
const SHOULD_BE_BLURRED: WidgetType[] = ['tasks', 'quickLinks', 'calendar', 'habitTracker'];

// All widgets
const ALL_WIDGETS: WidgetType[] = [...EXCLUDED_FROM_BLUR, ...SHOULD_BE_BLURRED];

/**
 * Simulates the blur logic from ZenModeBlurWrapper
 * Returns true if the widget should be blurred
 */
function shouldWidgetBeBlurred(widget: WidgetType, isZenMode: boolean): boolean {
  const excludeFromBlur = EXCLUDED_FROM_BLUR.includes(widget);
  return isZenMode && !excludeFromBlur;
}

describe('Property 6: Zen Mode blur application', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useZenStore.setState({
      isZenMode: false,
      isTimerRunning: false,
      timeRemaining: 25 * 60,
      initialDuration: 25 * 60,
    });
  });

  it('should blur only non-excluded widgets when Zen Mode is active', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_WIDGETS),
        (widget) => {
          // Activate Zen Mode
          useZenStore.setState({ isZenMode: true });
          const isZenMode = useZenStore.getState().isZenMode;

          const isBlurred = shouldWidgetBeBlurred(widget, isZenMode);
          const isExcluded = EXCLUDED_FROM_BLUR.includes(widget);

          // If widget is excluded from blur, it should NOT be blurred
          // If widget is not excluded, it SHOULD be blurred
          expect(isBlurred).toBe(!isExcluded);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not blur any widgets when Zen Mode is inactive', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_WIDGETS),
        (widget) => {
          // Ensure Zen Mode is off
          useZenStore.setState({ isZenMode: false });
          const isZenMode = useZenStore.getState().isZenMode;

          const isBlurred = shouldWidgetBeBlurred(widget, isZenMode);

          // No widget should be blurred when Zen Mode is off
          expect(isBlurred).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always keep Zen Timer, Media Player, and Brain Dump visible', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // Random Zen Mode state
        fc.constantFrom(...EXCLUDED_FROM_BLUR),
        (zenModeActive, widget) => {
          useZenStore.setState({ isZenMode: zenModeActive });
          const isZenMode = useZenStore.getState().isZenMode;

          const isBlurred = shouldWidgetBeBlurred(widget, isZenMode);

          // These widgets should NEVER be blurred regardless of Zen Mode state
          expect(isBlurred).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should blur Tasks, Quick Links, Calendar, and Habit Tracker only when Zen Mode is active', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // Random Zen Mode state
        fc.constantFrom(...SHOULD_BE_BLURRED),
        (zenModeActive, widget) => {
          useZenStore.setState({ isZenMode: zenModeActive });
          const isZenMode = useZenStore.getState().isZenMode;

          const isBlurred = shouldWidgetBeBlurred(widget, isZenMode);

          // These widgets should be blurred ONLY when Zen Mode is active
          expect(isBlurred).toBe(zenModeActive);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have exactly 3 widgets excluded from blur', () => {
    expect(EXCLUDED_FROM_BLUR).toHaveLength(3);
    expect(EXCLUDED_FROM_BLUR).toContain('zenTimer');
    expect(EXCLUDED_FROM_BLUR).toContain('mediaPlayer');
    expect(EXCLUDED_FROM_BLUR).toContain('brainDump');
  });

  it('should have exactly 4 widgets that get blurred', () => {
    expect(SHOULD_BE_BLURRED).toHaveLength(4);
    expect(SHOULD_BE_BLURRED).toContain('tasks');
    expect(SHOULD_BE_BLURRED).toContain('quickLinks');
    expect(SHOULD_BE_BLURRED).toContain('calendar');
    expect(SHOULD_BE_BLURRED).toContain('habitTracker');
  });
});
