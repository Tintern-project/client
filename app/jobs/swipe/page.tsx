"use client"

import { useState, useEffect } from "react"
import { JobCard } from "@/app/jobs/swipe/components/job-card"
import { apiClient } from "@/lib/api-client"
import FilterSection from "@/app/jobs/components/FilterSection"
import SearchBar from "@/app/jobs/components/SearchBar"
import { useRouter } from "next/navigation"


export default function Home() {
  // Define job interface to match the API response
  interface Job {
    _id: string
    id?: string
    title: string
    company: string
    city: string
    country: string
    industry: string
    role: string
    description?: string
    requirements?: string[]
    matchScore?: number
    location?: string
  }

  const [jobListings, setJobListings] = useState<Job[]>([])
  const [favorites, setFavorites] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const router = useRouter()


  // Fetch all jobs on initial load
  useEffect(() => {
    fetchAllJobs()
  }, [])

  const navigateToGridView = () => {
    router.push('/jobs')
  }

  const fetchAllJobs = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await apiClient("/jobs")
      const formattedJobs = data.map((job: any) => ({
        ...job,
        id: job.id || job._id,
        _id: job._id || job.id,
        location: `${job.city || ''}, ${job.country || ''}`.replace(/(^, )|(, $)/g, ''),
        matchScore: job.matchScore || Math.floor(Math.random() * 30) + 70,
        requirements: Array.isArray(job.requirements)
          ? job.requirements
          : job.requirements?.split(/[,;]/).map((req: string) => req.trim()) || [],
      }))
      setJobListings(formattedJobs)
    } catch (error: any) {
      setError(error.message || "Failed to fetch jobs")
      console.error("Error fetching all jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToFavorites = async (job: Job) => {
    try {
      // Call the API to save the job
      await apiClient(`/jobs/save/${job._id || job.id}`, {
        method: "POST",
      })

      // Add to local favorites state
      setFavorites((prev) => {
        // Check if job is already in favorites
        if (prev.some((favJob) => (favJob._id || favJob.id) === (job._id || job.id))) {
          return prev
        }
        return [...prev, job]
      })
    } catch (error) {
      console.error("Error saving job:", error)
    }
  }

  const handleJobResults = (jobs: any[]) => {
    // Format the jobs to match our expected structure
    const formattedJobs = jobs.map((job: any) => ({
      ...job,
      id: job.id || job._id,
      _id: job._id || job.id,
      location: `${job.city || ''}, ${job.country || ''}`.replace(/(^, )|(, $)/g, ''),
      matchScore: job.matchScore || Math.floor(Math.random() * 30) + 70,
      requirements: Array.isArray(job.requirements)
        ? job.requirements
        : job.requirements?.split(/[,;]/).map((req: string) => req.trim()) || [],
    }))
    setJobListings(formattedJobs)
  }

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites)
  }

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <main className="w-full min-h-screen bg-[#1a1a1a]">
        <section className="px-14 pt-20">
          <div className="flex justify-between items-center mb-10 max-sm:flex-col max-sm:items-start">
            <h1 className="text-5xl font-medium tracking-normal leading-8 text-white max-sm:text-3xl max-sm:text-center max-sm:mb-5">
              SWIPE THROUGH JOBS
            </h1>
            
            <button
              onClick={navigateToGridView}
              className="p-3 text-base text-rose-100 bg-orange-800 rounded-lg border border-solid"
            >
              Grid Mode
            </button>
          </div>
          
          {/* Commented out filter section */}
          {/* <div className="flex gap-5 items-center max-md:flex-col max-md:items-start max-sm:px-2.5 max-sm:py-0 mb-10">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="filter-icon"
            >
              <path
                d="M44 6H4L20 24.92V38L28 42V24.92L44 6Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <FilterSection onResults={handleJobResults} />
            <SearchBar onResults={handleJobResults} />
          </div> */}
        </section>

        <section className="flex justify-center items-center px-4 py-10">
          <div className="w-full max-w-xl mx-auto">
            {isLoading ? (
              <div className="text-white text-xl text-center">Loading jobs...</div>
            ) : error ? (
              <div className="text-red-500 text-xl text-center">Error: {error}</div>
            ) : jobListings.length > 0 ? (
              <div className="relative h-[500px] w-full">
                <JobCard jobs={jobListings} onAddToFavorites={handleAddToFavorites} />
              </div>
            ) : (
              <div className="text-white text-xl text-center">No jobs found. Try adjusting your filters.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}