"use client"

import React, { useState } from "react"
import Image from "next/image"
import Cookies from "js-cookie"
import { apiClient } from "@/lib/api-client"

interface SavedJobCardProps {
  id: string
  title: string
  company: string
  location: string
  industry: string
  description: string
  requirements: string
  applicationLink: string
  onDelete: (id: string) => void
}

const SavedJobCard: React.FC<SavedJobCardProps> = ({
  id,
  title,
  company,
  location,
  industry,
  description,
  requirements,
  applicationLink,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Set a character limit for the description
  const MAX_DESCRIPTION_LENGTH = 150
  const isDescriptionLong = description?.length > MAX_DESCRIPTION_LENGTH

  // Format the requirements string into an array for display
  const requirementsList =
    requirements?.split(/[,;]/).filter((req) => req.trim().length > 0) || []

  const toggleDescription = () => {
    setIsExpanded(!isExpanded)
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Use apiClient for consistent request handling
      await apiClient(`/jobs/save/delete/${id}`, {
        method: "DELETE",
      });
  
      console.log(`Deleted job: ${title} at ${company}`);
      onDelete(id); // Update parent state to remove the job card
    } catch (err) {
      console.error("Error deleting job:", err);
      // Error handling is already centralized in apiClient (including 401 redirect)
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApply = () => {
    if (applicationLink) {
      window.open(applicationLink, "_blank")
    } else {
      console.error("No application link provided")
    }
  }

  return (
    <div className="bg-[#d9d9d9] rounded-md p-6 flex justify-between items-start">
      <div className="flex gap-6">
        <div className="w-20 h-20 flex-shrink-0">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt={`${company} logo`}
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <div className="text-left">
          <h3 className="text-2xl font-bold text-[#212121]">{title || "Unknown Position"}</h3>
          <p className="text-lg text-[#212121]">
            {company || "Unknown Company"} | {location || "Remote"}
          </p>
          <p className="text-sm text-[#49454f] mb-2">Industry: {industry || "Not specified"}</p>

          <div className="mt-2">
            <p className="font-medium text-[#212121]">Description:</p>
            <p className="text-[#212121] text-sm">
              {isExpanded || !isDescriptionLong
                ? description
                : `${description?.substring(0, MAX_DESCRIPTION_LENGTH)}...`}
              {isDescriptionLong && (
                <button onClick={toggleDescription} className="ml-1 text-[#963434] hover:underline">
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </p>
          </div>

          <div className="mt-2">
            <p className="font-medium text-[#212121]">Requirements:</p>
            {requirementsList.length > 0 ? (
              <ul className="list-disc pl-5">
                {requirementsList.map((req, index) => (
                  <li key={index} className="text-[#212121]">
                    {req.trim()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#212121]">No specific requirements listed</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-6 py-2 bg-[#2c2c2c] text-white rounded-md hover:bg-[#1e1e1e] transition-colors"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-2 bg-[#963434] text-white rounded-md hover:bg-[#7a2a2a] transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default SavedJobCard;
