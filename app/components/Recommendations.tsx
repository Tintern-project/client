"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import {
  BookmarkIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { DidYouApplyModal } from "../jobs/components/DidYouApplyModal";
import { useToast } from "../context/ToastContext";

export default function Recommendations() {
  const [jobListings, setJobListings] = React.useState<Record<string, any>[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedJob, setSelectedJob] = React.useState<Record<
    string,
    any
  > | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalLoading, setModalLoading] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);
  const [savedJobs, setSavedJobs] = React.useState<Set<string>>(new Set());
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const [currentJobId, setCurrentJobId] = React.useState<string | null>(null);
  const [isApplying, setIsApplying] = React.useState(false);
  const { showToast } = useToast();

  React.useEffect(() => {
    const fetchAllJobs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiClient("/jobs");
        const formattedJobs = data.map((job: any) => ({
          ...job,
          id: job.id || job._id,
        }));
        console.log(formattedJobs);
        setJobListings(formattedJobs);
      } catch (error: any) {
        setError(error.message || "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllJobs();
  }, []);

  const openJobModal = async (jobId: string) => {
    try {
      setModalLoading(true);
      setModalError(null);
      const data = await apiClient(`/jobs/${jobId}`);
      // Ensure the job ID is included with the selected job data
      setSelectedJob({ ...data, id: jobId });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching job details:", error);
      setModalError("Failed to load job details");
    } finally {
      setModalLoading(false);
    }
  };

  const handleApply = (applicationLink: string, jobId: string) => {
    if (applicationLink) {
      // Store the current job ID for later use when submitting the application
      setCurrentJobId(jobId);
      console.log(jobId);
      // Open the application link in a new tab
      window.open(applicationLink, "_blank");

      // Close the job details modal before showing the apply modal
      setIsModalOpen(false);

      // Show the "Did you apply?" modal after a short delay
      setTimeout(() => {
        setShowApplyModal(true);
      }, 100);
    } else {
      console.error("No application link provided");
      alert("Application link not available");
    }
  };

  const handleApplicationSubmit = async () => {
    if (currentJobId) {
      try {
        setIsApplying(true);
        // Submit the application to the database
        await apiClient("/application", {
          data: { jobId: currentJobId },
        });

        // Close the apply modal
        setShowApplyModal(false);

        // Show success message with toast
        showToast("Successfully applied to job!", "success");
      } catch (err: any) {
        showToast(
          err.message ||
            "You have already applied to this job! Check your JobApplications in your profile.",
          "error"
        );
        setShowApplyModal(false);
      } finally {
        setIsApplying(false);
      }
    }
  };

  const recommendedJobs = jobListings.slice(0, 3);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-10">
      {/* Left Image */}
      <div className="w-full lg:w-1/2 max-w-md">
        <Image
          src="/cardaside.jpg"
          alt="Card Aside Visual"
          width={500}
          height={600}
          className="rounded-xl object-cover w-full h-auto"
        />
      </div>

      {/* Right Job Cards */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 max-w-2xl">
        {isLoading && <p className="text-white text-center">Loading jobs...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!isLoading &&
          !error &&
          recommendedJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => openJobModal(job.id)}
              className="feature-card bg-[#1E1E1E] rounded-xl overflow-hidden flex flex-col justify-end p-6 text-white shadow-lg cursor-pointer hover:bg-[#2A2A2A] transition"
            >
              <p className="text-xl font-semibold mb-2">{job.title}</p>
              <p className="text-sm text-[#F5F5F5]/80">{job.company}</p>
              <p className="text-sm text-[#F5F5F5]/80">
                {job.city}, {job.country}
              </p>
              <p className="text-sm mt-2 text-[#F5F5F5]/60 line-clamp-2">
                {job.description}
              </p>
            </div>
          ))}

        {/* CTA Card */}
        <div className="feature-card bg-[#BA1B1B] rounded-xl justify-center p-7 flex flex-col items-center text-white shadow-lg">
          <p className="text-2xl font-bold mb-4">Want to see more jobs?</p>
          <Link
            href="/jobs"
            className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            See More
          </Link>
        </div>
      </div>

      {/* Job Detail Modal */}
      <Dialog
        open={isModalOpen && !showApplyModal}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <Dialog.Panel className="bg-white text-black max-w-2xl w-full p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
          {modalLoading && (
            <p className="text-center py-4">Loading job details...</p>
          )}
          {modalError && (
            <p className="text-red-500 text-center py-4">{modalError}</p>
          )}

          {selectedJob && !modalLoading && !modalError && (
            <>
              <Dialog.Title className="text-2xl font-bold mb-2">
                {selectedJob.title}
              </Dialog.Title>
              <div className="flex items-center text-gray-700 mb-1">
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                <span>{selectedJob.company}</span>
              </div>
              <div className="flex items-center text-gray-700 mb-4">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span>
                  {selectedJob.city}, {selectedJob.country}
                </span>
              </div>

              <div className="bg-[#8b4513] text-white rounded-full px-4 py-1 text-sm w-fit mb-4">
                <div className="font-bold">
                  {selectedJob.matchScore || "85"}% Match
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="font-bold mb-2 text-lg">Job Details</h2>
                  <div className="flex items-center mb-2">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span>{selectedJob.role || "Full-time"}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <ClockIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span>Posted {selectedJob.postedDate || "2 days ago"}</span>
                  </div>
                </div>
                <div>
                  <h2 className="font-bold mb-2 text-lg">Industry</h2>
                  <p>{selectedJob.industry || "Technology"}</p>
                </div>
              </div>

              <h2 className="font-bold mb-3 text-lg">Requirements:</h2>
              <ul className="list-disc pl-5 mb-6 space-y-1">
                {(Array.isArray(selectedJob.requirements)
                  ? selectedJob.requirements
                  : [
                      selectedJob.requirements ||
                        "No specific requirements listed",
                    ]
                ).map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>

              <h2 className="font-bold mb-3 text-lg">Job Description</h2>
              <p className="mb-6">{selectedJob.description}</p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    handleApply(
                      selectedJob.applicationLink || selectedJob.applyUrl,
                      selectedJob.id
                    )
                  }
                  className="px-4 py-2 bg-[#BA1B1B] text-white rounded-lg hover:bg-[#a11818]"
                >
                  Apply
                </button>
              </div>
            </>
          )}
        </Dialog.Panel>
      </Dialog>

      {/* Did You Apply Modal */}
      <DidYouApplyModal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onYes={handleApplicationSubmit}
        isLoading={isApplying}
      />
    </div>
  );
}
