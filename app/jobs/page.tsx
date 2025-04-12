"use client";
import * as React from "react";
import SearchBar from "@/app/jobs/components/SearchBar";
import FilterSection from "@/app/jobs/components/FilterSection";
import JobCard from "@/app/jobs/components/JobCard";
import { apiClient } from "@/lib/api-client"; // Import the apiClient

function JobSearchPageList() {
  interface job {
    _id: string;
    title: string;
    company: string;
    location: string;
    industry: string;
    role: string;
    requirements?: string[]; 
  }

  const [jobListings, setJobListings] = React.useState<job[]>([]); // State to hold job listings
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // State to manage loading state

  React.useEffect(() => {
    const fetchAllJobs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use apiClient to fetch jobs
        const data = await apiClient("/jobs");
        const formattedJobs = data.map((job: any) => ({
          ...job,
          // Use id if it exists, otherwise use _id (MongoDB format)
          id: job.id || job._id
        }))
        setJobListings(formattedJobs); // Update job listings state
        console.log(formattedJobs);
      } catch (error: any) {
        setError(error.message || "Failed to fetch jobs");
        console.error("Error fetching all jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllJobs();
  }, []);

  const handleJobResults = (jobs: job[]) => {
    setJobListings(jobs);
  };

    

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <main className="w-full min-h-screen bg-neutral-800">
        <section className="px-14 pt-40">
          <h1 className="mb-10 text-5xl font-medium tracking-normal leading-8 text-white max-sm:text-3xl max-sm:text-center">
            FIND YOUR NEXT JOB HERE
          </h1>
          <div className="flex gap-5 items-center max-md:flex-col max-md:items-start max-sm:px-2.5 max-sm:py-0">
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

            <FilterSection onResults={handleJobResults} /> {/* Pass callback to FilterSection */}
            <SearchBar onResults={handleJobResults} /> {/* Pass callback to SearchBar */}
            <button className="p-3 text-base text-rose-100 bg-orange-800 rounded-lg border border-solid border-[color:var(--sds-color-border-danger-secondary)]">
              Swipe Mode
            </button>
          </div>
        </section>
        <section className="grid gap-6 px-20 py-5 grid-cols-[repeat(2,1fr)] max-md:p-5 max-md:grid-cols-[1fr]">
          {jobListings && jobListings.length > 0 ? (
            jobListings.map((job) => (
              <JobCard
                key={job._id}
                _id={job._id}
                title={job.title}
                company={job.company}
                location={job.location}
                requirements={job.requirements || []} // Provide a default value if `requirements` is undefined
              />
            ))
          ) : (
            <p className="text-white">No jobs found.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default JobSearchPageList;

