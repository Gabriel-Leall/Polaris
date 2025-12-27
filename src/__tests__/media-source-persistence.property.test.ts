/**
 * Property-based tests for media source persistence
 * 
 * **Feature: dashboard-layout-enhancement, Property 2: Media source persistence round-trip**
 * **Validates: Requirements 2.7**
 * 
 * For any valid media source URL saved to user preferences, loading the preferences
 * should return the exact same URL.
 */

import "./setup";
import * as fc from "fast-check";
import { vi, describe, test, expect, beforeEach } from "vitest";

// Mock the Supabase module before importing Server Actions
vi.mock("@/lib/supabase", () => {
  const mockSupabase = {
    from: vi.fn(),
  };
  return { supabase: mockSupabase };
});

// Import Server Actions after mocking
import {
  saveMediaPreference,
  getMediaPreference,
  createMediaPreference,
} from "@/app/actions/mediaPreferences";

// Arbitrary for valid Spotify IDs
const spotifyIdArb = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'),
  { minLength: 1, maxLength: 30 }
);

// Arbitrary for Spotify types
const spotifyTypeArb = fc.constantFrom('playlist', 'track', 'album');

// Arbitrary for valid YouTube video IDs
const youtubeIdArb = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'),
  { minLength: 11, maxLength: 11 }
);

// Arbitrary for media source type
const mediaSourceTypeArb = fc.constantFrom('spotify', 'youtube') as fc.Arbitrary<'spotify' | 'youtube'>;

// Arbitrary for valid UUIDs
const uuidArb = fc.uuid();

// Generate valid Spotify URLs
const spotifyUrlArb = fc.tuple(spotifyTypeArb, spotifyIdArb).map(
  ([type, id]) => `https://open.spotify.com/${type}/${id}`
);

// Generate valid YouTube URLs
const youtubeUrlArb = youtubeIdArb.map(
  (videoId) => `https://www.youtube.com/watch?v=${videoId}`
);

