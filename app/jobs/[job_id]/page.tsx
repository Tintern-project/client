"use client"

import { useState, useEffect } from "react"
import { BookmarkIcon, BriefcaseIcon, MapPinIcon, CalendarIcon, ClockIcon } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useParams } from "next/navigation"
import { DidYouApplyModal } from '../components/DidYouApplyModal';

export default function JobDetail() {
    const [saved, setSaved] = useState(false)
    const [job, setJob] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showApplyModal, setShowApplyModal] = useState(false)
    const [isApplying, setIsApplying] = useState(false)

    const params = useParams()
    const jobId = params.job_id as string

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
            setLoading(true)
            const data = await apiClient(`/jobs/${jobId}`)
            setJob(data)
            } catch (err) {
            console.error("Error fetching job details:", err)
            setError("Failed to load job details")
            } finally {
            setLoading(false)
            }
        }

        if (jobId) {
            fetchJobDetails()
        }
    }, [jobId])

    const handleSaveJob = async () => {
        try {
          await apiClient(`/jobs/save/${jobId}`, {
            method: "POST",
          })
          setSaved(true)
          alert("Job saved to favorites!")
        } catch (error) {
          console.error("Error saving job:", error)
          alert("Failed to save job. Please try again.")
        }
    }

    const handleApply = () => {
        setShowApplyModal(true)
        if (job?.applicationLink) {
            window.open(job.applicationLink, "_blank")
        } else {
            console.error("No application link provided")
        }
    }

    const handleConfirmApply = async () => {
        try {
            setIsApplying(true)
            await apiClient(`/application`, {
                method: "POST",
                data: { jobId }
            })
        } catch (err: any) {
            alert("You have already applied to this job!\nCheck your JobApplications in your profile.")
        } finally {
            setIsApplying(false)
            setShowApplyModal(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-white p-6 flex items-center justify-center">
            <p className="text-xl">Loading job details...</p>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-white p-6 flex items-center justify-center">
            <p className="text-xl text-red-500">{error || "Job not found"}</p>
            </div>
        )
    }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#e6e6e6] text-black rounded-lg p-8 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
              <div className="flex items-center text-gray-700 mb-1">
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span>{job.city}, {job.country}</span>
              </div>
            </div>
            <div className="bg-[#8b4513] text-white rounded-full px-4 py-2 text-sm">
              <div className="font-bold">{job.matchScore || "85"}%</div>
              <div className="text-xs">Match</div>
            </div>
          </div>

          <div className="border-t border-gray-300 my-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="font-bold mb-2 text-lg">Job Details</h2>
                <div className="flex items-center mb-2">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-600" />
                  <span>{job.role || "Full-time"}</span>
                </div>
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-4 w-4 mr-2 text-gray-600" />
                  <span>Posted 2 days ago</span>
                </div>
              </div>
              <div>
                <h2 className="font-bold mb-2 text-lg">Industry</h2>
                <p>{job.industry || "Technology"}</p>
              </div>
            </div>

            <h2 className="font-bold mb-3 text-lg">Requirements:</h2>
            <ul className="list-disc pl-5 mb-6 space-y-1">
              {job.requirements && Array.isArray(job.requirements) ? (
                job.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))
              ) : (
                <>
                  <li>Experience with relevant technologies</li>
                  <li>Strong communication skills</li>
                  <li>Problem-solving abilities</li>
                </>
              )}
            </ul>

            <h2 className="font-bold mb-3 text-lg">Job Description</h2>
            <p className="mb-4">
              {job.description || "This position offers an exciting opportunity to work with a dynamic team in a growing company."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded font-medium text-white transition-colors ${
                    saved ? "bg-green-600 hover:bg-green-700" : "bg-gray-800 hover:bg-gray-900"
                }`} onClick={handleSaveJob} >
                <BookmarkIcon className="h-5 w-5" />
                {saved ? "Saved" : "Save Job"}
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded font-medium text-white transition-colors bg-[#a52a2a] hover:bg-[#8b2323]" onClick={handleApply} disabled={isApplying} >
                    {isApplying ? "Applying..." : "Apply"}
                </button>
            </div>
          </div>
        </div>
        <DidYouApplyModal open={showApplyModal} onClose={() => setShowApplyModal(false)} onYes={handleConfirmApply} />
      </div>
    </div>
  )
}