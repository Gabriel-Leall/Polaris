import { describe, expect, test, beforeEach, vi } from 'vitest'

vi.mock('@/lib/supabase', () => {
  const supabase = {
    from: vi.fn()
  }
  return { supabase }
})

import { createTask, updateTask, getTasks } from '@/app/actions/tasks'
import { createJobApplication, updateJobApplication, getJobApplications } from '@/app/actions/jobApplications'
import { createUserPreferences, updateUserPreferences, getUserPreferences } from '@/app/actions/userPreferences'
import { createTaskSchema, createJobApplicationSchema, createUserPreferencesSchema } from '@/lib/validations'
import { supabase } from '@/lib/supabase'

describe('External Data Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('Property 12: Task creation validates all required fields', async () => {
    const mockData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      label: 'Test Task',
      completed: false,
      due_date: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }

    const mockSingle = vi.fn().mockResolvedValue({ data: mockData, error: null })
    const mockSelect = vi.fn(() => ({ single: mockSingle }))

    supabase.from.mockReturnValue({
      insert: vi.fn(() => ({ select: mockSelect }))
    })

    const validData = {
      label: 'Valid Task',
      completed: false,
      userId: '123e4567-e89b-12d3-a456-426614174001'
    }

    const result = await createTask(validData)
    expect(result).toBeDefined()
    expect(result.label).toBe('Test Task')

    const invalidInputs = [
      { label: '', completed: false, userId: '123e4567-e89b-12d3-a456-426614174001' },
      { label: 'Valid', completed: false, userId: 'invalid-uuid' },
      { label: 'x'.repeat(501), completed: false, userId: '123e4567-e89b-12d3-a456-426614174001' }
    ]

    for (const invalidInput of invalidInputs) {
      await expect(createTask(invalidInput)).rejects.toBeInstanceOf(Error)
    }
  })

  test('Property 12: Job application creation validates all fields', async () => {
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

    const mockSingle = vi.fn().mockResolvedValue({ data: mockData, error: null })
    const mockSelect = vi.fn(() => ({ single: mockSingle }))

    supabase.from.mockReturnValue({
      insert: vi.fn(() => ({ select: mockSelect }))
    })

    const validData = {
      companyName: 'Test Company',
      position: 'Developer',
      status: 'Applied' as const,
      userId: '123e4567-e89b-12d3-a456-426614174001'
    }

    const result = await createJobApplication(validData)
    expect(result).toBeDefined()
    expect(result.companyName).toBe('Test Company')

    const invalidInputs = [
      { companyName: '', position: 'Dev', status: 'Applied' as const, userId: '123e4567-e89b-12d3-a456-426614174001' },
      { companyName: 'Company', position: '', status: 'Applied' as const, userId: '123e4567-e89b-12d3-a456-426614174001' },
      { companyName: 'Company', position: 'Dev', status: 'InvalidStatus' as any, userId: '123e4567-e89b-12d3-a456-426614174001' },
      { companyName: 'Company', position: 'Dev', status: 'Applied' as const, userId: 'invalid-uuid' }
    ]

    for (const invalidInput of invalidInputs) {
      await expect(createJobApplication(invalidInput)).rejects.toBeInstanceOf(Error)
    }
  })

  test('Property 12: User preferences creation validates all fields', async () => {
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

    const mockSingle = vi.fn().mockResolvedValue({ data: mockData, error: null })
    const mockSelect = vi.fn(() => ({ single: mockSingle }))

    supabase.from.mockReturnValue({
      insert: vi.fn(() => ({ select: mockSelect }))
    })

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

    const invalidInputs = [
      { userId: 'invalid-uuid', theme: 'dark' as const, focusDuration: 25, breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false },
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'invalid' as any, focusDuration: 25, breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false },
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'dark' as const, focusDuration: 0, breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false },
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'dark' as const, focusDuration: 25, breakDuration: 61, zenModeEnabled: false, sidebarCollapsed: false }
    ]

    for (const invalidInput of invalidInputs) {
      await expect(createUserPreferences(invalidInput)).rejects.toBeInstanceOf(Error)
    }
  })

  test('Property 12: UUID validation is consistent', async () => {
    const mockData = [{
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      label: 'Test Task',
      completed: false,
      due_date: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }]

    const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null })
    const mockEq = vi.fn(() => ({ order: mockOrder }))

    supabase.from.mockReturnValue({
      select: vi.fn(() => ({ eq: mockEq }))
    })

    const validUuid = '123e4567-e89b-12d3-a456-426614174001'
    const result = await getTasks(validUuid)
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)

    const invalidUuids = ['invalid-uuid', '123', 'not-a-uuid-at-all', '', '123e4567-e89b-12d3-a456-42661417400']

    for (const invalidUuid of invalidUuids) {
      await expect(getTasks(invalidUuid)).rejects.toBeInstanceOf(Error)
    }
  })

  test('Property 12: Update operations validate partial data', async () => {
    const mockData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      label: 'Updated Task',
      completed: true,
      due_date: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }

    const mockSingle = vi.fn().mockResolvedValue({ data: mockData, error: null })
    const mockSelect = vi.fn(() => ({ single: mockSingle }))
    const mockEq = vi.fn(() => ({ select: mockSelect }))

    supabase.from.mockReturnValue({
      update: vi.fn(() => ({ eq: mockEq }))
    })

    const validId = '123e4567-e89b-12d3-a456-426614174000'
    const validUpdate = { label: 'Updated Task', completed: true }

    const result = await updateTask(validId, validUpdate)
    expect(result).toBeDefined()
    expect(result.label).toBe('Updated Task')

    const invalidUpdates = [
      { id: 'invalid-uuid', label: 'Valid' },
      { id: validId, label: '' },
      { id: validId, label: 'x'.repeat(501) }
    ]

    for (const invalidUpdate of invalidUpdates) {
      await expect(updateTask(invalidUpdate.id, invalidUpdate)).rejects.toBeInstanceOf(Error)
    }
  })

  test('Property 12: Schemas reject malformed data consistently', () => {
    const malformedInputs = [
      { label: null, completed: false, userId: '123e4567-e89b-12d3-a456-426614174001' },
      { label: 'Valid', completed: 'not-boolean', userId: '123e4567-e89b-12d3-a456-426614174001' },
      { label: 'Valid', completed: false, userId: null },
      { companyName: null, position: 'Dev', status: 'Applied', userId: '123e4567-e89b-12d3-a456-426614174001' },
      { companyName: 'Company', position: null, status: 'Applied', userId: '123e4567-e89b-12d3-a456-426614174001' },
      { companyName: 'Company', position: 'Dev', status: 'InvalidStatus', userId: '123e4567-e89b-12d3-a456-426614174001' },
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'invalid-theme', focusDuration: 25, breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false },
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'dark', focusDuration: 'not-number', breakDuration: 5, zenModeEnabled: false, sidebarCollapsed: false },
      { userId: '123e4567-e89b-12d3-a456-426614174001', theme: 'dark', focusDuration: 25, breakDuration: 5, zenModeEnabled: 'not-boolean', sidebarCollapsed: false }
    ]

    for (const malformedInput of malformedInputs) {
      if ('label' in malformedInput) {
        expect(createTaskSchema.safeParse(malformedInput).success).toBe(false)
      } else if ('companyName' in malformedInput) {
        expect(createJobApplicationSchema.safeParse(malformedInput).success).toBe(false)
      } else if ('theme' in malformedInput) {
        expect(createUserPreferencesSchema.safeParse(malformedInput).success).toBe(false)
      }
    }
  })
})
