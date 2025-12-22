'use server'

import { supabase, type Tables, type TablesInsert } from '@/lib/supabase'
import { JobApplication, AppStatus } from '@/types'
import { 
  createJobApplicationSchema, 
  updateJobApplicationSchema,
  updateJobApplicationStatusSchema,
  userIdSchema,
  type CreateJobApplicationInput,
  type UpdateJobApplicationInput
} from '@/lib/validations'

type JobApplicationRow = Tables<'job_applications'>

// Job Application Server Actions
export const createJobApplication = async (data: CreateJobApplicationInput): Promise<JobApplication> => {
  try {
    // Validate input data
    const validatedData = createJobApplicationSchema.parse(data)
    
    const now = new Date().toISOString()
    
    const insertData: TablesInsert<'job_applications'> = {
      user_id: validatedData.userId,
      company_name: validatedData.companyName,
      company_domain: validatedData.companyDomain || null,
      position: validatedData.position,
      status: validatedData.status,
      notes: validatedData.notes || null,
      applied_at: now,
      last_updated: now
    }

    const { data: jobApp, error } = await supabase
      .from('job_applications')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create job application: ${error.message}`)
    }

    // Transform database row to JobApplication
    return {
      id: jobApp.id,
      companyName: jobApp.company_name,
      companyDomain: jobApp.company_domain || undefined,
      position: jobApp.position,
      status: jobApp.status,
      appliedAt: new Date(jobApp.applied_at),
      lastUpdated: new Date(jobApp.last_updated),
      notes: jobApp.notes || undefined,
      userId: jobApp.user_id,
      createdAt: new Date(jobApp.created_at),
      updatedAt: new Date(jobApp.updated_at)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create job application failed: ${error.message}`)
    }
    throw new Error('Create job application failed: Unknown error')
  }
}

export const updateJobApplicationStatus = async (id: string, status: AppStatus): Promise<JobApplication> => {
  try {
    // Validate input data
    const validatedData = updateJobApplicationStatusSchema.parse({ id, status })
    
    const { data: jobApp, error } = await supabase
      .from('job_applications')
      .update({
        status: validatedData.status,
        last_updated: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update job application status: ${error.message}`)
    }

    // Transform database row to JobApplication
    return {
      id: jobApp.id,
      companyName: jobApp.company_name,
      companyDomain: jobApp.company_domain || undefined,
      position: jobApp.position,
      status: jobApp.status,
      appliedAt: new Date(jobApp.applied_at),
      lastUpdated: new Date(jobApp.last_updated),
      notes: jobApp.notes || undefined,
      userId: jobApp.user_id,
      createdAt: new Date(jobApp.created_at),
      updatedAt: new Date(jobApp.updated_at)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update job application status failed: ${error.message}`)
    }
    throw new Error('Update job application status failed: Unknown error')
  }
}

export const updateJobApplication = async (id: string, data: Partial<UpdateJobApplicationInput>): Promise<JobApplication> => {
  try {
    // Validate input data
    const validatedData = updateJobApplicationSchema.parse({ id, ...data })
    
    const updateData: Record<string, unknown> = {
      last_updated: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    if (validatedData.companyName !== undefined) updateData.company_name = validatedData.companyName
    if (validatedData.companyDomain !== undefined) updateData.company_domain = validatedData.companyDomain
    if (validatedData.position !== undefined) updateData.position = validatedData.position
    if (validatedData.status !== undefined) updateData.status = validatedData.status
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes

    const { data: jobApp, error } = await supabase
      .from('job_applications')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update job application: ${error.message}`)
    }

    // Transform database row to JobApplication
    return {
      id: jobApp.id,
      companyName: jobApp.company_name,
      companyDomain: jobApp.company_domain || undefined,
      position: jobApp.position,
      status: jobApp.status,
      appliedAt: new Date(jobApp.applied_at),
      lastUpdated: new Date(jobApp.last_updated),
      notes: jobApp.notes || undefined,
      userId: jobApp.user_id,
      createdAt: new Date(jobApp.created_at),
      updatedAt: new Date(jobApp.updated_at)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update job application failed: ${error.message}`)
    }
    throw new Error('Update job application failed: Unknown error')
  }
}

export const deleteJobApplication = async (id: string): Promise<void> => {
  try {
    // Validate job application ID
    const validatedId = userIdSchema.parse(id)
    
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', validatedId)

    if (error) {
      throw new Error(`Failed to delete job application: ${error.message}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Delete job application failed: ${error.message}`)
    }
    throw new Error('Delete job application failed: Unknown error')
  }
}

export const getJobApplications = async (userId: string): Promise<JobApplication[]> => {
  try {
    // Validate user ID
    const validatedUserId = userIdSchema.parse(userId)
    
    const { data: jobApps, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', validatedUserId)
      .order('last_updated', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch job applications: ${error.message}`)
    }

    // Transform database rows to JobApplication array
    return (jobApps ?? []).map((jobApp: JobApplicationRow) => ({
      id: jobApp.id,
      companyName: jobApp.company_name,
      companyDomain: jobApp.company_domain || undefined,
      position: jobApp.position,
      status: jobApp.status,
      appliedAt: new Date(jobApp.applied_at),
      lastUpdated: new Date(jobApp.last_updated),
      notes: jobApp.notes || undefined,
      userId: jobApp.user_id,
      createdAt: new Date(jobApp.created_at),
      updatedAt: new Date(jobApp.updated_at)
    }))
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get job applications failed: ${error.message}`)
    }
    throw new Error('Get job applications failed: Unknown error')
  }
}