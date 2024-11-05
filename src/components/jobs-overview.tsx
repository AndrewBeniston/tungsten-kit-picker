"use client"

import { useEffect, useState } from "react"
import { Job } from "@/types/job"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Grid, List, Plus, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "./ui/loading-spinner"
import { ErrorMessage } from "./ui/error-message"

export function JobsOverview() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [newJob, setNewJob] = useState({
    title: '',
    client: '',
    date: new Date().toISOString().split('T')[0]
  })
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (!response.ok) throw new Error('Failed to fetch jobs')
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to fetch jobs'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.client) return

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      })

      if (!response.ok) throw new Error('Failed to create job')
      
      const job = await response.json()
      setJobs([...jobs, job])
      setNewJob({ title: '', client: '', date: new Date().toISOString().split('T')[0] })
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create job:', error)
      setError(error instanceof Error ? error : new Error('Failed to create job'))
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete job')

      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (error) {
      console.error('Failed to delete job:', error)
      setError(error instanceof Error ? error : new Error('Failed to delete job'))
    }
  }

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.client.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
        {isAuthenticated && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Job
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold">Create New Job</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
            <Input
              placeholder="Client Name"
              value={newJob.client}
              onChange={(e) => setNewJob({ ...newJob, client: e.target.value })}
            />
            <Input
              type="date"
              value={newJob.date}
              onChange={(e) => setNewJob({ ...newJob, date: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateJob}>
              Create Job
            </Button>
          </div>
        </div>
      )}

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {filteredJobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            viewMode={viewMode}
            onDelete={handleDeleteJob}
            canDelete={isAuthenticated}
          />
        ))}
      </div>
    </div>
  )
}

interface JobCardProps {
  job: Job
  viewMode: 'grid' | 'list'
  onDelete: (id: string) => void
  canDelete: boolean
}

function JobCard({ job, viewMode, onDelete, canDelete }: JobCardProps) {
  return (
    <div className={`p-4 rounded-lg border ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
      <div>
        <h3 className="font-semibold">{job.title}</h3>
        <p className="text-sm text-muted-foreground">{job.client}</p>
      </div>
      <div className={`${viewMode === 'list' ? 'flex items-center gap-4' : 'mt-4 flex items-center justify-between'}`}>
        <div>
          <span className="text-sm">{job.date}</span>
          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs
            ${job.status === 'completed' ? 'bg-green-100 text-green-800' :
              job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'}`}>
            {job.status}
          </span>
        </div>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(job.id)}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
} 