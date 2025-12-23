'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Building2, Calendar } from 'lucide-react'
import { JobApplication, AppStatus } from '@/types'
import { 
  createJobApplication, 
  updateJobApplication, 
  updateJobApplicationStatus, 
  deleteJobApplication, 
  getJobApplications 
} from '@/app/actions/jobApplications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { ErrorBoundary, DataErrorFallback } from '@/components/ui/error-boundary'
import { cn } from '@/lib/utils'

interface JobApplicationFormData {
  companyName: string
  position: string
  status: AppStatus
  notes: string
}

const statusColors: Record<AppStatus, string> = {
  'Interview': 'bg-status-interview text-white',
  'Applied': 'bg-status-applied text-white',
  'Rejected': 'bg-status-rejected text-white',
  'Offer': 'bg-status-pending text-white'
}

const statusOptions: AppStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected']

function JobTrackerWidgetCore() {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
  const [filterStatus, setFilterStatus] = useState<AppStatus | 'All'>('All')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<JobApplicationFormData>({
    companyName: '',
    position: '',
    status: 'Applied',
    notes: ''
  })

  // Mock user ID - in real app this would come from auth
  const userId = 'user-123'

  // Load job applications on mount
  useEffect(() => {
    loadJobApplications()
  }, [])

  // Filter applications when filter changes
  useEffect(() => {
    if (filterStatus === 'All') {
      setFilteredApplications(jobApplications)
    } else {
      setFilteredApplications(jobApplications.filter(app => app.status === filterStatus))
    }
  }, [jobApplications, filterStatus])

  const loadJobApplications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const applications = await getJobApplications(userId)
      setJobApplications(applications)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job applications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateApplication = async () => {
    try {
      if (!formData.companyName.trim() || !formData.position.trim()) {
        setError('Company name and position are required')
        return
      }

      const newApplication = await createJobApplication({
        ...formData,
        userId
      })

      setJobApplications(prev => [newApplication, ...prev])
      setFormData({ companyName: '', position: '', status: 'Applied', notes: '' })
      setIsCreateDialogOpen(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job application')
    }
  }

  const handleUpdateApplication = async () => {
    try {
      if (!editingApplication || !formData.companyName.trim() || !formData.position.trim()) {
        setError('Company name and position are required')
        return
      }

      const updatedApplication = await updateJobApplication(editingApplication.id, formData)
      
      setJobApplications(prev => 
        prev.map(app => app.id === editingApplication.id ? updatedApplication : app)
      )
      
      setEditingApplication(null)
      setFormData({ companyName: '', position: '', status: 'Applied', notes: '' })
      setIsEditDialogOpen(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job application')
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: AppStatus) => {
    try {
      const updatedApplication = await updateJobApplicationStatus(applicationId, newStatus)
      
      setJobApplications(prev => 
        prev.map(app => app.id === applicationId ? updatedApplication : app)
      )
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      await deleteJobApplication(applicationId)
      setJobApplications(prev => prev.filter(app => app.id !== applicationId))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job application')
    }
  }

  const openEditDialog = (application: JobApplication) => {
    setEditingApplication(application)
    setFormData({
      companyName: application.companyName,
      position: application.position,
      status: application.status,
      notes: application.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ companyName: '', position: '', status: 'Applied', notes: '' })
    setEditingApplication(null)
    setError(null)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="bg-card rounded-3xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">Job Tracker</h2>
        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AppStatus | 'All')}
            className="bg-input border border-glass rounded-xl px-3 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Add Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="primary" onClick={resetForm}>
                <Plus className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Job Application</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-secondary mb-1 block">Company Name</label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="text-sm text-secondary mb-1 block">Position</label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Enter position title"
                  />
                </div>
                <div>
                  <label className="text-sm text-secondary mb-1 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AppStatus }))}
                    className="w-full bg-input border border-glass rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-secondary mb-1 block">Notes (Optional)</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes..."
                    className="min-h-[80px]"
                  />
                </div>
                {error && (
                  <div className="text-status-rejected text-xs">{error}</div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="primary" 
                    onClick={handleCreateApplication}
                    className="flex-1"
                  >
                    Add Application
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-secondary text-sm">Loading applications...</div>
          </div>
        ) : error && jobApplications.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-status-rejected text-sm">{error}</div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-secondary text-sm">
              {filterStatus === 'All' ? 'No job applications yet' : `No ${filterStatus.toLowerCase()} applications`}
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-3">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-input border border-glass rounded-xl p-4 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-3 h-3 text-secondary flex-shrink-0" />
                        <h3 className="text-sm font-medium text-white truncate">
                          {application.companyName}
                        </h3>
                      </div>
                      <p className="text-xs text-secondary truncate">
                        {application.position}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEditDialog(application)}
                        className="w-6 h-6 p-0"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDeleteApplication(application.id)}
                        className="w-6 h-6 p-0 hover:text-status-rejected"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Status */}
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(application.id, e.target.value as AppStatus)}
                      className={cn(
                        'text-xs px-2 py-1 rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-white/20',
                        statusColors[application.status]
                      )}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status} className="bg-card text-white">
                          {status}
                        </option>
                      ))}
                    </select>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-secondary">
                      <Calendar className="w-3 h-3" />
                      {formatDate(application.appliedAt)}
                    </div>
                  </div>

                  {application.notes && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <p className="text-xs text-secondary line-clamp-2">
                        {application.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Job Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-secondary mb-1 block">Company Name</label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="text-sm text-secondary mb-1 block">Position</label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Enter position title"
              />
            </div>
            <div>
              <label className="text-sm text-secondary mb-1 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AppStatus }))}
                className="w-full bg-input border border-glass rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-secondary mb-1 block">Notes (Optional)</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes..."
                className="min-h-[80px]"
              />
            </div>
            {error && (
              <div className="text-status-rejected text-xs">{error}</div>
            )}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="primary" 
                onClick={handleUpdateApplication}
                className="flex-1"
              >
                Update Application
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Wrapper component with error boundary
function JobTrackerWidget() {
  return (
    <ErrorBoundary 
      fallback={DataErrorFallback}
      name="JobTrackerWidget"
      maxRetries={3}
    >
      <JobTrackerWidgetCore />
    </ErrorBoundary>
  )
}

export default JobTrackerWidget
export { JobTrackerWidget }