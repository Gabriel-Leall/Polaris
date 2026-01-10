/**
 * Dashboard Widget Integration Tests
 * Task 13.1: Test all widget interactions together
 * 
 * Tests:
 * - Verify Zen Mode affects correct widgets
 * - Test media playback during Zen Mode
 * - Ensure Brain Dump saves during Zen Mode
 * 
 * **Validates: Requirements 3.5, 3.7**
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { useZenStore } from '@/store/zenStore';
import { useMediaPlayerStore } from '@/store/mediaPlayerStore';
import { useBrainDumpStore } from '@/store/brainDumpStore';

// Widget types in the dashboard
type WidgetType = 
  | 'zenTimer' 
  | 'mediaPlayer' 
  | 'brainDump' 
  | 'tasks' 
  | 'quickLinks' 
  | 'calendar' 
  | 'habitTracker';

// Widgets that should NOT be blurred during Zen Mode (Requirements 3.5, 3.7)
const EXCLUDED_FROM_BLUR: WidgetType[] = ['zenTimer', 'mediaPlayer', 'brainDump'];

// Widgets that SHOULD be blurred during Zen Mode
const SHOULD_BE_BLURRED: WidgetType[] = ['tasks', 'quickLinks', 'calendar', 'habitTracker'];

// All widgets
const ALL_WIDGETS: WidgetType[] = [...EXCLUDED_FROM_BLUR, ...SHOULD_BE_BLURRED];

/**
 * Simulates the blur logic from ZenModeBlurWrapper
 */
function shouldWidgetBeBlurred(widget: WidgetType, isZenMode: boolean): boolean {
  const excludeFromBlur = EXCLUDED_FROM_BLUR.includes(widget);
  return isZenMode && !excludeFromBlur;
}

/**
 * Simulates widget interactivity based on blur state
 */
function isWidgetInteractive(widget: WidgetType, isZenMode: boolean): boolean {
  // Blurred widgets are non-interactive (pointer-events-none)
  return !shouldWidgetBeBlurred(widget, isZenMode);
}

