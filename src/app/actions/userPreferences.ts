'use server'

import { UserPreferences } from '@/types'

// User Preferences Server Actions
export async function updateUserPreferences(_preferences: Partial<UserPreferences>): Promise<UserPreferences> {
  // TODO: Implement with Supabase integration
  throw new Error('Not implemented yet')
}

export async function getUserPreferences(_userId: string): Promise<UserPreferences | null> {
  // TODO: Implement with Supabase integration
  throw new Error('Not implemented yet')
}

export async function createUserPreferences(_data: Omit<UserPreferences, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserPreferences> {
  // TODO: Implement with Supabase integration
  throw new Error('Not implemented yet')
}