'use server'

import { supabase, type Tables } from '@/lib/supabase'
import { TaskItem } from '@/types'
import {
  createTaskSchema,
  updateTaskSchema,
  userIdSchema,
  type CreateTaskInput,
  type UpdateTaskInput
} from '@/lib/validations'

type TaskRow = Tables<'tasks'>

const mapTaskRow = (task: TaskRow): TaskItem => ({
  id: task.id,
  label: task.label,
  completed: task.completed,
  dueDate: task.due_date ?? undefined,
  createdAt: new Date(task.created_at),
  updatedAt: new Date(task.updated_at),
  userId: task.user_id
})

export const createTask = async (data: CreateTaskInput): Promise<TaskItem> => {
  try {
    const validatedData = createTaskSchema.parse(data)

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        user_id: validatedData.userId,
        label: validatedData.label,
        completed: validatedData.completed,
        due_date: validatedData.dueDate ?? null
      })
      .select()
      .single()

    if (error || !task) {
      throw new Error(`Failed to create task: ${error?.message ?? 'Unknown error'}`)
    }

    return mapTaskRow(task)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create task failed: ${error.message}`)
    }
    throw new Error('Create task failed: Unknown error')
  }
}

export const updateTask = async (id: string, data: Partial<UpdateTaskInput>): Promise<TaskItem> => {
  try {
    const validatedData = updateTaskSchema.parse({ id, ...data })

    const updateData: Partial<TaskRow> = {
      updated_at: new Date().toISOString()
    }

    if (validatedData.label !== undefined) updateData.label = validatedData.label
    if (validatedData.completed !== undefined) updateData.completed = validatedData.completed
    if (validatedData.dueDate !== undefined) updateData.due_date = validatedData.dueDate

    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error || !task) {
      throw new Error(`Failed to update task: ${error?.message ?? 'Unknown error'}`)
    }

    return mapTaskRow(task)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update task failed: ${error.message}`)
    }
    throw new Error('Update task failed: Unknown error')
  }
}

export const deleteTask = async (id: string): Promise<void> => {
  try {
    const validatedId = userIdSchema.parse(id)

    const { error } = await supabase
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

export const getTasks = async (userId: string): Promise<TaskItem[]> => {
  try {
    const validatedUserId = userIdSchema.parse(userId)

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', validatedUserId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`)
    }

    return (tasks ?? []).map(mapTaskRow)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get tasks failed: ${error.message}`)
    }
    throw new Error('Get tasks failed: Unknown error')
  }
}