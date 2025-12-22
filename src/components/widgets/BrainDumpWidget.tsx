'use client'

import { useEffect, useCallback, useState } from 'react'
import { useBrainDumpStore } from '@/store'
import { useDebounce } from '@/hooks/useDebounce'
import { Textarea, ErrorBoundary } from '@/components/ui'
import { saveBrainDumpNote, getBrainDumpNote } from '@/app/actions'
import { supabase } from '@/lib/supabase'
import { Save, Clock, AlertCircle } from 'lucide-react'

function BrainDumpWidgetCore() {
  const {
    content,
    isLoading,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    setContent,
    setLoading,
    setSaving,
    setLastSaved,
    setUnsavedChanges
  } = useBrainDumpStore()

  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  
  // Debounce content changes for auto-save
  const debouncedContent = useDebounce(content, 2000) // 2 second delay

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserId(user.id)
        }
      } catch (err) {
        console.error('Error getting user:', err)
        setError('Failed to authenticate user')
      }
    }

    getCurrentUser()
  }, [])

  // Load existing note on mount
  useEffect(() => {
    const loadNote = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)
        const note = await getBrainDumpNote(userId)
        if (note) {
          setContent(note.content)
          setLastSaved(note.updatedAt)
        }
      } catch (err) {
        console.error('Error loading brain dump note:', err)
        setError('Failed to load notes')
      } finally {
        setLoading(false)
      }
    }

    loadNote()
  }, [userId, setContent, setLoading, setLastSaved])

  // Auto-save when content changes (debounced)
  useEffect(() => {
    const autoSave = async () => {
      if (!userId || !hasUnsavedChanges || isSaving || isLoading) return

      try {
        setSaving(true)
        setError(null)
        const savedNote = await saveBrainDumpNote(userId, debouncedContent)
        setLastSaved(savedNote.updatedAt)
      } catch (err) {
        console.error('Error auto-saving brain dump note:', err)
        setError('Failed to save notes')
      } finally {
        setSaving(false)
      }
    }

    if (debouncedContent !== content) {
      // Content has been debounced, trigger auto-save
      autoSave()
    }
  }, [debouncedContent, userId, hasUnsavedChanges, isSaving, isLoading, setSaving, setLastSaved, content])

  // Manual save function
  const handleManualSave = useCallback(async () => {
    if (!userId || isSaving) return

    try {
      setSaving(true)
      setError(null)
      const savedNote = await saveBrainDumpNote(userId, content)
      setLastSaved(savedNote.updatedAt)
    } catch (err) {
      console.error('Error manually saving brain dump note:', err)
      setError('Failed to save notes')
    } finally {
      setSaving(false)
    }
  }, [userId, content, isSaving, setSaving, setLastSaved])

  // Handle content change
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setUnsavedChanges(true)
    setError(null)
  }, [setContent, setUnsavedChanges])

  // Format last saved time
  const formatLastSaved = (date: Date | null) => {
    if (!date) return 'Never'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">Brain Dump</h2>
        <div className="flex items-center gap-2">
          {/* Save Status */}
          <div className="flex items-center gap-1 text-xs text-secondary">
            {isSaving ? (
              <>
                <Save className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Clock className="w-3 h-3" />
                <span>Unsaved</span>
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                <span>Saved {formatLastSaved(lastSaved)}</span>
              </>
            )}
          </div>
          
          {/* Manual Save Button */}
          {hasUnsavedChanges && (
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="text-xs text-primary hover:text-primary-glow transition-colors disabled:opacity-50"
            >
              Save Now
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-status-rejected/10 border border-status-rejected/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-status-rejected" />
          <span className="text-xs text-status-rejected">{error}</span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 relative">
        {/* Line Numbers Gutter */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-input/50 border-r border-glass rounded-l-xl flex flex-col text-xs text-muted font-mono">
          {content.split('\n').map((_, index) => (
            <div key={index} className="px-2 py-1 leading-5 text-right">
              {index + 1}
            </div>
          ))}
          {content === '' && (
            <div className="px-2 py-1 leading-5 text-right">1</div>
          )}
        </div>

        {/* Textarea */}
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your thoughts, ideas, code snippets, or anything else..."
          disabled={isLoading || !userId}
          className="pl-14 h-full min-h-[300px] font-mono text-sm leading-5 bg-input border-glass resize-none focus:ring-primary/50"
          style={{
            fontFamily: 'JetBrains Mono, Geist Mono, monospace',
          }}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-card/80 flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-2 text-sm text-secondary">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Loading notes...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 text-xs text-secondary flex items-center justify-between">
        <span>{content.length} characters</span>
        <span>{content.split('\n').length} lines</span>
      </div>
    </div>
  )
}

// Wrapper component with error boundary
function BrainDumpWidget() {
  return (
    <ErrorBoundary>
      <BrainDumpWidgetCore />
    </ErrorBoundary>
  )
}

export default BrainDumpWidget
export { BrainDumpWidget }