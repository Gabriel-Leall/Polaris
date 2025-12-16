'use server'

import { supabase } from '@/lib/supabase'
import { UserPreferences } from '@/types'
import { 
  createUserPreferencesSchema, 
  updateUserPreferencesSchema,
  userIdSchema,
  type CreateUserPreferencesInput,
  type UpdateUserPreferencesInput
} from '@/lib/validations'

// User Preferences Server Actions
export async function updateUserPreferences(id: string, preferences: Partial<UpdateUserPreferencesInput>): Promise<UserPreferences> {
  try {
    // Validate input data
    const validatedData = updateUserPreferencesSchema.parse({ id, ...preferences })
    
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }
    
    if (validatedData.theme !== undefined) updateData.theme = validatedData.theme
    if (validatedData.focusDuration !== undefined) updateData.focus_duration = validatedData.focusDuration
    if (validatedData.breakDuration !== undefined) updateData.break_duration = validatedData.breakDuration
    if (validatedData.zenModeEnabled !== undefined) updateData.zen_mode_enabled = validatedData.zenModeEnabled
    if (validatedData.sidebarCollapsed !== undefined) updateData.sidebar_collapsed = validatedData.sidebarCollapsed

    const { data: prefs, error } = await (supabase as any)
      .from('user_preferences')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user preferences: ${error.message}`)
    }

    // Transform database row to UserPreferences
    return {
      id: prefs.id,
      userId: prefs.user_id,
      theme: prefs.theme,
      focusDuration: prefs.focus_duration,
      breakDuration: prefs.break_duration,
      zenModeEnabled: prefs.zen_mode_enabled,
      sidebarCollapsed: prefs.sidebar_collapsed,
      createdAt: new Date(prefs.created_at),
      updatedAt: new Date(prefs.updated_at)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update user preferences failed: ${error.message}`)
    }
    throw new Error('Update user preferences failed: Unknown error')
  }
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    // Validate user ID
    const validatedUserId = userIdSchema.parse(userId)
    
    const { data: prefs, error } = await (supabase as any)
      .from('user_preferences')
      .select('*')
      .eq('user_id', validatedUserId)
      .single()

    if (error) {
      // If no preferences found, return null (not an error)
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to fetch user preferences: ${error.message}`)
    }

    // Transform database row to UserPreferences
    return {
      id: prefs.id,
      userId: prefs.user_id,
      theme: prefs.theme,
      focusDuration: prefs.focus_duration,
      breakDuration: prefs.break_duration,
      zenModeEnabled: prefs.zen_mode_enabled,
      sidebarCollapsed: prefs.sidebar_collapsed,
      createdAt: new Date(prefs.created_at),
      updatedAt: new Date(prefs.updated_at)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get user preferences failed: ${error.message}`)
    }
    throw new Error('Get user preferences failed: Unknown error')
  }
}

export async function createUserPreferences(data: CreateUserPreferencesInput): Promise<UserPreferences> {
  try {
    // Validate input data
    const validatedData = createUserPreferencesSchema.parse(data)
    
    const { data: prefs, error } = await (supabase as any)
      .from('user_preferences')
      .insert({
        user_id: validatedData.userId,
        theme: validatedData.theme,
        focus_duration: validatedData.focusDuration,
        break_duration: validatedData.breakDuration,
        zen_mode_enabled: validatedData.zenModeEnabled,
        sidebar_collapsed: validatedData.sidebarCollapsed
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create user preferences: ${error.message}`)
    }

    // Transform database row to UserPreferences
    return {
      id: prefs.id,
      userId: prefs.user_id,
      theme: prefs.theme,
      focusDuration: prefs.focus_duration,
      breakDuration: prefs.break_duration,
      zenModeEnabled: prefs.zen_mode_enabled,
      sidebarCollapsed: prefs.sidebar_collapsed,
      createdAt: new Date(prefs.created_at),
      updatedAt: new Date(prefs.updated_at)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create user preferences failed: ${error.message}`)
    }
    throw new Error('Create user preferences failed: Unknown error')
  }
}

export async function getOrCreateUserPreferences(userId: string): Promise<UserPreferences> {
  try {
    // First try to get existing preferences
    const existingPrefs = await getUserPreferences(userId)
    
    if (existingPrefs) {
      return existingPrefs
    }
    
    // If no preferences exist, create default ones
    return await createUserPreferences({
      userId,
      theme: 'dark',
      focusDuration: 25,
      breakDuration: 5,
      zenModeEnabled: false,
      sidebarCollapsed: false
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get or create user preferences failed: ${error.message}`)
    }
    throw new Error('Get or create user preferences failed: Unknown error')
  }
}