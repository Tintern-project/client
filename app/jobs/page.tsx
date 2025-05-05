"use client";
import * as React from "react";
import SearchBar from "@/app/jobs/components/SearchBar";
import FilterSection from "@/app/jobs/components/FilterSection";
import JobCard from "@/app/jobs/components/JobCard";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

function JobSearchPageList() {
  interface job {
    _id: string;
    title: string;
    company: string;
    city: string;
    country: string;
    industry: string;
    role: string;
  }

  const router = useRouter();
  const [jobListings, setJobListings] = React.useState<job[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showFilters, setShowFilters] = React.useState<boolean>(false); // mobile filter toggle

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
        setJobListings(formattedJobs);
      } catch (error: any) {
        setError(error.message || "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllJobs();
  }, []);

  const handleJobResults = (jobs: job[]) => {
    setJobListings(jobs);
  };

  const navigateToSwipeMode = () => {
    router.push("/jobs/swipe");
  };

  const handleAddToFavorites = async (jobId: string) => {
    try {
      await apiClient(`/jobs/save/${jobId}`, {
        method: "POST",
      });
      alert("Job saved to favorites!");
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job. Please try again.");
    }
  };

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <main className="w-full min-h-screen bg-neutral-800">
        <section className="px-4 pt-40 sm:px-14">
          <h1 className="mb-10 text-5xl font-medium tracking-normal leading-8 text-white max-sm:text-3xl max-sm:text-center">
            FIND YOUR NEXT JOB HERE
          </h1>

          <div className="flex gap-5 items-center max-md:flex-col max-md:items-start">
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

            <SearchBar onResults={handleJobResults} />

            <button
              onClick={navigateToSwipeMode}
              className="p-3 text-base text-rose-100 bg-orange-800 rounded-lg border border-solid border-[color:var(--sds-color-border-danger-secondary)]"
            >
              Swipe Mode
            </button>
          </div>

          {/* Toggle button for filters on small screens */}
          <div className="mt-6 md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-white bg-neutral-700 px-4 py-2 rounded-lg"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Mobile filter panel */}
          {showFilters && (
            <div className="mt-4 md:hidden bg-neutral-700 p-4 rounded-lg max-h-[70vh] overflow-y-auto">
              <FilterSection onResults={handleJobResults} />
            </div>
          )}
        </section>

        <section className="grid gap-6 px-4 py-5 md:px-20 md:grid-cols-[auto_1fr]">
          {/* Desktop filter section */}
          <div className="hidden md:block">
            <FilterSection onResults={handleJobResults} />
          </div>

          {/* Job listings */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {isLoading ? (
              <div className="text-white text-xl col-span-2">Loading jobs...</div>
            ) : error ? (
              <div className="text-red-500 text-xl col-span-2">Error: {error}</div>
            ) : jobListings && jobListings.length > 0 ? (
              jobListings.map((job) => (
                <JobCard
                  key={job._id}
                  _id={job._id}
                  title={job.title}
                  company={job.company}
                  role={job.role}
                  city={job.city}
                  country={job.country}
                  industry={job.industry}
                  onAddToFavorites={handleAddToFavorites}
                />
              ))
            ) : (
              <p className="text-white col-span-2">No jobs found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default JobSearchPageList;
