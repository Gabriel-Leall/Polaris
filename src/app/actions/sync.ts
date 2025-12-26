"use server";

import { supabase } from "@/lib/supabase";
import { TaskItem, BrainDumpNote, Habit } from "@/types";
import { z } from "zod";

// Validation schemas for sync data
const syncTaskSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  completed: z.boolean(),
  dueDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const syncNoteSchema = z.object({
  id: z.string().optional(),
  content: z.string(),
  version: z.number().optional().default(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const syncHabitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  days: z.array(z.boolean()).length(7),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const syncDataSchema = z.object({
  userId: z.string().uuid(),
  tasks: z.array(syncTaskSchema).optional().default([]),
  notes: z.array(syncNoteSchema).optional().default([]),
  habits: z.array(syncHabitSchema).optional().default([]),
});

export type SyncDataInput = z.infer<typeof syncDataSchema>;

interface SyncResult {
  success: boolean;
  tasks: TaskItem[];
  notes: BrainDumpNote[];
  habits: Habit[];
  syncedAt: Date;
  stats: {
    tasksCreated: number;
    tasksUpdated: number;
    notesCreated: number;
    notesUpdated: number;
    habitsCreated: number;
    habitsUpdated: number;
  };
}

/**
 * Sync local data with Supabase using intelligent merge.
 * - Compares updatedAt timestamps
 * - Never overwrites newer server data
 * - Creates new items if they don't exist on server
 * - Updates server items only if local is newer
 */
export const syncLocalData = async (
  data: SyncDataInput
): Promise<SyncResult> => {
  try {
    const validatedData = syncDataSchema.parse(data);
    const {
      userId,
      tasks: localTasks,
      notes: localNotes,
      habits: localHabits,
    } = validatedData;

    const stats = {
      tasksCreated: 0,
      tasksUpdated: 0,
      notesCreated: 0,
      notesUpdated: 0,
      habitsCreated: 0,
      habitsUpdated: 0,
    };

    // Fetch existing server data
    const [serverTasksResult, serverNotesResult, serverHabitsResult] =
      await Promise.all([
        supabase.from("tasks").select("*").eq("user_id", userId),
        supabase.from("brain_dump_notes").select("*").eq("user_id", userId),
        supabase.from("habits").select("*").eq("user_id", userId),
      ]);

    if (serverTasksResult.error) {
      throw new Error(
        `Failed to fetch tasks: ${serverTasksResult.error.message}`
      );
    }
    if (serverNotesResult.error) {
      throw new Error(
        `Failed to fetch notes: ${serverNotesResult.error.message}`
      );
    }
    if (serverHabitsResult.error) {
      throw new Error(
        `Failed to fetch habits: ${serverHabitsResult.error.message}`
      );
    }

    const serverTasks = serverTasksResult.data || [];
    const serverNotes = serverNotesResult.data || [];
    const serverHabits = serverHabitsResult.data || [];

    // Sync Tasks
    for (const localTask of localTasks) {
      const localUpdatedAt = new Date(localTask.updatedAt);

      // Find matching server task by label (since local items may not have server id)
      const serverTask = serverTasks.find((t) => t.label === localTask.label);

      if (!serverTask) {
        // Create new task on server
        const { error } = await supabase.from("tasks").insert({
          user_id: userId,
          label: localTask.label,
          completed: localTask.completed,
          due_date: localTask.dueDate ?? null,
          created_at: localTask.createdAt,
          updated_at: localTask.updatedAt,
        });
        if (!error) stats.tasksCreated++;
      } else {
        const serverUpdatedAt = new Date(serverTask.updated_at);

        // Only update if local is newer
        if (localUpdatedAt > serverUpdatedAt) {
          const { error } = await supabase
            .from("tasks")
            .update({
              label: localTask.label,
              completed: localTask.completed,
              due_date: localTask.dueDate ?? null,
              updated_at: localTask.updatedAt,
            })
            .eq("id", serverTask.id);
          if (!error) stats.tasksUpdated++;
        }
      }
    }

    // Sync Notes
    for (const localNote of localNotes) {
      const localUpdatedAt = new Date(localNote.updatedAt);

      // For brain dump, usually there's one per user, so we match by any existing note
      const serverNote = serverNotes[0]; // Brain dump is typically a single note

      if (!serverNote) {
        // Create new note on server
        const { error } = await supabase.from("brain_dump_notes").insert({
          user_id: userId,
          content: localNote.content,
          version: localNote.version,
          created_at: localNote.createdAt,
          updated_at: localNote.updatedAt,
        });
        if (!error) stats.notesCreated++;
      } else {
        const serverUpdatedAt = new Date(serverNote.updated_at);

        // Only update if local is newer
        if (localUpdatedAt > serverUpdatedAt) {
          const { error } = await supabase
            .from("brain_dump_notes")
            .update({
              content: localNote.content,
              version: localNote.version,
              updated_at: localNote.updatedAt,
            })
            .eq("id", serverNote.id);
          if (!error) stats.notesUpdated++;
        }
      }
    }

    // Sync Habits
    for (const localHabit of localHabits) {
      const localUpdatedAt = new Date(localHabit.updatedAt);

      // Find matching server habit by name
      const serverHabit = serverHabits.find((h) => h.name === localHabit.name);

      if (!serverHabit) {
        // Create new habit on server
        const { error } = await supabase.from("habits").insert({
          user_id: userId,
          name: localHabit.name,
          days: localHabit.days,
          created_at: localHabit.createdAt,
          updated_at: localHabit.updatedAt,
        });
        if (!error) stats.habitsCreated++;
      } else {
        const serverUpdatedAt = new Date(serverHabit.updated_at);

        // Only update if local is newer
        if (localUpdatedAt > serverUpdatedAt) {
          const { error } = await supabase
            .from("habits")
            .update({
              name: localHabit.name,
              days: localHabit.days,
              updated_at: localHabit.updatedAt,
            })
            .eq("id", serverHabit.id);
          if (!error) stats.habitsUpdated++;
        }
      }
    }

    // Fetch final merged data
    const [finalTasks, finalNotes, finalHabits] = await Promise.all([
      supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("brain_dump_notes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
    ]);

    // Map to typed objects
    const mergedTasks: TaskItem[] = (finalTasks.data || []).map((t) => ({
      id: t.id,
      label: t.label,
      completed: t.completed,
      dueDate: t.due_date ?? undefined,
      createdAt: new Date(t.created_at),
      updatedAt: new Date(t.updated_at),
      userId: t.user_id,
    }));

    const mergedNotes: BrainDumpNote[] = (finalNotes.data || []).map((n) => ({
      id: n.id,
      userId: n.user_id,
      content: n.content,
      version: n.version,
      createdAt: new Date(n.created_at),
      updatedAt: new Date(n.updated_at),
    }));

    const mergedHabits: Habit[] = (finalHabits.data || []).map((h) => ({
      id: h.id,
      userId: h.user_id,
      name: h.name,
      days: h.days,
      createdAt: new Date(h.created_at),
      updatedAt: new Date(h.updated_at),
    }));

    return {
      success: true,
      tasks: mergedTasks,
      notes: mergedNotes,
      habits: mergedHabits,
      syncedAt: new Date(),
      stats,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sync failed: ${error.message}`);
    }
    throw new Error("Sync failed: Unknown error");
  }
};

/**
 * Get all user data from server (for initial load after login)
 */
export const getUserData = async (
  userId: string
): Promise<{
  tasks: TaskItem[];
  notes: BrainDumpNote[];
  habits: Habit[];
}> => {
  try {
    const validatedUserId = z.string().uuid().parse(userId);

    const [tasksResult, notesResult, habitsResult] = await Promise.all([
      supabase
        .from("tasks")
        .select("*")
        .eq("user_id", validatedUserId)
        .order("created_at", { ascending: false }),
      supabase
        .from("brain_dump_notes")
        .select("*")
        .eq("user_id", validatedUserId)
        .order("updated_at", { ascending: false }),
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", validatedUserId)
        .order("created_at", { ascending: true }),
    ]);

    if (tasksResult.error) {
      throw new Error(`Failed to fetch tasks: ${tasksResult.error.message}`);
    }
    if (notesResult.error) {
      throw new Error(`Failed to fetch notes: ${notesResult.error.message}`);
    }
    if (habitsResult.error) {
      throw new Error(`Failed to fetch habits: ${habitsResult.error.message}`);
    }

    const tasks: TaskItem[] = (tasksResult.data || []).map((t) => ({
      id: t.id,
      label: t.label,
      completed: t.completed,
      dueDate: t.due_date ?? undefined,
      createdAt: new Date(t.created_at),
      updatedAt: new Date(t.updated_at),
      userId: t.user_id,
    }));

    const notes: BrainDumpNote[] = (notesResult.data || []).map((n) => ({
      id: n.id,
      userId: n.user_id,
      content: n.content,
      version: n.version,
      createdAt: new Date(n.created_at),
      updatedAt: new Date(n.updated_at),
    }));

    const habits: Habit[] = (habitsResult.data || []).map((h) => ({
      id: h.id,
      userId: h.user_id,
      name: h.name,
      days: h.days,
      createdAt: new Date(h.created_at),
      updatedAt: new Date(h.updated_at),
    }));

    return { tasks, notes, habits };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get user data failed: ${error.message}`);
    }
    throw new Error("Get user data failed: Unknown error");
  }
};