describe("Property 2: Media source persistence round-trip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("For any valid Spotify URL saved, loading should return the exact same URL", async () => {
    const { supabase } = await import("@/lib/supabase");

    await fc.assert(
      fc.asyncProperty(uuidArb, spotifyUrlArb, async (userId, sourceUrl) => {
        const sourceType = 'spotify' as const;
        const preferenceId = "123e4567-e89b-12d3-a456-426614174000";
        const now = new Date().toISOString();

        // Mock created preference
        const mockCreatedPreference = {
          id: preferenceId,
          user_id: userId,
          source_type: sourceType,
          source_url: sourceUrl,
          created_at: now,
          updated_at: now,
        };

        // Setup mocks for creation (when no existing preference)
        const mockGetSingle = vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: "PGRST116", message: "No rows found" } 
        });
        const mockGetLimit = vi.fn(() => ({ single: mockGetSingle }));
        const mockGetOrder = vi.fn(() => ({ limit: mockGetLimit }));
        const mockGetEq = vi.fn(() => ({ order: mockGetOrder }));

        const mockCreateSingle = vi.fn().mockResolvedValue({ 
          data: mockCreatedPreference, 
          error: null 
        });
        const mockCreateSelect = vi.fn(() => ({ single: mockCreateSingle }));

        // Setup mocks for retrieval after save
        const mockRetrieveSingle = vi.fn().mockResolvedValue({ 
          data: mockCreatedPreference, 
          error: null 
        });
        const mockRetrieveLimit = vi.fn(() => ({ single: mockRetrieveSingle }));
        const mockRetrieveOrder = vi.fn(() => ({ limit: mockRetrieveLimit }));
        const mockRetrieveEq = vi.fn(() => ({ order: mockRetrieveOrder }));

        let callCount = 0;
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
          if (table === "media_preferences") {
            callCount++;
            // First call is getMediaPreference (returns null), second is create, third is get
            if (callCount === 1) {
              return {
                select: vi.fn(() => ({ eq: mockGetEq })),
              };
            } else if (callCount === 2) {
              return {
                insert: vi.fn(() => ({ select: mockCreateSelect })),
              };
            } else {
              return {
                select: vi.fn(() => ({ eq: mockRetrieveEq })),
              };
            }
          }
          return {};
        });

        // Save the media preference
        const savedPreference = await saveMediaPreference(userId, sourceType, sourceUrl);

        // Verify saved preference has correct URL
        expect(savedPreference.sourceUrl).toBe(sourceUrl);
        expect(savedPreference.sourceType).toBe(sourceType);
        expect(savedPreference.userId).toBe(userId);

        // Retrieve the preference
        const retrievedPreference = await getMediaPreference(userId);

        // Verify round-trip: retrieved URL matches saved URL exactly
        expect(retrievedPreference).not.toBeNull();
        expect(retrievedPreference!.sourceUrl).toBe(sourceUrl);
        expect(retrievedPreference!.sourceType).toBe(sourceType);
        expect(retrievedPreference!.userId).toBe(userId);
      }),
      { numRuns: 100 }
    );
  });

  test("For any valid YouTube URL saved, loading should return the exact same URL", async () => {
    const { supabase } = await import("@/lib/supabase");

    await fc.assert(
      fc.asyncProperty(uuidArb, youtubeUrlArb, async (userId, sourceUrl) => {
        const sourceType = 'youtube' as const;
        const preferenceId = "123e4567-e89b-12d3-a456-426614174000";
        const now = new Date().toISOString();

        const mockCreatedPreference = {
          id: preferenceId,
          user_id: userId,
          source_type: sourceType,
          source_url: sourceUrl,
          created_at: now,
          updated_at: now,
        };

        const mockGetSingle = vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: "PGRST116", message: "No rows found" } 
        });
        const mockGetLimit = vi.fn(() => ({ single: mockGetSingle }));
        const mockGetOrder = vi.fn(() => ({ limit: mockGetLimit }));
        const mockGetEq = vi.fn(() => ({ order: mockGetOrder }));

        const mockCreateSingle = vi.fn().mockResolvedValue({ 
          data: mockCreatedPreference, 
          error: null 
        });
        const mockCreateSelect = vi.fn(() => ({ single: mockCreateSingle }));

        const mockRetrieveSingle = vi.fn().mockResolvedValue({ 
          data: mockCreatedPreference, 
          error: null 
        });
        const mockRetrieveLimit = vi.fn(() => ({ single: mockRetrieveSingle }));
        const mockRetrieveOrder = vi.fn(() => ({ limit: mockRetrieveLimit }));
        const mockRetrieveEq = vi.fn(() => ({ order: mockRetrieveOrder }));

        let callCount = 0;
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
          if (table === "media_preferences") {
            callCount++;
            if (callCount === 1) {
              return { select: vi.fn(() => ({ eq: mockGetEq })) };
            } else if (callCount === 2) {
              return { insert: vi.fn(() => ({ select: mockCreateSelect })) };
            } else {
              return { select: vi.fn(() => ({ eq: mockRetrieveEq })) };
            }
          }
          return {};
        });

        const savedPreference = await saveMediaPreference(userId, sourceType, sourceUrl);

        expect(savedPreference.sourceUrl).toBe(sourceUrl);
        expect(savedPreference.sourceType).toBe(sourceType);

        const retrievedPreference = await getMediaPreference(userId);

        expect(retrievedPreference).not.toBeNull();
        expect(retrievedPreference!.sourceUrl).toBe(sourceUrl);
        expect(retrievedPreference!.sourceType).toBe(sourceType);
      }),
      { numRuns: 100 }
    );
  });

  test("For any media source type, the type is preserved through save and load", async () => {
    const { supabase } = await import("@/lib/supabase");

    await fc.assert(
      fc.asyncProperty(
        uuidArb, 
        mediaSourceTypeArb, 
        fc.oneof(spotifyUrlArb, youtubeUrlArb),
        async (userId, sourceType, sourceUrl) => {
          const preferenceId = "123e4567-e89b-12d3-a456-426614174000";
          const now = new Date().toISOString();

          const mockPreference = {
            id: preferenceId,
            user_id: userId,
            source_type: sourceType,
            source_url: sourceUrl,
            created_at: now,
            updated_at: now,
          };

          const mockGetSingle = vi.fn().mockResolvedValue({ 
            data: null, 
            error: { code: "PGRST116", message: "No rows found" } 
          });
          const mockGetLimit = vi.fn(() => ({ single: mockGetSingle }));
          const mockGetOrder = vi.fn(() => ({ limit: mockGetLimit }));
          const mockGetEq = vi.fn(() => ({ order: mockGetOrder }));

          const mockCreateSingle = vi.fn().mockResolvedValue({ 
            data: mockPreference, 
            error: null 
          });
          const mockCreateSelect = vi.fn(() => ({ single: mockCreateSingle }));

          const mockRetrieveSingle = vi.fn().mockResolvedValue({ 
            data: mockPreference, 
            error: null 
          });
          const mockRetrieveLimit = vi.fn(() => ({ single: mockRetrieveSingle }));
          const mockRetrieveOrder = vi.fn(() => ({ limit: mockRetrieveLimit }));
          const mockRetrieveEq = vi.fn(() => ({ order: mockRetrieveOrder }));

          let callCount = 0;
          (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
            if (table === "media_preferences") {
              callCount++;
              if (callCount === 1) {
                return { select: vi.fn(() => ({ eq: mockGetEq })) };
              } else if (callCount === 2) {
                return { insert: vi.fn(() => ({ select: mockCreateSelect })) };
              } else {
                return { select: vi.fn(() => ({ eq: mockRetrieveEq })) };
              }
            }
            return {};
          });

          const savedPreference = await saveMediaPreference(userId, sourceType, sourceUrl);
          expect(savedPreference.sourceType).toBe(sourceType);

          const retrievedPreference = await getMediaPreference(userId);
          expect(retrievedPreference).not.toBeNull();
          expect(retrievedPreference!.sourceType).toBe(sourceType);
        }
      ),
      { numRuns: 100 }
    );
  });
});
