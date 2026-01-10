/**
 * Property-based tests for timer formatting utilities
 * 
 * **Feature: dashboard-layout-enhancement, Property 4: Timer time formatting**
 * **Validates: Requirements 3.1**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatTime } from '@/lib/timer-utils';

describe('Property 4: Timer time formatting', () => {
  it('should return a string in "MM:SS" format for any non-negative integer', () => {
    fc.assert(
      fc.property(fc.nat({ max: 99999 }), (seconds) => {
        const result = formatTime(seconds);
        
        // Should match MM:SS pattern (minutes can be > 59)
        expect(result).toMatch(/^\d{2,}:\d{2}$/);
      }),
      { numRuns: 100 }
    );
  });

  it('should have zero-padded seconds (always 2 digits)', () => {
    fc.assert(
      fc.property(fc.nat({ max: 99999 }), (seconds) => {
        const result = formatTime(seconds);
        const parts = result.split(':');
        
        // Seconds part should always be exactly 2 digits
        expect(parts[1]).toHaveLength(2);
      }),
      { numRuns: 100 }
    );
  });

  it('should have zero-padded minutes (at least 2 digits)', () => {
    fc.assert(
      fc.property(fc.nat({ max: 99999 }), (seconds) => {
        const result = formatTime(seconds);
        const parts = result.split(':');
        
        // Minutes part should be at least 2 digits
        expect(parts[0].length).toBeGreaterThanOrEqual(2);
      }),
      { numRuns: 100 }
    );
  });

  it('should correctly calculate minutes and seconds', () => {
    fc.assert(
      fc.property(fc.nat({ max: 99999 }), (seconds) => {
        const result = formatTime(seconds);
        const [minutesPart, secondsPart] = result.split(':').map(Number);
        
        const expectedMinutes = Math.floor(seconds / 60);
        const expectedSeconds = seconds % 60;
        
        expect(minutesPart).toBe(expectedMinutes);
        expect(secondsPart).toBe(expectedSeconds);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle zero correctly', () => {
    const result = formatTime(0);
    expect(result).toBe('00:00');
  });

  it('should handle edge case of exactly 60 seconds', () => {
    const result = formatTime(60);
    expect(result).toBe('01:00');
  });

  it('should handle large numbers (hours worth of seconds)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 3600, max: 36000 }), (seconds) => {
        const result = formatTime(seconds);
        const [minutesPart, secondsPart] = result.split(':').map(Number);
        
        // Should still produce valid output
        expect(minutesPart).toBeGreaterThanOrEqual(60);
        expect(secondsPart).toBeGreaterThanOrEqual(0);
        expect(secondsPart).toBeLessThan(60);
      }),
      { numRuns: 100 }
    );
  });

  it('should return "00:00" for negative numbers', () => {
    fc.assert(
      fc.property(fc.integer({ min: -10000, max: -1 }), (seconds) => {
        const result = formatTime(seconds);
        expect(result).toBe('00:00');
      }),
      { numRuns: 100 }
    );
  });

  it('should return "00:00" for non-finite values', () => {
    expect(formatTime(Infinity)).toBe('00:00');
    expect(formatTime(-Infinity)).toBe('00:00');
    expect(formatTime(NaN)).toBe('00:00');
  });
});
