/**
 * Timer formatting utilities for the Zen Timer widget
 */

/**
 * Formats seconds into "MM:SS" format with zero-padding
 * 
 * @param seconds - The number of seconds to format (non-negative integer)
 * @returns Formatted time string in "MM:SS" format
 * 
 * @example
 * formatTime(0)    // "00:00"
 * formatTime(65)   // "01:05"
 * formatTime(3600) // "60:00"
 */
export function formatTime(seconds: number): string {
  // Handle edge cases
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  // Round to handle any floating point inputs
  const totalSeconds = Math.floor(seconds);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  // Zero-pad both minutes and seconds
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
}