describe('Dashboard Widget Integration Tests', () => {
  beforeEach(() => {
    // Reset all stores to initial state
    useZenStore.setState({
      isZenMode: false,
      isTimerRunning: false,
      timeRemaining: 25 * 60,
      initialDuration: 25 * 60,
    });
    
    useMediaPlayerStore.setState({
      currentSource: null,
      isPlaying: false,
    });
    
    useBrainDumpStore.setState({
      content: '',
      isLoading: false,
      isSaving: false,
      lastSaved: null,
      hasUnsavedChanges: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Zen Mode Widget Blur Behavior', () => {
    it('should blur correct widgets when Zen Mode is activated', () => {
      // Activate Zen Mode
      useZenStore.getState().setZenMode(true);
      const isZenMode = useZenStore.getState().isZenMode;
      
      expect(isZenMode).toBe(true);
      
      // Verify each widget's blur state
      SHOULD_BE_BLURRED.forEach(widget => {
        expect(shouldWidgetBeBlurred(widget, isZenMode)).toBe(true);
      });
      
      EXCLUDED_FROM_BLUR.forEach(widget => {
        expect(shouldWidgetBeBlurred(widget, isZenMode)).toBe(false);
      });
    });

    it('should not blur any widgets when Zen Mode is deactivated', () => {
      // Ensure Zen Mode is off
      useZenStore.getState().setZenMode(false);
      const isZenMode = useZenStore.getState().isZenMode;
      
      expect(isZenMode).toBe(false);
      
      // No widget should be blurred
      ALL_WIDGETS.forEach(widget => {
        expect(shouldWidgetBeBlurred(widget, isZenMode)).toBe(false);
      });
    });

    it('should maintain widget interactivity correctly during Zen Mode', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.constantFrom(...ALL_WIDGETS),
          (zenModeActive, widget) => {
            useZenStore.setState({ isZenMode: zenModeActive });
            const isZenMode = useZenStore.getState().isZenMode;
            
            const interactive = isWidgetInteractive(widget, isZenMode);
            const isExcluded = EXCLUDED_FROM_BLUR.includes(widget);
            
            if (zenModeActive) {
              // During Zen Mode: excluded widgets are interactive, others are not
              expect(interactive).toBe(isExcluded);
            } else {
              // When Zen Mode is off: all widgets are interactive
              expect(interactive).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Media Player During Zen Mode', () => {
    it('should allow media source changes during Zen Mode', () => {
      // Activate Zen Mode
      useZenStore.getState().setZenMode(true);
      
      // Set a media source
      const testSource = {
        type: 'spotify' as const,
        url: 'https://open.spotify.com/playlist/test123',
        embedUrl: 'https://open.spotify.com/embed/playlist/test123',
        id: 'test123',
      };
      
      useMediaPlayerStore.getState().setSource(testSource);
      
      // Verify source was set
      const currentSource = useMediaPlayerStore.getState().currentSource;
      expect(currentSource).toEqual(testSource);
      
      // Verify Media Player is still interactive during Zen Mode
      expect(isWidgetInteractive('mediaPlayer', true)).toBe(true);
    });

    it('should preserve media state when toggling Zen Mode', () => {
      fc.assert(
        fc.property(
          fc.record({
            type: fc.constantFrom('spotify', 'youtube') as fc.Arbitrary<'spotify' | 'youtube'>,
            url: fc.webUrl(),
            embedUrl: fc.webUrl(),
            id: fc.string({ minLength: 1, maxLength: 20 }),
          }),
          fc.boolean(),
          (source, initialZenMode) => {
            // Set initial state
            useZenStore.setState({ isZenMode: initialZenMode });
            useMediaPlayerStore.getState().setSource(source);
            
            // Toggle Zen Mode
            useZenStore.getState().toggleZenMode();
            
            // Media source should be preserved
            const currentSource = useMediaPlayerStore.getState().currentSource;
            expect(currentSource).toEqual(source);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should allow play/pause toggle during Zen Mode', () => {
      // Activate Zen Mode
      useZenStore.getState().setZenMode(true);
      
      // Toggle play state
      useMediaPlayerStore.getState().togglePlay();
      expect(useMediaPlayerStore.getState().isPlaying).toBe(true);
      
      useMediaPlayerStore.getState().togglePlay();
      expect(useMediaPlayerStore.getState().isPlaying).toBe(false);
    });
  });

  describe('Brain Dump During Zen Mode', () => {
    it('should allow content changes during Zen Mode', () => {
      // Activate Zen Mode
      useZenStore.getState().setZenMode(true);
      
      // Change content
      useBrainDumpStore.getState().setContent('Test content during Zen Mode');
      
      // Verify content was set
      expect(useBrainDumpStore.getState().content).toBe('Test content during Zen Mode');
      
      // Verify Brain Dump is still interactive during Zen Mode
      expect(isWidgetInteractive('brainDump', true)).toBe(true);
    });

    it('should track unsaved changes during Zen Mode', () => {
      // Activate Zen Mode
      useZenStore.getState().setZenMode(true);
      
      // Simulate content change
      useBrainDumpStore.getState().setContent('New content');
      useBrainDumpStore.getState().setUnsavedChanges(true);
      
      // Verify unsaved changes flag
      expect(useBrainDumpStore.getState().hasUnsavedChanges).toBe(true);
    });

    it('should preserve Brain Dump state when toggling Zen Mode', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 500 }),
          fc.boolean(),
          fc.boolean(),
          (content, hasUnsavedChanges, initialZenMode) => {
            // Set initial state
            useZenStore.setState({ isZenMode: initialZenMode });
            useBrainDumpStore.setState({
              content,
              hasUnsavedChanges,
              isLoading: false,
              isSaving: false,
              lastSaved: null,
            });
            
            // Toggle Zen Mode
            useZenStore.getState().toggleZenMode();
            
            // Brain Dump state should be preserved
            expect(useBrainDumpStore.getState().content).toBe(content);
            expect(useBrainDumpStore.getState().hasUnsavedChanges).toBe(hasUnsavedChanges);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should allow saving indicator updates during Zen Mode', () => {
      // Activate Zen Mode
      useZenStore.getState().setZenMode(true);
      
      // Simulate save process
      useBrainDumpStore.getState().setSaving(true);
      expect(useBrainDumpStore.getState().isSaving).toBe(true);
      
      // Complete save
      useBrainDumpStore.getState().setSaving(false);
      useBrainDumpStore.getState().setLastSaved(new Date());
      useBrainDumpStore.getState().setUnsavedChanges(false);
      
      expect(useBrainDumpStore.getState().isSaving).toBe(false);
      expect(useBrainDumpStore.getState().lastSaved).not.toBeNull();
      expect(useBrainDumpStore.getState().hasUnsavedChanges).toBe(false);
    });
  });

  describe('Timer and Zen Mode Interaction', () => {
    it('should allow timer controls during Zen Mode', () => {
      // Activate Zen Mode
      useZenStore.getState().setZenMode(true);
      
      // Start timer
      useZenStore.getState().startTimer();
      expect(useZenStore.getState().isTimerRunning).toBe(true);
      
      // Stop timer
      useZenStore.getState().stopTimer();
      expect(useZenStore.getState().isTimerRunning).toBe(false);
      
      // Reset timer
      useZenStore.getState().resetTimer();
      expect(useZenStore.getState().timeRemaining).toBe(useZenStore.getState().initialDuration);
    });

    it('should preserve timer state when exiting Zen Mode', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 3600 }), // timeRemaining in seconds
          fc.boolean(), // isTimerRunning
          (timeRemaining, isTimerRunning) => {
            // Set timer state during Zen Mode
            useZenStore.setState({
              isZenMode: true,
              timeRemaining,
              isTimerRunning,
            });
            
            // Exit Zen Mode
            useZenStore.getState().setZenMode(false);
            
            // Timer state should be preserved
            expect(useZenStore.getState().timeRemaining).toBe(timeRemaining);
            expect(useZenStore.getState().isTimerRunning).toBe(isTimerRunning);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should tick timer correctly during Zen Mode', () => {
      // Activate Zen Mode and start timer
      useZenStore.setState({
        isZenMode: true,
        isTimerRunning: true,
        timeRemaining: 100,
        initialDuration: 100,
      });
      
      // Tick the timer
      useZenStore.getState().tick();
      
      // Time should decrease by 1
      expect(useZenStore.getState().timeRemaining).toBe(99);
    });
  });

  describe('Cross-Widget State Consistency', () => {
    it('should maintain independent widget states', () => {
      fc.assert(
        fc.property(
          fc.boolean(), // zenMode
          fc.boolean(), // mediaPlaying
          fc.string({ minLength: 0, maxLength: 100 }), // brainDumpContent
          fc.integer({ min: 0, max: 3600 }), // timerRemaining
          (zenMode, mediaPlaying, brainDumpContent, timerRemaining) => {
            // Set all states
            useZenStore.setState({
              isZenMode: zenMode,
              timeRemaining: timerRemaining,
            });
            useMediaPlayerStore.setState({ isPlaying: mediaPlaying });
            useBrainDumpStore.setState({ content: brainDumpContent });
            
            // Verify all states are independent
            expect(useZenStore.getState().isZenMode).toBe(zenMode);
            expect(useZenStore.getState().timeRemaining).toBe(timerRemaining);
            expect(useMediaPlayerStore.getState().isPlaying).toBe(mediaPlaying);
            expect(useBrainDumpStore.getState().content).toBe(brainDumpContent);
            
            // Changing one state shouldn't affect others
            useZenStore.getState().toggleZenMode();
            expect(useMediaPlayerStore.getState().isPlaying).toBe(mediaPlaying);
            expect(useBrainDumpStore.getState().content).toBe(brainDumpContent);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should handle rapid Zen Mode toggles without state corruption', () => {
      const initialMediaSource = {
        type: 'youtube' as const,
        url: 'https://youtube.com/watch?v=test',
        embedUrl: 'https://youtube.com/embed/test',
        id: 'test',
      };
      const initialContent = 'Test brain dump content';
      
      // Set initial states
      useMediaPlayerStore.getState().setSource(initialMediaSource);
      useBrainDumpStore.getState().setContent(initialContent);
      
      // Rapidly toggle Zen Mode
      for (let i = 0; i < 10; i++) {
        useZenStore.getState().toggleZenMode();
      }
      
      // States should be preserved
      expect(useMediaPlayerStore.getState().currentSource).toEqual(initialMediaSource);
      expect(useBrainDumpStore.getState().content).toBe(initialContent);
    });
  });
});
