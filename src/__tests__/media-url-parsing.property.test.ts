/**
 * Property-based tests for media URL parsing utilities
 * 
 * **Feature: dashboard-layout-enhancement, Property 1: Media URL validation and parsing**
 * **Validates: Requirements 2.2, 2.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  parseSpotifyUrl,
  parseYouTubeUrl,
  generateEmbedUrl,
  generateSpotifyEmbedUrl,
  generateYouTubeEmbedUrl,
} from '@/lib/media-utils';

// Arbitrary for valid Spotify IDs (alphanumeric, typically 22 chars)
const spotifyIdArb = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'),
  { minLength: 1, maxLength: 30 }
);

// Arbitrary for Spotify types
const spotifyTypeArb = fc.constantFrom('playlist', 'track', 'album') as fc.Arbitrary<'playlist' | 'track' | 'album'>;

// Arbitrary for valid YouTube video IDs (11 chars, alphanumeric with - and _)
const youtubeIdArb = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'),
  { minLength: 11, maxLength: 11 }
);

describe('Property 1: Media URL validation and parsing', () => {
  describe('Spotify URL parsing', () => {
    it('should correctly parse valid Spotify web URLs', () => {
      fc.assert(
        fc.property(spotifyTypeArb, spotifyIdArb, (type, id) => {
          const url = `https://open.spotify.com/${type}/${id}`;
          const result = parseSpotifyUrl(url);
          
          expect(result).not.toBeNull();
          expect(result?.type).toBe(type);
          expect(result?.id).toBe(id);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly parse valid Spotify URI format', () => {
      fc.assert(
        fc.property(spotifyTypeArb, spotifyIdArb, (type, id) => {
          const uri = `spotify:${type}:${id}`;
          const result = parseSpotifyUrl(uri);
          
          expect(result).not.toBeNull();
          expect(result?.type).toBe(type);
          expect(result?.id).toBe(id);
        }),
        { numRuns: 100 }
      );
    });

    it('should generate correct Spotify embed URLs', () => {
      fc.assert(
        fc.property(spotifyTypeArb, spotifyIdArb, (type, id) => {
          const embedUrl = generateSpotifyEmbedUrl(type, id);
          
          expect(embedUrl).toBe(`https://open.spotify.com/embed/${type}/${id}`);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('YouTube URL parsing', () => {
    it('should correctly parse valid YouTube watch URLs', () => {
      fc.assert(
        fc.property(youtubeIdArb, (videoId) => {
          const url = `https://www.youtube.com/watch?v=${videoId}`;
          const result = parseYouTubeUrl(url);
          
          expect(result).not.toBeNull();
          expect(result?.videoId).toBe(videoId);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly parse valid YouTube short URLs (youtu.be)', () => {
      fc.assert(
        fc.property(youtubeIdArb, (videoId) => {
          const url = `https://youtu.be/${videoId}`;
          const result = parseYouTubeUrl(url);
          
          expect(result).not.toBeNull();
          expect(result?.videoId).toBe(videoId);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly parse valid YouTube embed URLs', () => {
      fc.assert(
        fc.property(youtubeIdArb, (videoId) => {
          const url = `https://www.youtube.com/embed/${videoId}`;
          const result = parseYouTubeUrl(url);
          
          expect(result).not.toBeNull();
          expect(result?.videoId).toBe(videoId);
        }),
        { numRuns: 100 }
      );
    });

    it('should generate correct YouTube embed URLs', () => {
      fc.assert(
        fc.property(youtubeIdArb, (videoId) => {
          const embedUrl = generateYouTubeEmbedUrl(videoId);
          
          expect(embedUrl).toBe(`https://www.youtube.com/embed/${videoId}`);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Combined media URL parsing', () => {
    it('should correctly identify and parse Spotify URLs via generateEmbedUrl', () => {
      fc.assert(
        fc.property(spotifyTypeArb, spotifyIdArb, (type, id) => {
          const url = `https://open.spotify.com/${type}/${id}`;
          const result = generateEmbedUrl(url);
          
          expect(result).not.toBeNull();
          expect(result?.type).toBe('spotify');
          expect(result?.id).toBe(id);
          expect(result?.embedUrl).toBe(`https://open.spotify.com/embed/${type}/${id}`);
        }),
        { numRuns: 100 }
      );
    });

    it('should correctly identify and parse YouTube URLs via generateEmbedUrl', () => {
      fc.assert(
        fc.property(youtubeIdArb, (videoId) => {
          const url = `https://www.youtube.com/watch?v=${videoId}`;
          const result = generateEmbedUrl(url);
          
          expect(result).not.toBeNull();
          expect(result?.type).toBe('youtube');
          expect(result?.id).toBe(videoId);
          expect(result?.embedUrl).toBe(`https://www.youtube.com/embed/${videoId}`);
        }),
        { numRuns: 100 }
      );
    });
  });
});
