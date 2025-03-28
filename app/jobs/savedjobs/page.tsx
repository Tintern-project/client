"use client"
import { useState, useEffect } from "react"
import SavedJobCard from "../components/SavedJobCard"

interface SavedJob {
  id: string
  title: string
  company: string
  location: string
  industry: string
  description: string
  requirements: string
  applicationLink: string
}

function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSavedJobs = async () => {
    try {
      setIsLoading(true)
      
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://localhost:3000/api/v1/jobs/saved", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setSavedJobs(data)
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  // Remove the deleted job from state
  const handleDeleteJob = (jobId: string) => {
    setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId))
  }

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <main className="w-full min-h-screen bg-[#1e1e1e]">
        <section className="px-14 pt-20 pb-10 text-center">
          <h1 className="text-6xl font-bold tracking-normal text-white mb-2">MY JOBS</h1>
          <p className="text-2xl text-white mb-10">Find your next opportunity</p>

          <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {isLoading ? (
              <div className="text-white text-xl">Loading saved jobs...</div>
            ) : error ? (
              <div className="text-red-500 text-xl">Error: {error}</div>
            ) : savedJobs.length === 0 ? (
              <div className="text-white text-xl">No saved jobs found. Start saving jobs to see them here!</div>
            ) : (
              savedJobs.map((job) => (
                <SavedJobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  industry={job.industry}
                  description={job.description}
                  requirements={job.requirements}
                  applicationLink={job.applicationLink}
                  onDelete={handleDeleteJob}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default SavedJobsPage
