/**
 * Property-based tests for Quick Links persistence
 * 
 * **Feature: dashboard-layout-enhancement, Property 11: Quick Links persistence round-trip**
 * **Validates: Requirements 5.8**
 * 
 * For any quick link added to the list, the link should be retrievable with the same
 * URL, title, and favicon URL after page reload.
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
  createQuickLink,
  getQuickLinks,
  getQuickLink,
  deleteQuickLink,
} from "@/app/actions/quickLinks";

// Arbitrary for valid UUIDs
const uuidArb = fc.uuid();

// Arbitrary for valid URLs
const urlArb = fc.webUrl({ withFragments: false, withQueryParameters: false });

// Arbitrary for valid titles
const titleArb = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);

// Arbitrary for favicon URLs (nullable)
const faviconUrlArb = fc.option(
  fc.webUrl({ withFragments: false, withQueryParameters: false }),
  { nil: null }
);

// Arbitrary for position
const positionArb = fc.nat({ max: 1000 });

describe("Property 11: Quick Links persistence round-trip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("For any quick link created, retrieving by ID should return the same URL, title, and favicon", async () => {
    const { supabase } = await import("@/lib/supabase");

    await fc.assert(
      fc.asyncProperty(
        uuidArb,
        urlArb,
        titleArb,
        faviconUrlArb,
        positionArb,
        async (userId, url, title, faviconUrl, position) => {
          const linkId = "123e4567-e89b-12d3-a456-426614174000";
          const now = new Date().toISOString();

          const mockCreatedLink = {
            id: linkId,
            user_id: userId,
            url: url,
            title: title,
            favicon_url: faviconUrl,
            position: position,
            created_at: now,
            updated_at: now,
          };

          // Setup mocks for creation
          const mockCreateSingle = vi.fn().mockResolvedValue({ 
            data: mockCreatedLink, 
            error: null 
          });
          const mockCreateSelect = vi.fn(() => ({ single: mockCreateSingle }));

          // Setup mocks for retrieval
          const mockRetrieveSingle = vi.fn().mockResolvedValue({ 
            data: mockCreatedLink, 
            error: null 
          });

          let callCount = 0;
          (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
            if (table === "quick_links") {
              callCount++;
              if (callCount === 1) {
                return { insert: vi.fn(() => ({ select: mockCreateSelect })) };
              } else {
                return { 
                  select: vi.fn(() => ({ 
                    eq: vi.fn(() => ({ single: mockRetrieveSingle })) 
                  })) 
                };
              }
            }
            return {};
          });

          // Create the quick link
          const createdLink = await createQuickLink({
            userId,
            url,
            title,
            faviconUrl,
            position,
          });

          // Verify created link has correct properties
          expect(createdLink.url).toBe(url);
          expect(createdLink.title).toBe(title);
          expect(createdLink.faviconUrl).toBe(faviconUrl);
          expect(createdLink.position).toBe(position);
          expect(createdLink.userId).toBe(userId);

          // Retrieve the link by ID
          const retrievedLink = await getQuickLink(linkId);

          // Verify round-trip: retrieved data matches created data exactly
          expect(retrievedLink).not.toBeNull();
          expect(retrievedLink!.url).toBe(url);
          expect(retrievedLink!.title).toBe(title);
          expect(retrievedLink!.faviconUrl).toBe(faviconUrl);
          expect(retrievedLink!.position).toBe(position);
          expect(retrievedLink!.userId).toBe(userId);
        }
      ),
      { numRuns: 100 }
    );
  });

  test("For any quick links created for a user, getQuickLinks should return all of them", async () => {
    const { supabase } = await import("@/lib/supabase");

    await fc.assert(
      fc.asyncProperty(
        uuidArb,
        fc.array(
          fc.record({
            url: urlArb,
            title: titleArb,
            faviconUrl: faviconUrlArb,
            position: positionArb,
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (userId, linksData) => {
          const now = new Date().toISOString();

          // Create mock links with IDs
          const mockLinks = linksData.map((link, index) => ({
            id: `123e4567-e89b-12d3-a456-42661417400${index}`,
            user_id: userId,
            url: link.url,
            title: link.title,
            favicon_url: link.faviconUrl,
            position: link.position,
            created_at: now,
            updated_at: now,
          }));

          // Setup mocks for retrieval
          const mockOrder = vi.fn().mockResolvedValue({ 
            data: mockLinks, 
            error: null 
          });
          const mockEq = vi.fn(() => ({ order: mockOrder }));

          (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
            if (table === "quick_links") {
              return { 
                select: vi.fn(() => ({ eq: mockEq })) 
              };
            }
            return {};
          });

          // Retrieve all links for user
          const retrievedLinks = await getQuickLinks(userId);

          // Verify all links are returned
          expect(retrievedLinks).toHaveLength(linksData.length);

          // Verify each link's data matches
          for (let i = 0; i < linksData.length; i++) {
            const original = linksData[i];
            const retrieved = retrievedLinks.find(
              (l) => l.url === original.url && l.title === original.title
            );
            expect(retrieved).toBeDefined();
            expect(retrieved!.url).toBe(original.url);
            expect(retrieved!.title).toBe(original.title);
            expect(retrieved!.faviconUrl).toBe(original.faviconUrl);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test("For any quick link deleted, it should no longer be retrievable", async () => {
    const { supabase } = await import("@/lib/supabase");

    await fc.assert(
      fc.asyncProperty(uuidArb, async (linkId) => {
        // Setup mocks for deletion
        const mockDeleteEq = vi.fn().mockResolvedValue({ error: null });

        // Setup mocks for retrieval after deletion (returns null)
        const mockRetrieveSingle = vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: "PGRST116", message: "No rows found" } 
        });

        let callCount = 0;
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
          if (table === "quick_links") {
            callCount++;
            if (callCount === 1) {
              return { delete: vi.fn(() => ({ eq: mockDeleteEq })) };
            } else {
              return { 
                select: vi.fn(() => ({ 
                  eq: vi.fn(() => ({ single: mockRetrieveSingle })) 
                })) 
              };
            }
          }
          return {};
        });

        // Delete the link
        await deleteQuickLink(linkId);

        // Verify delete was called
        expect(mockDeleteEq).toHaveBeenCalledWith("id", linkId);

        // Try to retrieve the deleted link
        const retrievedLink = await getQuickLink(linkId);

        // Verify link is no longer retrievable
        expect(retrievedLink).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  test("Quick link URL is preserved exactly through persistence", async () => {
    const { supabase } = await import("@/lib/supabase");

    // Test with various URL formats
    const specialUrlArb = fc.oneof(
      fc.constant("https://example.com"),
      fc.constant("https://sub.domain.example.com/path"),
      fc.constant("https://example.com/path/to/resource"),
      fc.constant("http://localhost:3000"),
      urlArb
    );

    await fc.assert(
      fc.asyncProperty(uuidArb, specialUrlArb, async (userId, url) => {
        const linkId = "123e4567-e89b-12d3-a456-426614174000";
        const now = new Date().toISOString();

        const mockLink = {
          id: linkId,
          user_id: userId,
          url: url,
          title: "Test Link",
          favicon_url: null,
          position: 0,
          created_at: now,
          updated_at: now,
        };

        const mockCreateSingle = vi.fn().mockResolvedValue({ 
          data: mockLink, 
          error: null 
        });
        const mockCreateSelect = vi.fn(() => ({ single: mockCreateSingle }));

        const mockRetrieveSingle = vi.fn().mockResolvedValue({ 
          data: mockLink, 
          error: null 
        });

        let callCount = 0;
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
          if (table === "quick_links") {
            callCount++;
            if (callCount === 1) {
              return { insert: vi.fn(() => ({ select: mockCreateSelect })) };
            } else {
              return { 
                select: vi.fn(() => ({ 
                  eq: vi.fn(() => ({ single: mockRetrieveSingle })) 
                })) 
              };
            }
          }
          return {};
        });

        const createdLink = await createQuickLink({
          userId,
          url,
          title: "Test Link",
          faviconUrl: null,
          position: 0,
        });

        expect(createdLink.url).toBe(url);

        const retrievedLink = await getQuickLink(linkId);
        expect(retrievedLink).not.toBeNull();
        expect(retrievedLink!.url).toBe(url);
      }),
      { numRuns: 100 }
    );
  });
});
