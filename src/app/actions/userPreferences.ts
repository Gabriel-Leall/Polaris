"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { UserPreferences } from "@/types";
import {
  createUserPreferencesSchema,
  updateUserPreferencesSchema,
  userIdSchema,
  type CreateUserPreferencesInput,
  type UpdateUserPreferencesInput,
} from "@/lib/validations";

type UserPreferencesRow = any;

const mapUserPreferencesRow = (prefs: UserPreferencesRow): UserPreferences => ({
  id: prefs.id,
  userId: prefs.user_id,
  theme: prefs.theme,
  focusDuration: prefs.focus_duration,
  breakDuration: prefs.break_duration,
  zenModeEnabled: prefs.zen_mode_enabled,
  sidebarCollapsed: prefs.sidebar_collapsed,
  notionApiKey: prefs.notion_api_key,
  notionDatabaseId: prefs.notion_database_id,
  createdAt: new Date(prefs.created_at),
  updatedAt: new Date(prefs.updated_at),
});

// User Preferences Server Actions
export const updateUserPreferences = async (
  id: string,
  preferences: Partial<UpdateUserPreferencesInput>
): Promise<UserPreferences> => {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Validate input data
    const validatedData = updateUserPreferencesSchema.parse({
      id,
      ...preferences,
    });

    const updateData: Partial<UserPreferencesRow> = {
      updated_at: new Date().toISOString(),
    };

    if (validatedData.theme !== undefined)
      updateData.theme = validatedData.theme;
    if (validatedData.focusDuration !== undefined)
      updateData.focus_duration = validatedData.focusDuration;
    if (validatedData.breakDuration !== undefined)
      updateData.break_duration = validatedData.breakDuration;
    if (validatedData.zenModeEnabled !== undefined)
      updateData.zen_mode_enabled = validatedData.zenModeEnabled;
    if (validatedData.sidebarCollapsed !== undefined)
      updateData.sidebar_collapsed = validatedData.sidebarCollapsed;
    if (validatedData.notionApiKey !== undefined)
      updateData.notion_api_key = validatedData.notionApiKey;
    if (validatedData.notionDatabaseId !== undefined)
      updateData.notion_database_id = validatedData.notionDatabaseId;

    const { data: prefs, error } = await supabase
      .from("user_preferences")
      .update(updateData)
      .eq("id", validatedData.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user preferences: ${error.message}`);
    }

    // Transform database row to UserPreferences
    return mapUserPreferencesRow(prefs);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update user preferences failed: ${error.message}`);
    }
    throw new Error("Update user preferences failed: Unknown error");
  }
};

export const getUserPreferences = async (
  userId: string
): Promise<UserPreferences | null> => {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Validate user ID
    const validatedUserId = userIdSchema.parse(userId);

    const { data: prefs, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", validatedUserId)
      .single();

    if (error) {
      // If no preferences found, return null (not an error)
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch user preferences: ${error.message}`);
    }

    // Transform database row to UserPreferences
    return mapUserPreferencesRow(prefs);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get user preferences failed: ${error.message}`);
    }
    throw new Error("Get user preferences failed: Unknown error");
  }
};

export const createUserPreferences = async (
  data: CreateUserPreferencesInput
): Promise<UserPreferences> => {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Validate input data
    const validatedData = createUserPreferencesSchema.parse(data);

    const { data: prefs, error } = await supabase
      .from("user_preferences")
      .insert({
        user_id: validatedData.userId,
        theme: validatedData.theme,
        focus_duration: validatedData.focusDuration,
        break_duration: validatedData.breakDuration,
        zen_mode_enabled: validatedData.zenModeEnabled,
        sidebar_collapsed: validatedData.sidebarCollapsed,
        notion_api_key: validatedData.notionApiKey,
        notion_database_id: validatedData.notionDatabaseId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user preferences: ${error.message}`);
    }

    // Transform database row to UserPreferences
    return mapUserPreferencesRow(prefs);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create user preferences failed: ${error.message}`);
    }
    throw new Error("Create user preferences failed: Unknown error");
  }
};

export const getOrCreateUserPreferences = async (
  userId: string
): Promise<UserPreferences> => {
  try {
    // First try to get existing preferences
    const existingPrefs = await getUserPreferences(userId);

    if (existingPrefs) {
      return existingPrefs;
    }

    // If no preferences exist, create default ones
    return await createUserPreferences({
      userId,
      theme: "dark",
      focusDuration: 25,
      breakDuration: 5,
      zenModeEnabled: false,
      sidebarCollapsed: false,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Get or create user preferences failed: ${error.message}`
      );
    }
    throw new Error("Get or create user preferences failed: Unknown error");
  }
};
