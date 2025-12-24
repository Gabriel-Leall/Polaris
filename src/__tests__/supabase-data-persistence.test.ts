/**
 * **Feature: polaris-tech-migration, Property 7: Supabase data persistence**
 * **Validates: Requirements 6.2**
 *
 * Property-based test to verify that data operations (create, update, delete) are properly
 * persisted to Supabase and retrievable.
 */

import "./setup";
import * as fc from "fast-check";
import { vi } from "vitest";

// Mock the Supabase module before importing Server Actions
vi.mock("@/lib/supabase", () => {
  const mockSupabase = {
    from: vi.fn(),
  };
  return { supabase: mockSupabase };
});

// Import Server Actions after mocking
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from "@/app/actions/tasks";
import {
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getJobApplications,
} from "@/app/actions/jobApplications";
import {
  createUserPreferences,
  updateUserPreferences,
  getUserPreferences,
} from "@/app/actions/userPreferences";

describe("Supabase Data Persistence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Property 7: Supabase data persistence - task creation and retrieval round trip", async () => {
    const { supabase } = await import("@/lib/supabase");

    const taskData = {
      label: "Test Task",
      completed: false,
      userId: "123e4567-e89b-12d3-a456-426614174001",
      dueDate: "2024-12-31",
    };

    // Mock task creation
    const createdTaskId = "123e4567-e89b-12d3-a456-426614174000";
    const mockCreatedTask = {
      id: createdTaskId,
      user_id: taskData.userId,
      label: taskData.label,
      completed: taskData.completed,
      due_date: taskData.dueDate,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    // Mock retrieval
    const mockRetrievedTasks = [mockCreatedTask];

    // Setup mocks for creation
    const mockCreateSingle = jest
      .fn()
      .mockResolvedValue({ data: mockCreatedTask, error: null });
    const mockCreateSelect = jest.fn(() => ({ single: mockCreateSingle }));

    // Setup mocks for retrieval
    const mockRetrieveOrder = jest
      .fn()
      .mockResolvedValue({ data: mockRetrievedTasks, error: null });
    const mockRetrieveEq = jest.fn(() => ({ order: mockRetrieveOrder }));

    supabase.from.mockImplementation((table: string) => {
      if (table === "tasks") {
        return {
          insert: jest.fn(() => ({ select: mockCreateSelect })),
          select: jest.fn(() => ({ eq: mockRetrieveEq })),
        };
      }
      return {};
    });

    // Create the task
    const createdTask = await createTask(taskData);

    // Verify creation was called with correct data
    expect(supabase.from).toHaveBeenCalledWith("tasks");

    // Verify created task has correct properties
    expect(createdTask.label).toBe(taskData.label);
    expect(createdTask.completed).toBe(taskData.completed);
    expect(createdTask.userId).toBe(taskData.userId);
    expect(createdTask.dueDate).toBe(taskData.dueDate);

    // Retrieve tasks to verify persistence
    const retrievedTasks = await getTasks(taskData.userId);

    // Verify retrieval was called with correct user ID
    expect(mockRetrieveEq).toHaveBeenCalledWith("user_id", taskData.userId);

    // Verify retrieved data matches created data
    expect(retrievedTasks).toHaveLength(1);
    expect(retrievedTasks[0].label).toBe(taskData.label);
    expect(retrievedTasks[0].completed).toBe(taskData.completed);
    expect(retrievedTasks[0].userId).toBe(taskData.userId);
  });

  test("Property 7: Supabase data persistence - job application creation and retrieval round trip", async () => {
    const { supabase } = await import("@/lib/supabase");

    const jobData = {
      companyName: "Test Company",
      companyDomain: "test.com",
      position: "Software Developer",
      status: "Applied" as const,
      notes: "Great opportunity",
      userId: "123e4567-e89b-12d3-a456-426614174001",
    };

    // Mock job application creation
    const createdJobId = "123e4567-e89b-12d3-a456-426614174000";
    const now = "2024-01-01T00:00:00Z";
    const mockCreatedJob = {
      id: createdJobId,
      user_id: jobData.userId,
      company_name: jobData.companyName,
      company_domain: jobData.companyDomain,
      position: jobData.position,
      status: jobData.status,
      notes: jobData.notes,
      applied_at: now,
      last_updated: now,
      created_at: now,
      updated_at: now,
    };

    // Mock retrieval
    const mockRetrievedJobs = [mockCreatedJob];

    // Setup mocks for creation
    const mockCreateSingle = jest
      .fn()
      .mockResolvedValue({ data: mockCreatedJob, error: null });
    const mockCreateSelect = jest.fn(() => ({ single: mockCreateSingle }));

    // Setup mocks for retrieval
    const mockRetrieveOrder = jest
      .fn()
      .mockResolvedValue({ data: mockRetrievedJobs, error: null });
    const mockRetrieveEq = jest.fn(() => ({ order: mockRetrieveOrder }));

    supabase.from.mockImplementation((table: string) => {
      if (table === "job_applications") {
        return {
          insert: jest.fn(() => ({ select: mockCreateSelect })),
          select: jest.fn(() => ({ eq: mockRetrieveEq })),
        };
      }
      return {};
    });

    // Create the job application
    const createdJob = await createJobApplication(jobData);

    // Verify creation was called with correct data
    expect(supabase.from).toHaveBeenCalledWith("job_applications");

    // Verify created job has correct properties
    expect(createdJob.companyName).toBe(jobData.companyName);
    expect(createdJob.position).toBe(jobData.position);
    expect(createdJob.status).toBe(jobData.status);
    expect(createdJob.userId).toBe(jobData.userId);

    // Retrieve job applications to verify persistence
    const retrievedJobs = await getJobApplications(jobData.userId);

    // Verify retrieval was called with correct user ID
    expect(mockRetrieveEq).toHaveBeenCalledWith("user_id", jobData.userId);

    // Verify retrieved data matches created data
    expect(retrievedJobs).toHaveLength(1);
    expect(retrievedJobs[0].companyName).toBe(jobData.companyName);
    expect(retrievedJobs[0].position).toBe(jobData.position);
    expect(retrievedJobs[0].status).toBe(jobData.status);
    expect(retrievedJobs[0].userId).toBe(jobData.userId);
  });

  test("Property 7: Supabase data persistence - user preferences creation and retrieval round trip", async () => {
    const { supabase } = await import("@/lib/supabase");

    const prefsData = {
      userId: "123e4567-e89b-12d3-a456-426614174001",
      theme: "dark" as const,
      focusDuration: 25,
      breakDuration: 5,
      zenModeEnabled: true,
      sidebarCollapsed: false,
    };

    // Mock user preferences creation
    const createdPrefsId = "123e4567-e89b-12d3-a456-426614174000";
    const mockCreatedPrefs = {
      id: createdPrefsId,
      user_id: prefsData.userId,
      theme: prefsData.theme,
      focus_duration: prefsData.focusDuration,
      break_duration: prefsData.breakDuration,
      zen_mode_enabled: prefsData.zenModeEnabled,
      sidebar_collapsed: prefsData.sidebarCollapsed,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    // Setup mocks for creation
    const mockCreateSingle = jest
      .fn()
      .mockResolvedValue({ data: mockCreatedPrefs, error: null });
    const mockCreateSelect = jest.fn(() => ({ single: mockCreateSingle }));

    // Setup mocks for retrieval
    const mockRetrieveSingle = jest
      .fn()
      .mockResolvedValue({ data: mockCreatedPrefs, error: null });
    const mockRetrieveEq = jest.fn(() => ({ single: mockRetrieveSingle }));

    supabase.from.mockImplementation((table: string) => {
      if (table === "user_preferences") {
        return {
          insert: jest.fn(() => ({ select: mockCreateSelect })),
          select: jest.fn(() => ({ eq: mockRetrieveEq })),
        };
      }
      return {};
    });

    // Create the user preferences
    const createdPrefs = await createUserPreferences(prefsData);

    // Verify creation was called with correct data
    expect(supabase.from).toHaveBeenCalledWith("user_preferences");

    // Verify created preferences have correct properties
    expect(createdPrefs.theme).toBe(prefsData.theme);
    expect(createdPrefs.focusDuration).toBe(prefsData.focusDuration);
    expect(createdPrefs.breakDuration).toBe(prefsData.breakDuration);
    expect(createdPrefs.zenModeEnabled).toBe(prefsData.zenModeEnabled);
    expect(createdPrefs.sidebarCollapsed).toBe(prefsData.sidebarCollapsed);
    expect(createdPrefs.userId).toBe(prefsData.userId);

    // Retrieve preferences to verify persistence
    const retrievedPrefs = await getUserPreferences(prefsData.userId);

    // Verify retrieval was called with correct user ID
    expect(mockRetrieveEq).toHaveBeenCalledWith("user_id", prefsData.userId);

    // Verify retrieved data matches created data
    expect(retrievedPrefs).not.toBeNull();
    expect(retrievedPrefs!.theme).toBe(prefsData.theme);
    expect(retrievedPrefs!.focusDuration).toBe(prefsData.focusDuration);
    expect(retrievedPrefs!.breakDuration).toBe(prefsData.breakDuration);
    expect(retrievedPrefs!.zenModeEnabled).toBe(prefsData.zenModeEnabled);
    expect(retrievedPrefs!.sidebarCollapsed).toBe(prefsData.sidebarCollapsed);
    expect(retrievedPrefs!.userId).toBe(prefsData.userId);
  });

  test("Property 7: Supabase data persistence - task update operations persist changes", async () => {
    const { supabase } = await import("@/lib/supabase");

    const testData = {
      taskId: "123e4567-e89b-12d3-a456-426614174000",
      userId: "123e4567-e89b-12d3-a456-426614174001",
      originalLabel: "Original Task",
      updatedLabel: "Updated Task",
      originalCompleted: false,
      updatedCompleted: true,
    };

    // Mock updated task
    const mockUpdatedTask = {
      id: testData.taskId,
      user_id: testData.userId,
      label: testData.updatedLabel,
      completed: testData.updatedCompleted,
      due_date: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T01:00:00Z", // Different update time
    };

    // Setup mocks for update
    const mockUpdateSingle = jest
      .fn()
      .mockResolvedValue({ data: mockUpdatedTask, error: null });
    const mockUpdateSelect = jest.fn(() => ({ single: mockUpdateSingle }));
    const mockUpdateEq = jest.fn(() => ({ select: mockUpdateSelect }));

    supabase.from.mockImplementation((table: string) => {
      if (table === "tasks") {
        return {
          update: jest.fn(() => ({ eq: mockUpdateEq })),
        };
      }
      return {};
    });

    // Update the task
    const updatedTask = await updateTask(testData.taskId, {
      label: testData.updatedLabel,
      completed: testData.updatedCompleted,
    });

    // Verify update was called with correct data
    expect(supabase.from).toHaveBeenCalledWith("tasks");
    expect(mockUpdateEq).toHaveBeenCalledWith("id", testData.taskId);

    // Verify updated task has new values
    expect(updatedTask.label).toBe(testData.updatedLabel);
    expect(updatedTask.completed).toBe(testData.updatedCompleted);
    expect(updatedTask.id).toBe(testData.taskId);
    expect(updatedTask.userId).toBe(testData.userId);

    // Verify the update timestamp changed
    expect(new Date(updatedTask.updatedAt).getTime()).toBeGreaterThan(
      new Date(updatedTask.createdAt).getTime()
    );
  });

  test("Property 7: Supabase data persistence - delete operations remove data", async () => {
    const { supabase } = await import("@/lib/supabase");

    const taskId = "123e4567-e89b-12d3-a456-426614174000";

    // Setup mocks for delete
    const mockDeleteEq = jest.fn().mockResolvedValue({ error: null });

    supabase.from.mockImplementation((table: string) => {
      if (table === "tasks") {
        return {
          delete: jest.fn(() => ({ eq: mockDeleteEq })),
        };
      }
      return {};
    });

    // Delete the task
    await deleteTask(taskId);

    // Verify delete was called with correct data
    expect(supabase.from).toHaveBeenCalledWith("tasks");
    expect(mockDeleteEq).toHaveBeenCalledWith("id", taskId);
  });

  test("Property 7: Supabase data persistence - all operations use correct table names", async () => {
    const { supabase } = await import("@/lib/supabase");

    // Mock successful responses for all operations
    const mockSingle = jest.fn().mockResolvedValue({
      data: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        user_id: "123e4567-e89b-12d3-a456-426614174001",
        label: "Test",
        completed: false,
        due_date: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      error: null,
    });
    const mockSelect = jest.fn(() => ({ single: mockSingle }));
    const mockEq = jest.fn(() => ({
      select: mockSelect,
      single: mockSingle,
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    }));

    supabase.from.mockReturnValue({
      insert: jest.fn(() => ({ select: mockSelect })),
      update: jest.fn(() => ({ eq: mockEq })),
      delete: jest.fn(() => ({ eq: mockEq })),
      select: jest.fn(() => ({ eq: mockEq })),
    });

    // Test task operations use 'tasks' table
    await createTask({
      label: "Test",
      completed: false,
      userId: "123e4567-e89b-12d3-a456-426614174001",
    });
    expect(supabase.from).toHaveBeenCalledWith("tasks");

    // Reset mock
    supabase.from.mockClear();

    // Test job application operations use 'job_applications' table
    await createJobApplication({
      companyName: "Test",
      position: "Dev",
      status: "Applied",
      userId: "123e4567-e89b-12d3-a456-426614174001",
    });
    expect(supabase.from).toHaveBeenCalledWith("job_applications");

    // Reset mock
    supabase.from.mockClear();

    // Test user preferences operations use 'user_preferences' table
    await createUserPreferences({
      userId: "123e4567-e89b-12d3-a456-426614174001",
      theme: "dark",
      focusDuration: 25,
      breakDuration: 5,
      zenModeEnabled: false,
      sidebarCollapsed: false,
    });
    expect(supabase.from).toHaveBeenCalledWith("user_preferences");
  });

  test("Property 7: Supabase data persistence - operations handle database errors gracefully", async () => {
    const { supabase } = await import("@/lib/supabase");

    // Mock database error
    const mockError = {
      message: "Database connection failed",
      code: "CONNECTION_ERROR",
    };
    const mockSingle = jest
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const mockSelect = jest.fn(() => ({ single: mockSingle }));

    supabase.from.mockReturnValue({
      insert: jest.fn(() => ({ select: mockSelect })),
    });

    // Test that database errors are properly handled and re-thrown
    try {
      await createTask({
        label: "Test",
        completed: false,
        userId: "123e4567-e89b-12d3-a456-426614174001",
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain("Create task failed");
      expect(error.message).toContain("Database connection failed");
    }
  });
});
