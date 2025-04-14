"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Trash2, Star, ChevronDown } from "lucide-react"
import type { Job } from "@/app/jobs/swipe/types/job"

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
      {/* Action buttons - moved further away */}
      <button
        onClick={() => !isAnimating && handleCardTransition("left")}
        className="absolute left-[-60px] z-30 bg-red-500 rounded-full p-4 shadow-lg hover:bg-red-600 transition-colors"
        disabled={isAnimating}
        aria-label="Reject"
      >
        <Trash2 className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={() => !isAnimating && handleCardTransition("right")}
        className="absolute right-[-60px] z-30 bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors"
        disabled={isAnimating}
        aria-label="Save"
      >
        <Star className="h-6 w-6 text-[#1a1a1a]" />
      </button>

      {/* Visual indicators for swipe direction */}
      {swipeDirection === "left" && (
        <div className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 z-20 transition-opacity">
          <div className="animate-pulse bg-red-500 rounded-full p-6 shadow-lg">
            <Trash2 className="h-8 w-8 text-white" />
          </div>
        </div>
      )}

      {swipeDirection === "right" && (
        <div className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 z-20 transition-opacity">
          <div className="animate-pulse bg-white rounded-full p-6 shadow-lg">
            <Star className="h-8 w-8 text-[#1a1a1a]" />
          </div>
        </div>
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
        className="absolute w-[80%] select-none cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      >
        <div
          className={`bg-[#e6e6e6] rounded-3xl shadow-xl overflow-hidden mx-auto
            ${swipeDirection === "left" ? "border-l-4 border-red-500" : ""}
            ${swipeDirection === "right" ? "border-r-4 border-green-500" : ""}
          `}
        >
          <div className="p-6 select-none">
            <h2 className="text-xl font-bold text-[#1a1a1a] select-none">{currentJob.title}</h2>
            <p className="text-gray-700 select-none">
              {currentJob.company} - {currentJob.location || `${currentJob.city || ''}, ${currentJob.country || ''}`.replace(/(^, )|(, $)/g, '')}
            </p>
            <p className="text-gray-700 select-none">
              {currentJob.industry} - {currentJob.role}
            </p>

           <div className="mt-4 select-none">
              <p className="font-semibold underline select-none text-gray-800">Requirements:</p>
              <ul className="list-disc pl-5 mt-2 select-none">
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
                  <li className="text-gray-800 select-none">
                    ...and {currentJob.requirements.length - 3} more
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between select-none">
              <div className="select-none">
                <p className="font-semibold text-gray-800 select-none">Match Score</p>
                <p className="text-5xl font-bold text-[#8B5A2B] select-none">{currentJob.matchScore || 75}%</p>
              </div>
              <div className="max-w-[60%] select-none">
                <p className="text-sm text-gray-700 select-none">
                  This score indicates how well your profile matches this job's requirements.
                </p>
              </div>
            </div>

            <button
              className="mt-4 bg-[#333] text-white px-4 py-2 rounded-md flex items-center justify-center w-full select-none"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "View More"} <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {showDetails && (
              <div className="mt-4 text-gray-800 select-none">
                <p className="font-semibold select-none">Description:</p>
                <p className="mt-1 select-none">{currentJob.description || "No detailed description available."}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Swipe instructions */}
      <div className="absolute bottom-[-60px] text-white text-center w-full opacity-70 select-none">
        <p>Swipe left to reject, right to save</p>
      </div>
    </div>
  )
}