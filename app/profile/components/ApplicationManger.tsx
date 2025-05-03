"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/profile/components/ui/button";
import { apiClient } from "@/lib/api-client"; // Import the apiClient
import Popup from "./ui/popup";

export interface Application {
    id?: string;
    jobId: string;
    status: string;
    createdAt: string;
    jobTitle?: string;
    company?: string;
}

interface ApplicationsManagerProps {
    applications: Application[];
    setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
    onFetchComplete?: () => void;
    autoFetch?: boolean;
}

const ApplicationsManager = ({
    applications,
    setApplications,
    onFetchComplete,
    autoFetch = true
}: ApplicationsManagerProps) => {
    const [showApplicationsPopup, setShowApplicationsPopup] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchApplications = async () => {
        try {
            const response = await apiClient('/application');
            const rawData = response.data || response;
            const applicationsArray = Array.isArray(rawData) ? rawData : [];

            // For each application, fetch the job details
            const applicationsWithJobDetails = await Promise.all(
                applicationsArray.map(async (app) => {
                    try {
                        // Fetch job details using the jobId
                        const jobResponse = await apiClient(`/jobs/${app.jobId}`);
                        const jobData = jobResponse.data || jobResponse;

                        // Merge application with job details
                        return {
                            ...app,
                            jobTitle: jobData.title || 'Unknown Job',
                            company: jobData.company || 'Unknown Company'
                        };
                    } catch (err) {
                        console.error(`Failed to fetch details for job ${app.jobId}:`, err);
                        // Return application with placeholder values
                        return {
                            ...app,
                            jobTitle: 'Job details unavailable',
                            company: 'N/A'
                        };
                    }
                })
            );
            setApplications(applicationsWithJobDetails);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch applications. Please try again.');
            console.error('Application fetch error:', err);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchApplications();
        }
    }, [autoFetch]);

    const ApplicationListItem = ({ application }: { application: Application }) => (
        <div className="p-5 border-2 border-gray-100 rounded-xl bg-white transition-all duration-200 hover:border-red-50 hover:shadow-md group-hover:opacity-90 group-hover:hover:opacity-100">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{application.jobTitle}</h4>
                    <p className="text-gray-700 font-medium">
                        {application.company}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${application.status.toLowerCase() === 'pending'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                    {application.status}
                </span>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 font-medium">
                        J_ID: {application.jobId?.slice(0, 6)}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="mt-2 mb-5">
                <button
                    type="button"
                    onClick={() => {
                        fetchApplications();
                        setShowApplicationsPopup(true);
                    }}
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-all duration-200 underline underline-offset-4 decoration-1 hover:decoration-2"
                    disabled={isLoading}
                >
                    {isLoading ? "Loading applications..." : "View job applications"}
                </button>
            </div>

            <Popup
                isOpen={showApplicationsPopup}
                onClose={() => setShowApplicationsPopup(false)}
                title="Applied Applications"
            >
                <div className="space-y-4 px-1">
                    {applications.length === 0 ? (
                        <div className="py-6 text-center">
                            <p className="text-gray-500 text-lg font-medium">No applications yet</p>
                            <p className="text-gray-400 mt-1 text-sm">Applications will appear here when you apply to jobs</p>
                        </div>
                    ) : (
                        applications.map((application, index) => (
                            <div
                                key={index}
                                className="group transition-all duration-150"
                            >
                                <ApplicationListItem application={application} />
                            </div>
                        ))
                    )}
                </div>
            </Popup>

            {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md">
                    <p className="text-red-600 text-xs font-medium">{error}</p>
                </div>
            )}
        </>
    );
};

// Export the component
export default ApplicationsManager;

// Also export the component itself so it can be used directly if needed
export { ApplicationsManager };