"use server";

import { supabase } from "@/lib/supabase";
import { Habit } from "@/types";
import {
  createHabitSchema,
  updateHabitSchema,
  toggleHabitDaySchema,
  userIdSchema,
  type CreateHabitInput,
  type UpdateHabitInput,
} from "@/lib/validations";

type HabitRow = {
  id: string;
  user_id: string;
  name: string;
  days: boolean[];
  created_at: string;
  updated_at: string;
};

const mapHabitRow = (habit: HabitRow): Habit => ({
  id: habit.id,
  userId: habit.user_id,
  name: habit.name,
  days: habit.days,
  createdAt: new Date(habit.created_at),
  updatedAt: new Date(habit.updated_at),
});

/**
 * Create a new habit
 */
export const createHabit = async (data: CreateHabitInput): Promise<Habit> => {
  try {
    const validatedData = createHabitSchema.parse(data);

    const { data: habit, error } = await supabase
      .from("habits")
      .insert({
        user_id: validatedData.userId,
        name: validatedData.name,
        days: validatedData.days,
      })
      .select()
      .single();

    if (error || !habit) {
      throw new Error(
        `Failed to create habit: ${error?.message ?? "Unknown error"}`
      );
    }

    return mapHabitRow(habit);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create habit failed: ${error.message}`);
    }
    throw new Error("Create habit failed: Unknown error");
  }
};

/**
 * Update an existing habit
 */
export const updateHabit = async (
  id: string,
  data: Partial<UpdateHabitInput>
): Promise<Habit> => {
  try {
    const validatedData = updateHabitSchema.parse({ id, ...data });

    const updateData: Partial<HabitRow> = {
      updated_at: new Date().toISOString(),
    };

    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.days !== undefined) updateData.days = validatedData.days;

    const { data: habit, error } = await supabase
      .from("habits")
      .update(updateData)
      .eq("id", validatedData.id)
      .select()
      .single();

    if (error || !habit) {
      throw new Error(
        `Failed to update habit: ${error?.message ?? "Unknown error"}`
      );
    }

    return mapHabitRow(habit);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update habit failed: ${error.message}`);
    }
    throw new Error("Update habit failed: Unknown error");
  }
};

/**
 * Toggle a specific day for a habit
 */
export const toggleHabitDay = async (
  id: string,
  dayIndex: number
): Promise<Habit> => {
  try {
    const validated = toggleHabitDaySchema.parse({ id, dayIndex });

    // First, get the current habit
    const { data: currentHabit, error: fetchError } = await supabase
      .from("habits")
      .select("*")
      .eq("id", validated.id)
      .single();

    if (fetchError || !currentHabit) {
      throw new Error(
        `Failed to fetch habit: ${fetchError?.message ?? "Not found"}`
      );
    }

    // Toggle the day
    const newDays = [...currentHabit.days];
    newDays[validated.dayIndex] = !newDays[validated.dayIndex];

    // Update the habit
    const { data: habit, error } = await supabase
      .from("habits")
      .update({
        days: newDays,
        updated_at: new Date().toISOString(),
      })
      .eq("id", validated.id)
      .select()
      .single();

    if (error || !habit) {
      throw new Error(
        `Failed to toggle habit day: ${error?.message ?? "Unknown error"}`
      );
    }

    return mapHabitRow(habit);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Toggle habit day failed: ${error.message}`);
    }
    throw new Error("Toggle habit day failed: Unknown error");
  }
};

/**
 * Delete a habit
 */
export const deleteHabit = async (id: string): Promise<void> => {
  try {
    const validatedId = userIdSchema.parse(id);

    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", validatedId);

    if (error) {
      throw new Error(`Failed to delete habit: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Delete habit failed: ${error.message}`);
    }
    throw new Error("Delete habit failed: Unknown error");
  }
};

/**
 * Get all habits for a user
 */
export const getHabits = async (userId: string): Promise<Habit[]> => {
  try {
    const validatedUserId = userIdSchema.parse(userId);

    const { data: habits, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", validatedUserId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch habits: ${error.message}`);
    }

    return (habits ?? []).map(mapHabitRow);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get habits failed: ${error.message}`);
    }
    throw new Error("Get habits failed: Unknown error");
  }
};

/**
 * Reset all habit days (typically called at the start of a new week)
 */
export const resetHabitWeek = async (userId: string): Promise<Habit[]> => {
  try {
    const validatedUserId = userIdSchema.parse(userId);

    const { data: habits, error } = await supabase
      .from("habits")
      .update({
        days: [false, false, false, false, false, false, false],
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", validatedUserId)
      .select();

    if (error) {
      throw new Error(`Failed to reset habits: ${error.message}`);
    }

    return (habits ?? []).map(mapHabitRow);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Reset habit week failed: ${error.message}`);
    }
    throw new Error("Reset habit week failed: Unknown error");
  }
};
