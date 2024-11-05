"use client"

import { JobsOverview } from "@/components/jobs-overview"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Production Jobs</h1>
      </div>
      <JobsOverview />
    </div>
  )
} 