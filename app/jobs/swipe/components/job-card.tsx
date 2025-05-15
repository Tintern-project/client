"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Trash2, Star, ChevronDown } from "lucide-react"
import type { Job } from "@/app/jobs/swipe/types/job"
import { apiClient } from "@/lib/api-client"

export function JobCard({
  jobs,
  onAddToFavorites,
}: {
  jobs: Job[]
  onAddToFavorites: (job: Job) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<null | "left" | "right">(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const controls = useAnimation()
  const [atsData, setAtsData] = useState<{ ats: number; response: string } | null>(null)
  const [isLoadingAts, setIsLoadingAts] = useState(false)

  // Function to handle card transition
  const handleCardTransition = (direction: "left" | "right") => {
    if (isAnimating || currentIndex >= jobs.length) return

    setIsAnimating(true)
    setSwipeDirection(direction)

    // If swiping right, add to favorites
    if (direction === "right" && currentIndex < jobs.length) {
      onAddToFavorites(jobs[currentIndex])
    }

    // Animate the card out with enhanced rotation
    controls
      .start({
        x: direction === "right" ? 500 : -500,
        rotate: direction === "right" ? 30 : -30,
        opacity: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      })
      .then(() => {
        // Move to next card after animation
        setCurrentIndex((prev) => Math.min(prev + 1, jobs.length))
        setSwipeDirection(null)
        setIsAnimating(false)
        setShowDetails(false)
        // Reset ATS data for the next card
        setAtsData(null)

        // Reset position for next card
        controls.set({
          x: 0,
          rotate: 0,
          opacity: 1,
        })
      })
  }

  // Handle drag end
  const handleDragEnd = (event: any, info: any) => {
    if (isAnimating) return

    const swipeThreshold = 50 // Reduced threshold - easier to trigger swipe
    const { offset } = info

    if (Math.abs(offset.x) > swipeThreshold) {
      // Swipe detected
      handleCardTransition(offset.x > 0 ? "right" : "left")
    } else {
      // Reset position
      controls.start({
        x: 0,
        rotate: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      })
      setSwipeDirection(null)
    }
  }

  // Function to fetch ATS score
  const fetchAtsScore = async (jobId: string) => {
    // If we already have ATS data, don't fetch it again
    if (atsData) {
      return
    }
    
    try {
      setIsLoadingAts(true)
      const data = await apiClient(`/jobs/ats/${jobId}`)
      setAtsData(data)
    } catch (error) {
    } finally {
      setIsLoadingAts(false)
    }
  }

  // Handle drag with enhanced tilt effect
  const handleDrag = (event: any, info: any) => {
    if (isAnimating) return

    const { offset } = info

    // Increase rotation factor for more noticeable tilt
    const rotationFactor = 0.2 // Increased for more pronounced tilt
    const rotation = Math.min(Math.max(offset.x * rotationFactor, -20), 20) // Increased limit to ±20 degrees

    // Apply rotation during drag with immediate effect (no transition)
    controls.set({
      x: offset.x,
      rotate: rotation,
    })

    // Update visual feedback based on drag direction
    if (offset.x > 10) {
      setSwipeDirection("right")
    } else if (offset.x < -10) {
      setSwipeDirection("left")
    } else {
      setSwipeDirection(null)
    }
  }

  // Reset when we run out of cards
  useEffect(() => {
    if (currentIndex >= jobs.length && jobs.length > 0) {
      const timer = setTimeout(() => {
        setCurrentIndex(0)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, jobs.length])

  // Reset animation state if stuck
  useEffect(() => {
    const resetTimer = setTimeout(() => {
      if (isAnimating) {
        setIsAnimating(false)
        setSwipeDirection(null)
        controls.set({
          x: 0,
          rotate: 0,
          opacity: 1,
        })
      }
    }, 2000) // Reset if animation takes too long

    return () => clearTimeout(resetTimer)
  }, [isAnimating, controls])

  // If no jobs, show a message
  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-[#e6e6e6] rounded-3xl p-8 shadow-xl select-none">
          <p className="text-center text-gray-800 select-none">No jobs found. Try adjusting your filters.</p>
        </div>
      </div>
    )
  }

  // If we've gone through all jobs
  if (currentIndex >= jobs.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-[#e6e6e6] rounded-3xl p-8 shadow-xl select-none">
          <p className="text-center text-gray-800 select-none">No more jobs to show!</p>
        </div>
      </div>
    )
  }

  const currentJob = jobs[currentIndex]

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Action buttons - responsive positioning - hidden on extra small screens */}
      <button
        onClick={() => !isAnimating && handleCardTransition("left")}
        className="absolute hidden sm:flex left-[-30px] sm:left-[-40px] md:left-[-60px] z-30 bg-red-500 rounded-full p-3 sm:p-4 shadow-lg hover:bg-red-600 transition-colors items-center justify-center"
        disabled={isAnimating}
        aria-label="Reject"
      >
        <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </button>

      <button
        onClick={() => !isAnimating && handleCardTransition("right")}
        className="absolute hidden sm:flex right-[-30px] sm:right-[-40px] md:right-[-60px] z-30 bg-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-gray-100 transition-colors items-center justify-center"
        disabled={isAnimating}
        aria-label="Save"
      >
        <Star className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a1a1a]" />
      </button>

      {/* Visual indicators for swipe direction - enhanced for small screens */}
      {swipeDirection === "left" && (
        <>
          {/* Indicator for larger screens */}
          <div className="absolute hidden sm:block left-[-30px] sm:left-[-40px] md:left-[-60px] top-1/2 transform -translate-y-1/2 z-20 transition-opacity">
            <div className="animate-pulse bg-red-500 rounded-full p-4 sm:p-5 md:p-6 shadow-lg">
              <Trash2 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
          </div>
          {/* Red glow effect for all screen sizes */}
          <div className="absolute inset-0 rounded-3xl shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse z-10"></div>
        </>
      )}

      {swipeDirection === "right" && (
        <>
          {/* Indicator for larger screens */}
          <div className="absolute hidden sm:block right-[-30px] sm:right-[-40px] md:right-[-60px] top-1/2 transform -translate-y-1/2 z-20 transition-opacity">
            <div className="animate-pulse bg-white rounded-full p-4 sm:p-5 md:p-6 shadow-lg">
              <Star className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#1a1a1a]" />
            </div>
          </div>
          {/* Green glow effect for all screen sizes */}
          <div className="absolute inset-0 rounded-3xl shadow-[0_0_15px_rgba(34,197,94,0.7)] animate-pulse z-10"></div>
        </>
      )}

      {/* Current card */}
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragStart={() => setDragStart({ x: 0, y: 0 })}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ x: 0, rotate: 0 }}
        className="absolute w-[90%] sm:w-[85%] md:w-[80%] select-none cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      >
        <div
          className={`bg-[#e6e6e6] rounded-3xl shadow-xl overflow-hidden mx-auto
            ${swipeDirection === "left" ? "border-l-4 border-red-500 sm:border-l-0" : ""}
            ${swipeDirection === "right" ? "border-r-4 border-green-500 sm:border-r-0" : ""}
          `}
        >
          <div className="p-4 sm:p-5 md:p-6 select-none">
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a] select-none">{currentJob.title}</h2>
            <p className="text-sm sm:text-base text-gray-700 select-none">
              {currentJob.company} -{" "}
              {currentJob.location ||
                `${currentJob.city || ""}, ${currentJob.country || ""}`.replace(/(^, )|(, $)/g, "")}
            </p>
            <p className="text-sm sm:text-base text-gray-700 select-none">
              {currentJob.industry} - {currentJob.role}
            </p>

            <div className="mt-3 sm:mt-4 select-none">
              <p className="font-semibold underline select-none text-gray-800 text-sm sm:text-base">Requirements:</p>
              <ul className="list-disc pl-4 sm:pl-5 mt-1 sm:mt-2 select-none text-sm sm:text-base">
                {currentJob.requirements && currentJob.requirements.length > 0 ? (
                  currentJob.requirements.slice(0, 3).map((req, index) => (
                    <li key={index} className="text-gray-800 select-none">
                      {req}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-800 select-none">No specific requirements listed</li>
                )}
                {currentJob.requirements && currentJob.requirements.length > 3 && (
                  <li className="text-gray-800 select-none">...and {currentJob.requirements.length - 3} more</li>
                )}
              </ul>
            </div>

            <div className="mt-4 sm:mt-6 flex items-center justify-between select-none">
              <div className="select-none">
                <p className="font-semibold text-gray-800 select-none text-sm sm:text-base">ATS Score</p>
                <p className="text-4xl sm:text-5xl font-bold text-[#8B5A2B] select-none">{atsData ? `${atsData.ats}%` : "--"}</p>
              </div>
              <div className="max-w-[60%] select-none">
                <p className="text-xs sm:text-sm text-gray-700 select-none">
                  This score indicates how well your resume would perform in an Applicant Tracking System.
                </p>
              </div>
            </div>

            <button
              className="mt-3 sm:mt-4 bg-[#333] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md flex items-center justify-center w-full select-none text-sm sm:text-base"
              onClick={() => {
                if (!showDetails && currentJob && currentJob.id) {
                  fetchAtsScore(currentJob.id.toString())
                }
                // Toggle details without resetting ATS data
                setShowDetails(!showDetails)
              }}
            >
              {showDetails ? "Hide ATS Result" : "Show ATS Result"} <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </button>

            {showDetails && (
              <div className="mt-3 sm:mt-4 text-gray-800 select-none">
                {isLoadingAts ? (
                  <div className="mt-2 sm:mt-4">
                    <p className="text-center text-sm sm:text-base">Loading ATS analysis...</p>
                  </div>
                ) : atsData ? (
                  <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="font-bold text-base sm:text-lg">ATS Score</h3>
                      <span
                        className="text-2xl sm:text-3xl font-bold"
                        style={{ color: atsData.ats >= 70 ? "#4CAF50" : atsData.ats >= 50 ? "#FF9800" : "#F44336" }}
                      >
                        {atsData.ats}%
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-sm sm:text-base">CV Improvement Suggestions:</p>
                      <p className="text-xs sm:text-sm">{atsData.response}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm sm:text-base">Failed to load ATS analysis. Please try again.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Swipe instructions */}
      <div className="absolute bottom-[-40px] sm:bottom-[-50px] md:bottom-[-60px] text-white text-center w-full opacity-70 select-none">
        <p className="text-sm sm:text-base">Swipe left to reject, right to save</p>
      </div>
    </div>
  )
}
