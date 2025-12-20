'use server'

import { supabase } from '@/lib/supabase'
import { TaskItem } from '@/types'
import { 
  createTaskSchema, 
  updateTaskSchema, 
  userIdSchema,
  type CreateTaskInput,
  type UpdateTaskInput 
} from '@/lib/validations'
import { safeServerAction, supabaseCircuitBreaker, Result } from '@/lib/error-handling'

// Task Management Server Actions with enhanced error handling
export async function createTask(data: CreateTaskInput): Promise<Result<TaskItem>> {
  return safeServerAction(async () => {
    // Validate input data
    const validatedData = createTaskSchema.parse(data)
    
    return await supabaseCircuitBreaker.execute(async () => {
      const { data: task, error } = await (supabase as any)
        .from('tasks')
        .insert({
          user_id: validatedData.userId,
          label: validatedData.label,
          completed: validatedData.completed,
          due_date: validatedData.dueDate || null
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Transform database row to TaskItem
      return {
        id: task.id,
        label: task.label,
        completed: task.completed,
        dueDate: task.due_date || undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
        userId: task.user_id
      }
    })
  }, 'createTask')
}

export async function updateTask(id: string, data: Partial<UpdateTaskInput>): Promise<Result<TaskItem>> {
  return safeServerAction(async () => {
    // Validate input data
    const validatedData = updateTaskSchema.parse({ id, ...data })
    
    return await supabaseCircuitBreaker.execute(async () => {
      const updateData: Record<string, unknown> = {}
      if (validatedData.label !== undefined) updateData.label = validatedData.label
      if (validatedData.completed !== undefined) updateData.completed = validatedData.completed
      if (validatedData.dueDate !== undefined) updateData.due_date = validatedData.dueDate
      
      // Always update the updated_at timestamp
      updateData.updated_at = new Date().toISOString()

      const { data: task, error } = await (supabase as any)
        .from('tasks')
        .update(updateData)
        .eq('id', validatedData.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Transform database row to TaskItem
      return {
        id: task.id,
        label: task.label,
        completed: task.completed,
        dueDate: task.due_date || undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
        userId: task.user_id
      }
    })
  }, 'updateTask')
}

export async function deleteTask(id: string): Promise<Result<void>> {
  return safeServerAction(async () => {
    // Validate task ID
    const validatedId = userIdSchema.parse(id)
    
    return await supabaseCircuitBreaker.execute(async () => {
      const { error } = await (supabase as any)
        .from('tasks')
        .delete()
        .eq('id', validatedId)

      if (error) {
        throw error
      }
    })
  }, 'deleteTask')
}

export async function getTasks(userId: string): Promise<Result<TaskItem[]>> {
  return safeServerAction(async () => {
    // Validate user ID
    const validatedUserId = userIdSchema.parse(userId)
    
    return await supabaseCircuitBreaker.execute(async () => {
      const { data: tasks, error } = await (supabase as any)
        .from('tasks')
        .select('*')
        .eq('user_id', validatedUserId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Transform database rows to TaskItem array
      return tasks.map((task: any) => ({
        id: task.id,
        label: task.label,
        completed: task.completed,
        dueDate: task.due_date || undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
        userId: task.user_id
      }))
    })
  }, 'getTasks')
}