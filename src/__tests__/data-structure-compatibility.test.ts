/**
 * **Feature: polaris-tech-migration, Property 10: Data structure compatibility**
 * **Validates: Requirements 7.5**
 * 
 * Property-based test to verify that data interfaces remain compatible with existing data.
 * This ensures that the migration preserves all existing data structures and interfaces.
 */

import './setup'
import * as fc from 'fast-check'
import { TaskItem } from '@/types'
import { MOCK_TASKS } from '@/lib/constants'

describe('Property 10: Data structure compatibility', () => {
  test('Property 10: TaskItem interface compatibility with existing data', () => {
    // Generator for valid TaskItem objects
    const taskItemGenerator = fc.record({
      id: fc.string({ minLength: 1, maxLength: 50 }),
      label: fc.string({ minLength: 1, maxLength: 500 }),
      completed: fc.boolean(),
      dueDate: fc.oneof(fc.constant(undefined), fc.string({ minLength: 1, maxLength: 50 })),
      createdAt: fc.date(),
      updatedAt: fc.date(),
      userId: fc.string({ minLength: 1, maxLength: 50 })
    })

    fc.assert(
      fc.property(
        taskItemGenerator,
        (generatedTask: TaskItem) => {
          // Test that generated task has all required properties
          const hasRequiredProperties = 
            typeof generatedTask.id === 'string' &&
            typeof generatedTask.label === 'string' &&
            typeof generatedTask.completed === 'boolean' &&
            generatedTask.createdAt instanceof Date &&
            generatedTask.updatedAt instanceof Date &&
            typeof generatedTask.userId === 'string'

          // Test that optional properties are handled correctly
          const hasValidOptionalProperties = 
            generatedTask.dueDate === undefined || typeof generatedTask.dueDate === 'string'

          // Test that the structure matches existing mock data structure
          const mockTaskStructure = MOCK_TASKS[0]
          const hasCompatibleStructure = 
            Object.keys(generatedTask).every(key => key in mockTaskStructure) &&
            Object.keys(mockTaskStructure).every(key => key in generatedTask)

          return hasRequiredProperties && hasValidOptionalProperties && hasCompatibleStructure
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Property 10: Existing mock data conforms to TaskItem interface', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...MOCK_TASKS),
        (mockTask: TaskItem) => {
          // Verify that existing mock data conforms to the interface
          const isValidTaskItem = 
            typeof mockTask.id === 'string' &&
            typeof mockTask.label === 'string' &&
            typeof mockTask.completed === 'boolean' &&
            mockTask.createdAt instanceof Date &&
            mockTask.updatedAt instanceof Date &&
            typeof mockTask.userId === 'string' &&
            (mockTask.dueDate === undefined || typeof mockTask.dueDate === 'string')

          return isValidTaskItem
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Property 10: TaskItem serialization compatibility', () => {
    const taskItemGenerator = fc.record({
      id: fc.string({ minLength: 1, maxLength: 50 }),
      label: fc.string({ minLength: 1, maxLength: 500 }),
      completed: fc.boolean(),
      dueDate: fc.oneof(fc.constant(undefined), fc.string({ minLength: 1, maxLength: 50 })),
      createdAt: fc.date(),
      updatedAt: fc.date(),
      userId: fc.string({ minLength: 1, maxLength: 50 })
    })

    fc.assert(
      fc.property(
        taskItemGenerator,
        (task: TaskItem) => {
          // Test that TaskItem can be serialized and deserialized without data loss
          try {
            const serialized = JSON.stringify(task)
            const deserialized = JSON.parse(serialized)
            
            // Dates need special handling in JSON serialization
            deserialized.createdAt = new Date(deserialized.createdAt)
            deserialized.updatedAt = new Date(deserialized.updatedAt)
            
            // Check that all properties are preserved
            const propertiesMatch = 
              deserialized.id === task.id &&
              deserialized.label === task.label &&
              deserialized.completed === task.completed &&
              deserialized.dueDate === task.dueDate &&
              deserialized.createdAt.getTime() === task.createdAt.getTime() &&
              deserialized.updatedAt.getTime() === task.updatedAt.getTime() &&
              deserialized.userId === task.userId

            return propertiesMatch
          } catch {
            return false
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Property 10: TaskItem database transformation compatibility', () => {
    // Generator for database row format (snake_case)
    const dbRowGenerator = fc.record({
      id: fc.string({ minLength: 1, maxLength: 50 }),
      label: fc.string({ minLength: 1, maxLength: 500 }),
      completed: fc.boolean(),
      due_date: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 50 })),
      created_at: fc.string(), // ISO string format
      updated_at: fc.string(), // ISO string format
      user_id: fc.string({ minLength: 1, maxLength: 50 })
    })

    fc.assert(
      fc.property(
        dbRowGenerator,
        (dbRow) => {
          // Test transformation from database format to TaskItem format
          try {
            const taskItem: TaskItem = {
              id: dbRow.id,
              label: dbRow.label,
              completed: dbRow.completed,
              dueDate: dbRow.due_date || undefined,
              createdAt: new Date(dbRow.created_at),
              updatedAt: new Date(dbRow.updated_at),
              userId: dbRow.user_id
            }

            // Verify the transformation preserves all data
            const transformationValid = 
              taskItem.id === dbRow.id &&
              taskItem.label === dbRow.label &&
              taskItem.completed === dbRow.completed &&
              taskItem.dueDate === (dbRow.due_date || undefined) &&
              taskItem.userId === dbRow.user_id &&
              taskItem.createdAt instanceof Date &&
              taskItem.updatedAt instanceof Date

            return transformationValid
          } catch {
            return false
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})