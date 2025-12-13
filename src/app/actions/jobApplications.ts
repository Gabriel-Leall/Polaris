'use server'

import { JobApplication, AppStatus } from '@/types'

// Job Application Server Actions
export async function createJobApplication(_data: Omit<JobApplication, 'id' | 'appliedAt' | 'lastUpdated'>): Promise<JobApplication> {
  // TODO: Implement with Supabase integration
  throw new Error('Not implemented yet')
}

export async function updateJobApplicationStatus(_id: string, _status: AppStatus): Promise<JobApplication> {
  // TODO: Implement with Supabase integration
  throw new Error('Not implemented yet')
}

export async function updateJobApplication(_id: string, _data: Partial<JobApplication>): Promise<JobApplication> {
  // TODO: Implement with Supabase integration
  throw new Error('Not implemented yet')
}

export async function deleteJobApplication(_id: string): Promise<void> {
  // TODO: Implement with Supabase integration
  throw new Error('Not implemented yet')
}

export async function getJobApplications(_userId: string): Promise<JobApplication[]> {
  // TODO: Implement with Supabase integration
  throw new Error('Not implemented yet')
}