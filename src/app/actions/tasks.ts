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

// Task Management Server Actions
export async function createTask(data: CreateTaskInput): Promise<TaskItem> {
  try {
    // Validate input data
    const validatedData = createTaskSchema.parse(data)
    
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
      throw new Error(`Failed to create task: ${error.message}`)
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
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create task failed: ${error.message}`)
    }
    throw new Error('Create task failed: Unknown error')
  }
}

export async function updateTask(id: string, data: Partial<UpdateTaskInput>): Promise<TaskItem> {
  try {
    // Validate input data
    const validatedData = updateTaskSchema.parse({ id, ...data })
    
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
      throw new Error(`Failed to update task: ${error.message}`)
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
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update task failed: ${error.message}`)
    }
    throw new Error('Update task failed: Unknown error')
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    // Validate task ID
    const validatedId = userIdSchema.parse(id)
    
    const { error } = await (supabase as any)
      .from('tasks')
      .delete()
      .eq('id', validatedId)

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Delete task failed: ${error.message}`)
    }
    throw new Error('Delete task failed: Unknown error')
  }
}

export async function getTasks(userId: string): Promise<TaskItem[]> {
  try {
    // Validate user ID
    const validatedUserId = userIdSchema.parse(userId)
    
    const { data: tasks, error } = await (supabase as any)
      .from('tasks')
      .select('*')
      .eq('user_id', validatedUserId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`)
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
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get tasks failed: ${error.message}`)
    }
    throw new Error('Get tasks failed: Unknown error')
  }
}