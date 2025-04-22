"use client";

import { useState, useEffect } from "react";
import {
  BookmarkIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useParams } from "next/navigation";
import { DidYouApplyModal } from "../components/DidYouApplyModal";

export default function JobDetail() {
  const [saved, setSaved] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [atsButtonContent, setAtsButtonContent] = useState("Get ATS Score");
  const [isFetchingATS, setIsFetchingATS] = useState(false);
  const [atsLoaded, setAtsLoaded] = useState(false);
  const [atsData, setAtsData] = useState<{
    ats: number;
    response: string;
  } | null>(null);

  const params = useParams();
  const jobId = params.job_id as string;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const data = await apiClient(`/jobs/${jobId}`);
        setJob(data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleSaveJob = async () => {
    try {
      await apiClient(`/jobs/save/${jobId}`, {
        method: "POST",
      });
      setSaved(true);
      alert("Job saved to favorites!");
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job. Please try again.");
    }
  };

  const handleApply = () => {
    setShowApplyModal(true);
    if (job?.applicationLink) {
      window.open(job.applicationLink, "_blank");
    } else {
      console.error("No application link provided");
    }
  };

  const handleConfirmApply = async () => {
    try {
      setIsApplying(true);
      await apiClient(`/application`, {
        method: "POST",
        data: { jobId },
      });
    } catch (err: any) {
      alert(
        "You have already applied to this job!\nCheck your JobApplications in your profile."
      );
    } finally {
      setIsApplying(false);
      setShowApplyModal(false);
    }
  };

  const handleATS = async () => {
    try {
      setIsFetchingATS(true);
      setAtsButtonContent("Fetching ATS score...");

      const response = await apiClient(`/jobs/ats/${jobId}`, {
        method: "GET",
      });

      setAtsButtonContent("ATS Available");
      setAtsData(response || "No ATS details available");
    } catch (error) {
      console.error("Error fetching ATS score:", error);
      alert("Failed to fetch ATS score. Please try again.");
      setAtsButtonContent("Get ATS Score");
    } finally {
      setIsFetchingATS(false);
      setAtsLoaded(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white p-6 flex items-center justify-center">
        <p className="text-xl">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white p-6 flex items-center justify-center">
        <p className="text-xl text-red-500">{error || "Job not found"}</p>
      </div>
    );
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
                <span>
                  {job.city}, {job.country}
                </span>
              </div>
            </div>
            
             { !atsLoaded ?
             ( <button
                onClick={handleATS}
                disabled={isFetchingATS}
                className="flex items-center gap-2 bg-[#8b4513] hover:bg-[#a0522d] text-white rounded-full px-4 py-2 text-sm transition-colors">
                {isFetchingATS && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {atsButtonContent}
              </button>
             ): null}
          </div>
          {atsLoaded && atsData ? (
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">ATS Score</h3>
                <span
                  className="text-3xl font-bold"
                  style={{
                    color:
                      atsData?.ats >= 70
                        ? "#4CAF50"
                        : atsData?.ats >= 50
                        ? "#FF9800"
                        : "#F44336",
                  }}>
                  {atsData?.ats}%
                </span>
              </div>
              <div>
                <p className="font-semibold mb-1">
                  CV Improvement Suggestions:
                </p>
                <p className="text-sm">{atsData?.response}</p>
              </div>
            </div>
          ) : null}
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
              {job.description ||
                "This position offers an exciting opportunity to work with a dynamic team in a growing company."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded font-medium text-white transition-colors ${
                  saved
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-800 hover:bg-gray-900"
                }`}
                onClick={handleSaveJob}>
                <BookmarkIcon className="h-5 w-5" />
                {saved ? "Saved" : "Save Job"}
              </button>
              <button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded font-medium text-white transition-colors bg-[#a52a2a] hover:bg-[#8b2323]"
                onClick={handleApply}
                disabled={isApplying}>
                {isApplying ? "Applying..." : "Apply"}
              </button>
            </div>
          </div>
        </div>
        <DidYouApplyModal
          open={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          onYes={handleConfirmApply}
        />
      </div>
    </div>
  );
}
