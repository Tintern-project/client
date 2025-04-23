"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Grid3X3,
  Clock,
  ChevronDown,
  ChevronUp,
  Calendar,
  Lightbulb,
  FileSearch,
  RefreshCw,
  Briefcase,
  X,
} from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import Cookies from "js-cookie";

// Define TypeScript interfaces for our data
interface ATSScore {
  ats: number
  response: string
  _id: string
}

interface ScoreData {
  _id: string
  userId: string
  jobId: string
  atsScore: ATSScore
  resumeHash: string
  scoredAt: string
  __v: number
}

interface JobDetails {
  _id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  [key: string]: any // For any additional fields
}


export default function ATSScorePage() {
  const [atsScores, setAtsScores] = useState<ScoreData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState("grid") // "grid" or "timeline"
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // States for recalculating ATS score
  const [recalculatingId, setRecalculatingId] = useState<string | null>(null)

  // States for job details modal
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const [isJobLoading, setIsJobLoading] = useState(false)
  const [jobError, setJobError] = useState<string | null>(null)

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setIsLoading(true)
        const data = await apiClient("/ats-scores/my-scores")
        setAtsScores(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch ATS scores")
      } finally {
        setIsLoading(false)
      }
    }

    fetchScores()
  }, [])

  const getScoreColor = (score: number) => { 
    if (score >= 70) return "from-emerald-500 to-green-600"
    if (score <70 && score >= 30) return "from-amber-500 to-orange-600"
    if (score < 30) return "from-red-500 to-red-600"
    return "from-red-500 to-rose-600"
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleRecalculateATS = async (jobId: string, scoreId: string) => {
    try {
      setRecalculatingId(scoreId)

      // Call the API to recalculate the ATS score
      const response = await apiClient(`/jobs/ats/${jobId}`, {
        method: "GET",
      })

      // Update the score in the local state most of the time will remain the same unless user changes the CV
      setAtsScores((prevScores) =>
        prevScores.map((score) =>
          score._id === scoreId
            ? {
                ...score,
                atsScore: {
                  ...score.atsScore,
                  ats: response.ats || score.atsScore.ats,
                  response: response.response || score.atsScore.response,
                },
                scoredAt: new Date().toISOString(),
              }
            : score,
        ),
      )

      // Show success notification (could be implemented with a toast)
      console.log("ATS score recalculated successfully")
    } catch (error) {
      console.error("Error recalculating ATS score:", error)
      alert("Failed to recalculate ATS score. Please try again.")
    } finally {
      setRecalculatingId(null)
    }
  }

  const openJobDetails = async (jobId: string) => {
    try {
        const token = Cookies.get("token"); // this is a farmer way what that what my thinking got me to do since the id is not in the params request here
      setIsJobLoading(true)
      window.location.href = `http://localhost:3001/jobs/${jobId}`;
    } catch (err: any) {
      console.error("Error fetching job details:", err)
      setJobError(err.message || "Failed to load job details")
    } finally {
      setIsJobLoading(false)
    }
    
  }

  const closeJobModal = () => {
    setIsJobModalOpen(false)
    setSelectedJobId(null)
    setJobDetails(null)
  }

  if (isLoading) return <LoadingState />
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>
  if (!atsScores || atsScores.length === 0) return <EmptyState />

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Your ATS Scores
            </h1>
            <p className="text-gray-400 mt-2">Track how your resume performs against job requirements</p>
          </div>

          <div className="flex items-center space-x-2 bg-[#1E1E1E] p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === "grid" ? "bg-[#BA1B1B] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid3X3 size={18} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === "timeline" ? "bg-[#BA1B1B] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <Clock size={18} />
              <span className="hidden sm:inline">Timeline</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {atsScores.map((score) => (
                <ScoreCard
                  key={score._id}
                  score={score}
                  isExpanded={expandedId === score._id}
                  toggleExpand={() => toggleExpand(score._id)}
                  scoreColor={getScoreColor(score.atsScore.ats)}
                  onRecalculate={() => handleRecalculateATS(score.jobId, score._id)}
                  isRecalculating={recalculatingId === score._id}
                  onViewJobDetails={() => openJobDetails(score.jobId)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScoreTimeline
                scores={atsScores}
                expandedId={expandedId}
                toggleExpand={toggleExpand}
                getScoreColor={getScoreColor}
                onRecalculate={(jobId, scoreId) => handleRecalculateATS(jobId, scoreId)}
                recalculatingId={recalculatingId}
                onViewJobDetails={openJobDetails}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Job Details Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#1E1E1E] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 m-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Job Details</h2>
              <button onClick={closeJobModal} className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors">
                <X size={20} />
              </button>
            </div>

            {isJobLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BA1B1B]"></div>
              </div>
            )}

            {jobError && (
              <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-lg">{jobError}</div>
            )}

            {jobDetails && !isJobLoading && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{jobDetails.title}</h3>
                  <p className="text-gray-400">{jobDetails.company}</p>
                  {jobDetails.location && <p className="text-gray-400">{jobDetails.location}</p>}
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Description</h4>
                  <p className="text-gray-300 whitespace-pre-line">{jobDetails.description}</p>
                </div>

                {jobDetails.requirements && jobDetails.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-300">
                      {jobDetails.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={closeJobModal}
                    className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Score Card Component
function ScoreCard({
  score,
  isExpanded,
  toggleExpand,
  scoreColor,
  onRecalculate,
  isRecalculating,
  onViewJobDetails,
}: {
  score: ScoreData
  isExpanded: boolean
  toggleExpand: () => void
  scoreColor: string
  onRecalculate: () => void
  isRecalculating: boolean
  onViewJobDetails: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  // Format date
  const formattedDate = new Date(score.scoredAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Extract keywords from response
  const extractKeywords = (response: string) => {
    const keywords = response.match(/\b(skills|experience|projects|frameworks|tools|metrics|highlight)\b/gi)
    return keywords ? [...new Set(keywords)].slice(0, 3) : []
  }

  const keywords = extractKeywords(score.atsScore.response)

  return (
    <motion.div
      layout
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl bg-[#1E1E1E] shadow-lg ${isExpanded ? "shadow-2xl" : ""}`}
    >
      {/* Glowing effect on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${scoreColor} opacity-0 blur-xl`}
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold truncate max-w-[200px]">
              Job ID: {score.jobId.substring(score.jobId.length - 8)}
            </h3>
            <div className="flex items-center text-gray-400 text-sm mt-1">
              <Calendar size={14} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <motion.div
            className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${scoreColor} shadow-lg`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-xl font-bold">{score.atsScore.ats}%</span>
          </motion.div>
        </div>

        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {keywords.map((keyword, index) => (
              <span key={index} className="px-2 py-1 bg-[#2A2A2A] rounded-full text-xs text-gray-300">
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Expandable content */}
        <motion.div
          animate={{ height: isExpanded ? "auto" : "0px" }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-start gap-2 mb-4">
              <Lightbulb size={18} className="text-yellow-500 mt-1 flex-shrink-0" />
              <p className="text-gray-300 text-sm">{score.atsScore.response}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={onViewJobDetails}
                className="flex items-center gap-1 text-white bg-[#2A2A2A] hover:bg-[#3A3A3A] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Briefcase size={14} />
                <span>View Job</span>
              </button>

              <button
                onClick={onRecalculate}
                disabled={isRecalculating}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isRecalculating
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "text-white bg-[#BA1B1B] hover:bg-[#D32F2F]"
                }`}
              >
                <RefreshCw size={14} className={isRecalculating ? "animate-spin" : ""} />
                <span>{isRecalculating ? "Recalculating..." : "Recalculate Score"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Expand/collapse button */}
        <button
          onClick={toggleExpand}
          className="w-full flex justify-center items-center mt-2 text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
    </motion.div>
  )
}

// Timeline Component
function ScoreTimeline({
  scores,
  expandedId,
  toggleExpand,
  getScoreColor,
  onRecalculate,
  recalculatingId,
  onViewJobDetails,
}: {
  scores: ScoreData[]
  expandedId: string | null
  toggleExpand: (id: string) => void
  getScoreColor: (score: number) => string
  onRecalculate: (jobId: string, scoreId: string) => void
  recalculatingId: string | null
  onViewJobDetails: (jobId: string) => void
}) {
  // Sort scores by date (newest first)
  const sortedScores = [...scores].sort((a, b) => new Date(b.scoredAt).getTime() - new Date(a.scoredAt).getTime())

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[22px] top-8 bottom-0 w-1 bg-gradient-to-b from-[#BA1B1B] to-[#2A2A2A] rounded-full" />

      <div className="space-y-8">
        {sortedScores.map((score, index) => {
          const formattedDate = new Date(score.scoredAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })

          const isExpanded = expandedId === score._id
          const scoreColor = getScoreColor(score.atsScore.ats)
          const isRecalculating = recalculatingId === score._id

          return (
            <motion.div
              key={score._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative pl-12"
            >
              {/* Timeline dot */}
              <motion.div
                className={`absolute left-0 top-4 w-11 h-11 rounded-full bg-gradient-to-br ${scoreColor} flex items-center justify-center shadow-lg z-10`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-base font-bold">{score.atsScore.ats}%</span>
              </motion.div>

              <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Job ID: {score.jobId.substring(score.jobId.length - 8)}</h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <Calendar size={14} className="mr-1" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable content */}
                  <motion.div
                    animate={{ height: isExpanded ? "auto" : "0px" }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gray-800">
                      <div className="flex items-start gap-2 mb-4">
                        <Lightbulb size={18} className="text-yellow-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{score.atsScore.response}</p>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4">
                        <button
                          onClick={() => onViewJobDetails(score.jobId)}
                          className="flex items-center gap-1 text-white bg-[#2A2A2A] hover:bg-[#3A3A3A] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Briefcase size={14} />
                          <span>View Job</span>
                        </button>

                        <button
                          onClick={() => onRecalculate(score.jobId, score._id)}
                          disabled={isRecalculating}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            isRecalculating
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : "text-white bg-[#BA1B1B] hover:bg-[#D32F2F]"
                          }`}
                        >
                          <RefreshCw size={14} className={isRecalculating ? "animate-spin" : ""} />
                          <span>{isRecalculating ? "Recalculating..." : "Recalculate Score"}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Expand/collapse button */}
                  <button
                    onClick={() => toggleExpand(score._id)}
                    className="w-full flex justify-center items-center mt-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="bg-[#1E1E1E] p-8 rounded-xl max-w-md">
        <div className="w-20 h-20 bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-6">
          <FileSearch size={32} className="text-gray-400" />
        </div>

        <h2 className="text-2xl font-bold mb-3">No ATS Scores Yet</h2>
        <p className="text-gray-400 mb-6">
          Upload your resume and apply to jobs to see how well your resume matches job requirements.
        </p>

        <Link
          href="/jobs"
          className="inline-block bg-[#BA1B1B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#D32F2F] transition-colors"
        >
          Browse Jobs
        </Link>
      </div>
    </motion.div>
  )
}

// Loading State Component
function LoadingState() {
  // Create an array of 6 items for skeleton cards
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i)

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Skeleton header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="h-10 w-48 bg-[#1E1E1E] rounded-lg animate-pulse mb-2"></div>
            <div className="h-5 w-64 bg-[#1E1E1E] rounded-lg animate-pulse"></div>
          </div>

          <div className="h-10 w-32 bg-[#1E1E1E] rounded-lg animate-pulse"></div>
        </div>

        {/* Skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonCards.map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="h-6 w-32 bg-[#2A2A2A] rounded-lg animate-pulse mb-2"></div>
                  <div className="h-4 w-24 bg-[#2A2A2A] rounded-lg animate-pulse"></div>
                </div>
                <div className="w-16 h-16 rounded-full bg-[#2A2A2A] animate-pulse"></div>
              </div>

              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-[#2A2A2A] rounded-full animate-pulse"></div>
                <div className="h-6 w-16 bg-[#2A2A2A] rounded-full animate-pulse"></div>
              </div>

              <div className="h-4 w-full bg-[#2A2A2A] rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 w-3/4 bg-[#2A2A2A] rounded-lg animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
