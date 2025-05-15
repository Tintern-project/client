"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DidYouApplyModal } from "../components/DidYouApplyModal";
import { apiClient } from "@/lib/api-client";
import { MapPin, Factory } from "lucide-react";
import { useToast } from "../../context/ToastContext"; // Adjusted path

interface SavedJobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  description: string;
  requirements: string;
  applicationLink: string;
  onDelete: (id: string) => void;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false); // Add this state
  const [isApplying, setIsApplying] = useState(false); // Add loading state
  const { showToast } = useToast();

  // Set a character limit for the description
  const MAX_DESCRIPTION_LENGTH = 150;
  const isDescriptionLong = description?.length > MAX_DESCRIPTION_LENGTH;

  // Format the requirements string into an array for display
  const requirementsList =
    requirements?.split(/[,;]/).filter((req) => req.trim().length > 0) || [];

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // Use apiClient for consistent request handling
      await apiClient(`/jobs/save/delete/${id}`, {
        method: "DELETE",
      });

      showToast("Job removed successfully!", "success");
      onDelete(id); // Update parent state to remove the job card
    } catch (err: any) {
      showToast(err.message || "Failed to remove job.", "error");
      // Error handling is already centralized in apiClient (including 401 redirect)
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApply = () => {
    setShowApplyModal(true);
    if (applicationLink) {
      window.open(applicationLink, "_blank");
    } 
  };

  const handleConfirmApply = async () => {
    try {
      setIsApplying(true);

      await apiClient(`/application`, {
        method: "POST",
        data: { jobId: id }, // Adjust the body structure according to your API requirements
      });
      showToast("Application status updated!", "success");
    } catch (err: any) {
      showToast(
        err.message ||
          "Failed to update application status. You may have already applied.",
        "error",
      );
    } finally {
      setIsApplying(false);
      setShowApplyModal(false);
    }
  };

  return (
    <div className="bg-[#d9d9d9] w-full rounded-md p-6 flex flex-col md:flex-row justify-between items-stretch transition-shadow hover:shadow-[0_0_24px_4px_rgba(220,38,38,0.6)]">
      <div className="flex gap-6 justify-center items-center">
        <div className="w-20 h-20 ">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt={`${company} logo`}
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <div className="text-left">
          <h3 className="text-2xl font-bold text-orange-800">
            {title || "Unknown Position"}
          </h3>
          <div className="flex gap-4 items-center mb-1">
            <p className="text-lg text-[#212121] flex items-center gap-2 m-0">
              <MapPin className="text-[#2c2c2c] w-5 h-5" />
              {location || "Remote"}
            </p>
            <p className="text-lg text-[#212121] flex items-center gap-2 m-0">
              <Factory className="text-[#2c2c2c] w-5 h-5" />
              {industry || "Not specified"}
            </p>
          </div>

          <div className="mt-2">
            <p className="font-large font-bold text-[#212121]">Description:</p>
            <p className="text-[#212121] text-sm">
              {isExpanded || !isDescriptionLong
                ? description
                : `${description?.substring(0, MAX_DESCRIPTION_LENGTH)}...`}
              {isDescriptionLong && (
                <button
                  onClick={toggleDescription}
                  className="ml-1 text-[#963434] hover:underline"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </p>
          </div>

          <div className="mt-2">
            <p className="font-large font-bold text-[#212121]">Requirements:</p>
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
      <div className="flex flex-col gap-4 justify-center items-center mt-6 md:mt-0">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-6 py-2 bg-[#2c2c2c] text-white rounded-md hover:bg-[#1e1e1e] transition-colors w-[122px]"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button
          onClick={handleApply}
          disabled={isApplying}
          className="p-3 text-base bg-orange-800 rounded-lg transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] text-neutral-100 w-[122px]"
        >
          {isApplying ? "Applying..." : "Apply"}
        </button>
      </div>
      <DidYouApplyModal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onYes={handleConfirmApply}
      />
    </div>
  );
};

export default SavedJobCard;
