/**
 * **Feature: polaris-tech-migration, Property 12: External data validation**
 * **Validates: Requirements 8.2**
 * 
 * Property-based test to verify that all external data is validated using Zod schemas
 * before processing in Server Actions.
 */

import './setup'
import * as fc from 'fast-check'
import { z } from 'zod'

// Mock the Supabase module before importing Server Actions
jest.mock('@/lib/supabase', () => {
  const mockSupabase = {
    from: jest.fn()
  }
  return { supabase: mockSupabase }
})

// Import Server Actions and validation schemas after mocking
import { createTask, updateTask, getTasks } from '@/app/actions/tasks'
import { createJobApplication, updateJobApplication, getJobApplications } from '@/app/actions/jobApplications'
import { createUserPreferences, updateUserPreferences, getUserPreferences } from '@/app/actions/userPreferences'
import { 
  createTaskSchema, 
  updateTaskSchema,
  createJobApplicationSchema,
  updateJobApplicationSchema,
  createUserPreferencesSchema,
  updateUserPreferencesSchema,
  userIdSchema
} from '@/lib/validations'

describe('External Data Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Property 12: External data validation - task creation validates all required fields', async () => {
    // Test valid data should succeed (mock success)
    const { supabase } = require('@/lib/supabase')
    const mockData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      label: 'Test Task',
      completed: false,
      due_date: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
    
    const mockSingle = jest.fn().mockResolvedValue({ data: mockData, error: null })
    const mockSelect = jest.fn(() => ({ single: mockSingle }))
    
    supabase.from.mockReturnValue({
      insert: jest.fn(() => ({ select: mockSelect }))
    })

    // Valid data should succeed
    const validData = {
      label: 'Valid Task',
      completed: false,
      userId: '123e4567-e89b-12d3-a456-426614174001'
    }
    
    const result = await createTask(validData)
    expect(result).toBeDefined()
    expect(result.label).toBe('Test Task')

    // Invalid data should fail validation before reaching Supabase
    const invalidInputs = [
      { label: '', completed: false, userId: '123e4567-e89b-12d3-a456-426614174001' }, // Empty label
      { label: 'Valid', completed: false, userId: 'invalid-uuid' }, // Invalid UUID
      { label: 'x'.repeat(501), completed: false, userId: '123e4567-e89b-12d3-a456-426614174001' } // Too long label
    ]

    for (const invalidInput of invalidInputs) {
      try {
        await createTask(invalidInput)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('Create task failed')
      }
    }
  })

  test('Property 12: External data validation - job application creation validates all fields', async () => {
    // Test valid data should succeed (mock success)
    const { supabase } = require('@/lib/supabase')
    const mockData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      company_name: 'Test Company',
      company_domain: null,
      position: 'Developer',
      status: 'Applied',
      applied_at: '2024-01-01T00:00:00Z',
      last_updated: '2024-01-01T00:00:00Z',
      notes: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
    
    const mockSingle = jest.fn().mockResolvedValue({ data: mockData, error: null })
    const mockSelect = jest.fn(() => ({ single: mockSingle }))
    
    supabase.from.mockReturnValue({
      insert: jest.fn(() => ({ select: mockSelect }))
    })

    // Valid data should succeed
    const validData = {
      companyName: 'Test Company',
      position: 'Developer',
      status: 'Applied' as const,
      userId: '123e4567-e89b-12d3-a456-426614174001'
    }
    
    const result = await createJobApplication(validData)
    expect(result).toBeDefined()
    expect(result.companyName).toBe('Test Company')

    // Invalid data should fail validation before reaching Supabase
    const invalidInputs = [
      { companyName: '', position: 'Dev', status: 'Applied' as const, userId: '123e4567-e89b-12d3-a456-426614174001' }, // Empty company name
      { companyName: 'Company', position: '', status: 'Applied' as const, userId: '123e4567-e89b-12d3-a456-426614174001' }, // Empty position
      { companyName: 'Company', position: 'Dev', status: 'InvalidStatus' as any, userId: '123e4567-e89b-12d3-a456-426614174001' }, // Invalid status
      { companyName: 'Company', position: 'Dev', status: 'Applied' as const, userId: 'invalid-uuid' } // Invalid UUID
    ]

    for (const invalidInput of invalidInputs) {
      try {
        await createJobApplication(invalidInput)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('Create job application failed')
      }
    }
  })

  test('Property 12: External data validation - user preferences creation validates all fields', async () => {
    // Test valid data should succeed (mock success)
    const { supabase } = require('@/lib/supabase')
    const mockData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      theme: 'dark',
      focus_duration: 25,
      break_duration: 5,
      zen_mode_enabled: false,
      sidebar_collapsed: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
    
    const mockSingle = jest.fn().mockResolvedValue({ data: mockData, error: null })
    const mockSelect = jest.fn(() => ({ single: mockSingle }))
    
    supabase.from.mockReturnValue({
      insert: jest.fn(() => ({ select: mockSelect }))
    })

    // Valid data should succeed
    const validData = {
      userId: '123e4567-e89b-12d3-a456-426614174001',
      theme: 'dark' as const,
      focusDuration: 25,
      breakDuration: 5,
      zenModeEnabled: false,
      sidebarCollapsed: false
    }
    
    const result = await createUserPreferences(validData)
    expect(result).toBeDefined()
    expect(result.theme).toBe('dark')

    // Invalid data should fail validation before reaching Supabase
    const invalidInputs = [
      { userId: 'invalid-uuid', theme: 'dark' as const, focusDuration: 25, breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false }, // Invalid UUID
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'invalid' as any, focusDuration: 25, breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false }, // Invalid theme
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'dark' as const, focusDuration: 0, breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false }, // Invalid focus duration
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'dark' as const, focusDuration: 25, breakDuration: 61, zenModeEnabled: false, sidebarCollapsed: false } // Invalid break duration
    ]

    for (const invalidInput of invalidInputs) {
      try {
        await createUserPreferences(invalidInput)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('Create user preferences failed')
      }
    }
  })

  test('Property 12: External data validation - UUID validation is consistent', async () => {
    // Test valid UUID should succeed (mock success)
    const { supabase } = require('@/lib/supabase')
    const mockData = [{
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      label: 'Test Task',
      completed: false,
      due_date: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }]
    
    const mockOrder = jest.fn().mockResolvedValue({ data: mockData, error: null })
    const mockEq = jest.fn(() => ({ order: mockOrder }))
    const mockSelect = jest.fn(() => ({ eq: mockEq }))
    
    supabase.from.mockReturnValue({
      select: jest.fn(() => ({ eq: mockEq }))
    })

    // Valid UUID should succeed
    const validUuid = '123e4567-e89b-12d3-a456-426614174001'
    const result = await getTasks(validUuid)
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)

    // Invalid UUIDs should fail validation before reaching Supabase
    const invalidUuids = [
      'invalid-uuid',
      '123',
      'not-a-uuid-at-all',
      '',
      '123e4567-e89b-12d3-a456-42661417400' // Too short
    ]

    for (const invalidUuid of invalidUuids) {
      try {
        await getTasks(invalidUuid)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('Get tasks failed')
      }
    }
  })

  test('Property 12: External data validation - update operations validate partial data', async () => {
    // Test valid update should succeed (mock success)
    const { supabase } = require('@/lib/supabase')
    const mockData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      label: 'Updated Task',
      completed: true,
      due_date: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
    
    const mockSingle = jest.fn().mockResolvedValue({ data: mockData, error: null })
    const mockSelect = jest.fn(() => ({ single: mockSingle }))
    const mockEq = jest.fn(() => ({ select: mockSelect }))
    
    supabase.from.mockReturnValue({
      update: jest.fn(() => ({ eq: mockEq }))
    })

    // Valid update should succeed
    const validId = '123e4567-e89b-12d3-a456-426614174000'
    const validUpdate = { label: 'Updated Task', completed: true }
    
    const result = await updateTask(validId, validUpdate)
    expect(result).toBeDefined()
    expect(result.label).toBe('Updated Task')

    // Invalid updates should fail validation before reaching Supabase
    const invalidUpdates = [
      { id: 'invalid-uuid', label: 'Valid' }, // Invalid UUID
      { id: validId, label: '' }, // Empty label
      { id: validId, label: 'x'.repeat(501) } // Too long label
    ]

    for (const invalidUpdate of invalidUpdates) {
      try {
        await updateTask(invalidUpdate.id, invalidUpdate)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('Update task failed')
      }
    }
  })

  test('Property 12: External data validation - schemas reject malformed data consistently', () => {
    const malformedInputs = [
      // Task creation with various invalid data
      { label: null, completed: false, userId: '123e4567-e89b-12d3-a456-426614174001' },
      { label: 'Valid', completed: 'not-boolean', userId: '123e4567-e89b-12d3-a456-426614174001' },
      { label: 'Valid', completed: false, userId: null },
      
      // Job application with invalid data
      { companyName: null, position: 'Dev', status: 'Applied', userId: '123e4567-e89b-12d3-a456-426614174001' },
      { companyName: 'Company', position: null, status: 'Applied', userId: '123e4567-e89b-12d3-a456-426614174001' },
      { companyName: 'Company', position: 'Dev', status: 'InvalidStatus', userId: '123e4567-e89b-12d3-a456-426614174001' },
      
      // User preferences with invalid data
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'invalid-theme', focusDuration: 25, breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false },
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'dark', focusDuration: 'not-number', breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false },
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'dark', focusDuration: 25, breakDuration: 5, zenModeEnabled: 'not-boolean', sidebarCollapsed: false }
    ]

    for (const malformedInput of malformedInputs) {
      // Test that Zod schemas properly reject malformed data
      if ('label' in malformedInput) {
        const result = createTaskSchema.safeParse(malformedInput)
        expect(result.success).toBe(false)
      } else if ('companyName' in malformedInput) {
        const result = createJobApplicationSchema.safeParse(malformedInput)
        expect(result.success).toBe(false)
      } else if ('theme' in malformedInput) {
        const result = createUserPreferencesSchema.safeParse(malformedInput)
        expect(result.success).toBe(false)
      }
    }
  })
})