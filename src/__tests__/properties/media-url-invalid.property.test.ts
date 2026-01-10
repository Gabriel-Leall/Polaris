/**
 * Property-based tests for invalid media URL handling
 * 
 * **Feature: dashboard-layout-enhancement, Property 3: Invalid URL error handling**
 * **Validates: Requirements 2.8**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  parseSpotifyUrl,
  parseYouTubeUrl,
  generateEmbedUrl,
  isValidMediaUrl,
} from '@/lib/media-utils';

// Arbitrary for random strings that are NOT valid Spotify or YouTube URLs
const invalidUrlArb = fc.oneof(
  // Random strings
  fc.string({ minLength: 0, maxLength: 100 }),
  // URLs with wrong domains
  fc.webUrl().filter(url => {
    const lower = url.toLowerCase();
    return !lower.includes('spotify') && !lower.includes('youtube') && !lower.includes('youtu.be');
  }),
  // Malformed URLs
  fc.constantFrom(
    'not-a-url',
    'http://',
    'https://',
    'spotify:invalid',
    'spotify:playlist:',
    'youtube.com',
    'https://example.com/watch?v=abc',
    'https://vimeo.com/12345',
    'ftp://spotify.com/playlist/abc',
    '',
    '   ',
    'null',
    'undefined'
  )
);

// Arbitrary for strings that look like URLs but have wrong format
const almostValidSpotifyArb = fc.oneof(
  // Missing ID
  fc.constantFrom(
    'https://open.spotify.com/playlist/',
    'https://open.spotify.com/track/',
    'https://open.spotify.com/album/',
    'spotify:playlist:',
    'spotify:track:',
    'spotify:album:'
  ),
  // Wrong type
  fc.constantFrom(
    'https://open.spotify.com/artist/abc123',
    'https://open.spotify.com/show/abc123',
    'spotify:artist:abc123',
    'spotify:show:abc123'
  ),
  // Wrong domain
  fc.constantFrom(
    'https://spotify.com/playlist/abc123',
    'https://play.spotify.com/playlist/abc123'
  )
);

// Arbitrary for strings that look like YouTube URLs but have wrong format
const almostValidYouTubeArb = fc.oneof(
  // Wrong video ID length (not 11 chars)
  fc.constantFrom(
    'https://www.youtube.com/watch?v=abc',
    'https://www.youtube.com/watch?v=abcdefghijklmnop',
    'https://youtu.be/abc',
    'https://youtu.be/abcdefghijklmnop'
  ),
  // Missing video ID
  fc.constantFrom(
    'https://www.youtube.com/watch',
    'https://www.youtube.com/watch?',
    'https://youtu.be/',
    'https://www.youtube.com/embed/'
  ),
  // Wrong path
  fc.constantFrom(
    'https://www.youtube.com/channel/abc12345678',
    'https://www.youtube.com/playlist?list=abc'
  )
);

describe('Property 3: Invalid URL error handling', () => {
  describe('parseSpotifyUrl returns null for invalid inputs', () => {
    it('should return null for random non-Spotify strings', () => {
      fc.assert(
        fc.property(invalidUrlArb, (input) => {
          const result = parseSpotifyUrl(input);
          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should return null for almost-valid Spotify URLs', () => {
      fc.assert(
        fc.property(almostValidSpotifyArb, (input) => {
          const result = parseSpotifyUrl(input);
          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should return null for null/undefined-like inputs', () => {
      expect(parseSpotifyUrl(null as unknown as string)).toBeNull();
      expect(parseSpotifyUrl(undefined as unknown as string)).toBeNull();
      expect(parseSpotifyUrl('')).toBeNull();
      expect(parseSpotifyUrl('   ')).toBeNull();
    });
  });

  describe('parseYouTubeUrl returns null for invalid inputs', () => {
    it('should return null for random non-YouTube strings', () => {
      fc.assert(
        fc.property(invalidUrlArb, (input) => {
          const result = parseYouTubeUrl(input);
          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should return null for almost-valid YouTube URLs', () => {
      fc.assert(
        fc.property(almostValidYouTubeArb, (input) => {
          const result = parseYouTubeUrl(input);
          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should return null for null/undefined-like inputs', () => {
      expect(parseYouTubeUrl(null as unknown as string)).toBeNull();
      expect(parseYouTubeUrl(undefined as unknown as string)).toBeNull();
      expect(parseYouTubeUrl('')).toBeNull();
      expect(parseYouTubeUrl('   ')).toBeNull();
    });
  });

  describe('generateEmbedUrl returns null for invalid inputs', () => {
    it('should return null for any invalid URL', () => {
      fc.assert(
        fc.property(invalidUrlArb, (input) => {
          const result = generateEmbedUrl(input);
          expect(result).toBeNull();
        }),
        { numRuns: 100 }
      );
    });

    it('should return null for null/undefined-like inputs', () => {
      expect(generateEmbedUrl(null as unknown as string)).toBeNull();
      expect(generateEmbedUrl(undefined as unknown as string)).toBeNull();
      expect(generateEmbedUrl('')).toBeNull();
    });
  });

  describe('isValidMediaUrl returns false for invalid inputs', () => {
    it('should return false for any invalid URL', () => {
      fc.assert(
        fc.property(invalidUrlArb, (input) => {
          const result = isValidMediaUrl(input);
          expect(result).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });
});
