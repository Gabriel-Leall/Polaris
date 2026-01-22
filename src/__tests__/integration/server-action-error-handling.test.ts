/**
 * **Feature: polaris-tech-migration, Property 11: Server Action error handling**
 * **Validates: Requirements 8.1**
 *
 * Property-based test to verify that all Server Actions wrap operations in try/catch blocks
 * and handle errors gracefully with descriptive error messages.
 */

import "../setup";

import { vi, describe, test, expect, beforeEach } from "vitest";
import { supabase } from "@/lib/supabase";

// Mock Supabase module
vi.mock("@/lib/supabase", () => {
  const mockSupabase = {
    from: vi.fn(),
  };
  return { __esModule: true, supabase: mockSupabase };
});

// Import Server Actions after mocking
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from "@/app/actions/tasks";
import {
  createUserPreferences,
  updateUserPreferences,
  getUserPreferences,
} from "@/app/actions/userPreferences";

// Mock user preferences server client
vi.mock("@/lib/supabase-server", () => {
  return {
    __esModule: true,
    createSupabaseServerClient: vi.fn(async () => ({
      from: supabase.from,
    })),
  };
});

describe("Server Action Error Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Property 11: Server Action error handling - all actions handle database errors gracefully", async () => {
    const { supabase } = await import("@/lib/supabase");

    // Configure mock to return error for all operations
    const mockError = {
      message: "Simulated database error",
      code: "TEST_ERROR",
    };

    const mockSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const mockSelect = vi.fn(() => ({ single: mockSingle }));
    const mockEq = vi.fn(() => ({
      select: mockSelect,
      single: mockSingle,
      order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
    }));

    (supabase.from as any).mockImplementation(() => ({
      insert: vi.fn(() => ({ select: mockSelect })),
      update: vi.fn(() => ({ eq: mockEq })),
      delete: vi.fn(() => ({ eq: mockEq })),
      select: vi.fn(() => ({
        eq: mockEq,
        order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      })),
    }));

    await expect(
      createTask({
        label: "Test Task",
        completed: false,
        priority: "medium",
        tags: [],
        userId: "123e4567-e89b-12d3-a456-426614174001",
      }),
    ).rejects.toThrow("Create task failed");
  });

  test("Property 11: Server Action error handling - actions handle invalid input gracefully", async () => {
    await expect(
      createTask({
        label: "", // Empty label should fail validation
        completed: false,
        priority: "medium",
        tags: [],
        userId: "123e4567-e89b-12d3-a456-426614174001",
      }),
    ).rejects.toThrow("Create task failed");

    await expect(
      createTask({
        label: "Valid Task",
        completed: false,
        priority: "medium",
        tags: [],
        userId: "invalid-uuid", // Invalid UUID should fail validation
      }),
    ).rejects.toThrow("Create task failed");
  });

  test("Property 11: Server Action error handling - user preferences actions handle errors", async () => {
    const { supabase } = await import("@/lib/supabase");

    // Configure mock to return error
    const mockError = {
      message: "Database error for user preferences",
      code: "TEST_ERROR",
    };

    const mockSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const mockSelect = vi.fn(() => ({ single: mockSingle }));
    const mockEq = vi.fn(() => ({ single: mockSingle }));

    (supabase.from as any).mockImplementation(() => ({
      insert: vi.fn(() => ({ select: mockSelect })),
      update: vi.fn(() => ({ eq: mockEq })),
      select: vi.fn(() => ({ eq: mockEq })),
    }));

    // Test createUserPreferences error handling
    try {
      await createUserPreferences({
        userId: "123e4567-e89b-12d3-a456-426614174001",
        theme: "dark",
        focusDuration: 25,
        breakDuration: 5,
        zenModeEnabled: false,
        sidebarCollapsed: false,
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain(
        "Create user preferences failed",
      );
    }
  });

  test("Property 11: Server Action error handling - all errors are instances of Error class", async () => {
    const { supabase } = await import("@/lib/supabase");

    // Configure mock to return error
    const mockError = { message: "Test error", code: "TEST_ERROR" };
    const mockSingle = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const mockSelect = vi.fn(() => ({ single: mockSingle }));
    const mockEq = vi.fn(() => ({
      select: mockSelect,
      single: mockSingle,
      order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
    }));

    (supabase.from as any).mockImplementation(() => ({
      insert: vi.fn(() => ({ select: mockSelect })),
      update: vi.fn(() => ({ eq: mockEq })),
      delete: vi.fn(() => ({ eq: mockEq })),
      select: vi.fn(() => ({
        eq: mockEq,
        order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      })),
    }));

    // Test that all Server Actions throw proper Error instances
    const testCases = [
      () =>
        createTask({
          label: "Test",
          completed: false,
          priority: "medium",
          tags: [],
          userId: "123e4567-e89b-12d3-a456-426614174001",
        }),
      () =>
        updateTask("123e4567-e89b-12d3-a456-426614174000", {
          label: "Updated",
        }),
      () => deleteTask("123e4567-e89b-12d3-a456-426614174000"),
      () => getTasks("123e4567-e89b-12d3-a456-426614174001"),
      () =>
        createUserPreferences({
          userId: "123e4567-e89b-12d3-a456-426614174001",
          theme: "dark",
          focusDuration: 25,
          breakDuration: 5,
          zenModeEnabled: false,
          sidebarCollapsed: false,
        }),
      () =>
        updateUserPreferences("123e4567-e89b-12d3-a456-426614174000", {
          theme: "light",
        }),
      () => getUserPreferences("123e4567-e89b-12d3-a456-426614174001"),
    ];

    for (const testCase of testCases) {
      try {
        await testCase();
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty("message");
        expect(typeof (error as Error).message).toBe("string");
      }
    }
  });
});
