/**
 * Property-based tests for Brain Dump content persistence
 * 
 * **Feature: dashboard-layout-enhancement, Property 9: Brain Dump content persistence round-trip**
 * **Validates: Requirements 4.7, 4.8**
 * 
 * For any valid HTML content saved to the Brain Dump, loading the widget should
 * restore the exact same content.
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
  saveBrainDumpNote,
  getBrainDumpNote,
  createBrainDumpNote,
} from "@/app/actions/brainDumpNotes";

// Arbitrary for valid UUIDs
const uuidArb = fc.uuid();

// Arbitrary for plain text content
const plainTextArb = fc.string({ minLength: 0, maxLength: 5000 });

// Arbitrary for simple HTML content
const simpleHtmlArb = fc.oneof(
  fc.constant("<p>Hello World</p>"),
  fc.constant("<p><strong>Bold text</strong></p>"),
  fc.constant("<p><em>Italic text</em></p>"),
  fc.constant("<p><code>Code block</code></p>"),
  fc.constant("<ul><li>Item 1</li><li>Item 2</li></ul>"),
  fc.constant("<ol><li>First</li><li>Second</li></ol>"),
  fc.constant("<p>Text with <a href=\"https://example.com\">link</a></p>"),
  plainTextArb.map(text => `<p>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
);

// Arbitrary for HTML content with various formatting
const htmlContentArb = fc.array(simpleHtmlArb, { minLength: 1, maxLength: 5 })
  .map(parts => parts.join(''));

// Arbitrary for version numbers
const versionArb = fc.nat({ max: 1000 }).map(n => n + 1);

describe("Property 9: Brain Dump content persistence round-trip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("For any plain text content saved, loading should return the exact same content", async () => {
    const { supabase } = await import("@/lib/supabase");

    await fc.assert(
      fc.asyncProperty(uuidArb, plainTextArb, async (userId, content) => {
        const noteId = "123e4567-e89b-12d3-a456-426614174000";
        const now = new Date().toISOString();

        const mockNote = {
          id: noteId,
          user_id: userId,
          content: content,
          content_html: null,
          version: 1,
          created_at: now,
          updated_at: now,
        };

        // Setup mocks for get (returns null - no existing note)
        const mockGetSingle = vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: "PGRST116", message: "No rows found" } 
        });
        const mockGetLimit = vi.fn(() => ({ single: mockGetSingle }));
        const mockGetOrder = vi.fn(() => ({ limit: mockGetLimit }));
        const mockGetEq = vi.fn(() => ({ order: mockGetOrder }));

        // Setup mocks for creation
        const mockCreateSingle = vi.fn().mockResolvedValue({ 
          data: mockNote, 
          error: null 
        });
        const mockCreateSelect = vi.fn(() => ({ single: mockCreateSingle }));

        // Setup mocks for retrieval after save
        const mockRetrieveSingle = vi.fn().mockResolvedValue({ 
          data: mockNote, 
          error: null 
        });
        const mockRetrieveLimit = vi.fn(() => ({ single: mockRetrieveSingle }));
        const mockRetrieveOrder = vi.fn(() => ({ limit: mockRetrieveLimit }));
        const mockRetrieveEq = vi.fn(() => ({ order: mockRetrieveOrder }));

        let callCount = 0;
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
          if (table === "brain_dump_notes") {
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

        // Save the note
        const savedNote = await saveBrainDumpNote(userId, content);

        // Verify saved note has correct content
        expect(savedNote.content).toBe(content);
        expect(savedNote.userId).toBe(userId);

        // Retrieve the note
        const retrievedNote = await getBrainDumpNote(userId);

        // Verify round-trip: retrieved content matches saved content exactly
        expect(retrievedNote).not.toBeNull();
        expect(retrievedNote!.content).toBe(content);
        expect(retrievedNote!.userId).toBe(userId);
      }),
      { numRuns: 100 }
    );
  });

  test("For any HTML content saved, loading should return the exact same HTML", async () => {
    const { supabase } = await import("@/lib/supabase");

    await fc.assert(
      fc.asyncProperty(uuidArb, plainTextArb, htmlContentArb, async (userId, content, contentHtml) => {
        const noteId = "123e4567-e89b-12d3-a456-426614174000";
        const now = new Date().toISOString();

        const mockNote = {
          id: noteId,
          user_id: userId,
          content: content,
          content_html: contentHtml,
          version: 1,
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
          data: mockNote, 
          error: null 
        });
        const mockCreateSelect = vi.fn(() => ({ single: mockCreateSingle }));

        const mockRetrieveSingle = vi.fn().mockResolvedValue({ 
          data: mockNote, 
          error: null 
        });
        const mockRetrieveLimit = vi.fn(() => ({ single: mockRetrieveSingle }));
        const mockRetrieveOrder = vi.fn(() => ({ limit: mockRetrieveLimit }));
        const mockRetrieveEq = vi.fn(() => ({ order: mockRetrieveOrder }));

        let callCount = 0;
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
          if (table === "brain_dump_notes") {
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

        // Save the note with HTML content
        const savedNote = await saveBrainDumpNote(userId, content, contentHtml);

        // Verify saved note has correct HTML content
        expect(savedNote.content).toBe(content);
        expect(savedNote.contentHtml).toBe(contentHtml);

        // Retrieve the note
        const retrievedNote = await getBrainDumpNote(userId);

        // Verify round-trip: retrieved HTML matches saved HTML exactly
        expect(retrievedNote).not.toBeNull();
        expect(retrievedNote!.content).toBe(content);
        expect(retrievedNote!.contentHtml).toBe(contentHtml);
      }),
      { numRuns: 100 }
    );
  });

  test("Version number increments on each save for existing notes", async () => {
    const { supabase } = await import("@/lib/supabase");

    await fc.assert(
      fc.asyncProperty(uuidArb, plainTextArb, versionArb, async (userId, content, initialVersion) => {
        const noteId = "123e4567-e89b-12d3-a456-426614174000";
        const now = new Date().toISOString();

        // Existing note with initial version
        const existingNote = {
          id: noteId,
          user_id: userId,
          content: "old content",
          content_html: null,
          version: initialVersion,
          created_at: now,
          updated_at: now,
        };

        // Updated note with incremented version
        const updatedNote = {
          ...existingNote,
          content: content,
          version: initialVersion + 1,
        };

        // Setup mocks for get (returns existing note)
        const mockGetSingle = vi.fn().mockResolvedValue({ 
          data: existingNote, 
          error: null 
        });
        const mockGetLimit = vi.fn(() => ({ single: mockGetSingle }));
        const mockGetOrder = vi.fn(() => ({ limit: mockGetLimit }));
        const mockGetEq = vi.fn(() => ({ order: mockGetOrder }));

        // Setup mocks for update
        const mockUpdateSingle = vi.fn().mockResolvedValue({ 
          data: updatedNote, 
          error: null 
        });
        const mockUpdateSelect = vi.fn(() => ({ single: mockUpdateSingle }));
        const mockUpdateEq = vi.fn(() => ({ select: mockUpdateSelect }));

        let callCount = 0;
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
          if (table === "brain_dump_notes") {
            callCount++;
            if (callCount === 1) {
              return { select: vi.fn(() => ({ eq: mockGetEq })) };
            } else {
              return { update: vi.fn(() => ({ eq: mockUpdateEq })) };
            }
          }
          return {};
        });

        // Save the note (should update existing)
        const savedNote = await saveBrainDumpNote(userId, content);

        // Verify version was incremented
        expect(savedNote.version).toBe(initialVersion + 1);
        expect(savedNote.content).toBe(content);
      }),
      { numRuns: 100 }
    );
  });

  test("Content with special characters is preserved through persistence", async () => {
    const { supabase } = await import("@/lib/supabase");

    // Test with various special characters
    const specialContentArb = fc.oneof(
      fc.constant("Content with 'quotes' and \"double quotes\""),
      fc.constant("Content with <angle> brackets"),
      fc.constant("Content with & ampersand"),
      fc.constant("Unicode: 你好世界 🎉 émojis"),
      fc.constant("Newlines:\nLine 1\nLine 2"),
      fc.constant("Tabs:\tTabbed\tContent"),
      plainTextArb
    );

    await fc.assert(
      fc.asyncProperty(uuidArb, specialContentArb, async (userId, content) => {
        const noteId = "123e4567-e89b-12d3-a456-426614174000";
        const now = new Date().toISOString();

        const mockNote = {
          id: noteId,
          user_id: userId,
          content: content,
          content_html: null,
          version: 1,
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
          data: mockNote, 
          error: null 
        });
        const mockCreateSelect = vi.fn(() => ({ single: mockCreateSingle }));

        const mockRetrieveSingle = vi.fn().mockResolvedValue({ 
          data: mockNote, 
          error: null 
        });
        const mockRetrieveLimit = vi.fn(() => ({ single: mockRetrieveSingle }));
        const mockRetrieveOrder = vi.fn(() => ({ limit: mockRetrieveLimit }));
        const mockRetrieveEq = vi.fn(() => ({ order: mockRetrieveOrder }));

        let callCount = 0;
        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
          if (table === "brain_dump_notes") {
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

        const savedNote = await saveBrainDumpNote(userId, content);
        expect(savedNote.content).toBe(content);

        const retrievedNote = await getBrainDumpNote(userId);
        expect(retrievedNote).not.toBeNull();
        expect(retrievedNote!.content).toBe(content);
      }),
      { numRuns: 100 }
    );
  });
});
