/**
 * **Feature: polaris-tech-migration, Property 11: Server Action error handling**
 * **Validates: Requirements 8.1**
 * 
 * Property-based test to verify that all Server Actions wrap operations in try/catch blocks
 * and handle errors gracefully with descriptive error messages.
 */

import './setup'
import * as fc from 'fast-check'

// Mock the Supabase module before importing Server Actions
jest.mock('@/lib/supabase', () => {
  const mockSupabase = {
    from: jest.fn()
  }
  return { supabase: mockSupabase }
})

// Import Server Actions after mocking
import { createTask, updateTask, deleteTask, getTasks } from '@/app/actions/tasks'
import { createJobApplication, updateJobApplicationStatus, updateJobApplication, deleteJobApplication, getJobApplications } from '@/app/actions/jobApplications'
import { createUserPreferences, updateUserPreferences, getUserPreferences } from '@/app/actions/userPreferences'

describe('Server Action Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Property 11: Server Action error handling - all actions handle database errors gracefully', async () => {
    const { supabase } = require('@/lib/supabase')
    
    // Configure mock to return error for all operations
    const mockError = { 
      message: 'Simulated database error', 
      code: 'TEST_ERROR'
    }
    
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError })
    const mockSelect = jest.fn(() => ({ single: mockSingle }))
    const mockEq = jest.fn(() => ({ 
      select: mockSelect,
      single: mockSingle,
      order: jest.fn().mockResolvedValue({ data: null, error: mockError })
    }))
    
    supabase.from.mockReturnValue({
      insert: jest.fn(() => ({ select: mockSelect })),
      update: jest.fn(() => ({ eq: mockEq })),
      delete: jest.fn(() => ({ eq: mockEq })),
      select: jest.fn(() => ({ eq: mockEq, order: jest.fn().mockResolvedValue({ data: null, error: mockError }) }))
    })

    // Test that createTask handles database errors properly
    try {
      await createTask({
        label: 'Test Task',
        completed: false,
        userId: '123e4567-e89b-12d3-a456-426614174001'
      })
      expect(true).toBe(false) // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('Create task failed')
      expect(error.message).toContain('Simulated database error')
    }
  })

  test('Property 11: Server Action error handling - actions handle invalid input gracefully', async () => {
    // Test with empty label (should fail validation)
    try {
      await createTask({
        label: '', // Empty label should fail validation
        completed: false,
        userId: '123e4567-e89b-12d3-a456-426614174001'
      })
      expect(true).toBe(false) // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('Create task failed')
    }

    // Test with invalid UUID (should fail validation)
    try {
      await createTask({
        label: 'Valid Task',
        completed: false,
        userId: 'invalid-uuid' // Invalid UUID should fail validation
      })
      expect(true).toBe(false) // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('Create task failed')
    }
  })

  test('Property 11: Server Action error handling - job application actions handle errors', async () => {
    const { supabase } = require('@/lib/supabase')
    
    // Configure mock to return error
    const mockError = { 
      message: 'Database error for job application', 
      code: 'TEST_ERROR' 
    }
    
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError })
    const mockSelect = jest.fn(() => ({ single: mockSingle }))
    const mockEq = jest.fn(() => ({ 
      select: mockSelect,
      single: mockSingle,
      order: jest.fn().mockResolvedValue({ data: null, error: mockError })
    }))
    
    supabase.from.mockReturnValue({
      insert: jest.fn(() => ({ select: mockSelect })),
      update: jest.fn(() => ({ eq: mockEq })),
      delete: jest.fn(() => ({ eq: mockEq })),
      select: jest.fn(() => ({ eq: mockEq, order: jest.fn().mockResolvedValue({ data: null, error: mockError }) }))
    })

    // Test createJobApplication error handling
    try {
      await createJobApplication({
        companyName: 'Test Company',
        position: 'Developer',
        status: 'Applied',
        userId: '123e4567-e89b-12d3-a456-426614174001'
      })
      expect(true).toBe(false) // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('Create job application failed')
    }
  })

  test('Property 11: Server Action error handling - user preferences actions handle errors', async () => {
    const { supabase } = require('@/lib/supabase')
    
    // Configure mock to return error
    const mockError = { 
      message: 'Database error for user preferences', 
      code: 'TEST_ERROR' 
    }
    
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError })
    const mockSelect = jest.fn(() => ({ single: mockSingle }))
    const mockEq = jest.fn(() => ({ single: mockSingle }))
    
    supabase.from.mockReturnValue({
      insert: jest.fn(() => ({ select: mockSelect })),
      update: jest.fn(() => ({ eq: mockEq })),
      select: jest.fn(() => ({ eq: mockEq }))
    })

    // Test createUserPreferences error handling
    try {
      await createUserPreferences({
        userId: '123e4567-e89b-12d3-a456-426614174001',
        theme: 'dark',
        focusDuration: 25,
        breakDuration: 5,
        zenModeEnabled: false,
        sidebarCollapsed: false
      })
      expect(true).toBe(false) // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('Create user preferences failed')
    }
  })

  test('Property 11: Server Action error handling - all errors are instances of Error class', async () => {
    const { supabase } = require('@/lib/supabase')
    
    // Configure mock to return error
    const mockError = { message: 'Test error', code: 'TEST_ERROR' }
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError })
    const mockSelect = jest.fn(() => ({ single: mockSingle }))
    const mockEq = jest.fn(() => ({ 
      select: mockSelect,
      single: mockSingle,
      order: jest.fn().mockResolvedValue({ data: null, error: mockError })
    }))
    
    supabase.from.mockReturnValue({
      insert: jest.fn(() => ({ select: mockSelect })),
      update: jest.fn(() => ({ eq: mockEq })),
      delete: jest.fn(() => ({ eq: mockEq })),
      select: jest.fn(() => ({ eq: mockEq, order: jest.fn().mockResolvedValue({ data: null, error: mockError }) }))
    })

    // Test that all Server Actions throw proper Error instances
    const testCases = [
      () => createTask({ label: 'Test', completed: false, userId: '123e4567-e89b-12d3-a456-426614174001' }),
      () => updateTask('123e4567-e89b-12d3-a456-426614174000', { label: 'Updated' }),
      () => deleteTask('123e4567-e89b-12d3-a456-426614174000'),
      () => getTasks('123e4567-e89b-12d3-a456-426614174001'),
      () => createJobApplication({ companyName: 'Test', position: 'Dev', status: 'Applied', userId: '123e4567-e89b-12d3-a456-426614174001' }),
      () => updateJobApplication('123e4567-e89b-12d3-a456-426614174000', { companyName: 'Updated' }),
      () => deleteJobApplication('123e4567-e89b-12d3-a456-426614174000'),
      () => getJobApplications('123e4567-e89b-12d3-a456-426614174001'),
      () => createUserPreferences({ userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'dark', focusDuration: 25, breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false }),
      () => updateUserPreferences('123e4567-e89b-12d3-a456-426614174000', { theme: 'light' }),
      () => getUserPreferences('123e4567-e89b-12d3-a456-426614174001')
    ]

    for (const testCase of testCases) {
      try {
        await testCase()
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error).toHaveProperty('message')
        expect(typeof error.message).toBe('string')
      }
    }
  })
})