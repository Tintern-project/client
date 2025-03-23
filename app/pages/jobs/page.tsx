"use client";
import * as React from "react";
import SearchBar from "@/app/pages/jobs/components/SearchBar";
import FilterSection from "@/app/pages/jobs/components/FilterSection";
import JobCard from "@/app/pages/jobs/components/JobCard";

function JobSearchPageList() {
  const jobListings = [
    {
      title: "Senior DevOPs Specialist",
      company: "NTRA",
      location: "Cairo",
      requirements: ["R1", "R2", "R3", "R4"],
    },
    {
      title: "Senior DevOPs Specialist",
      company: "NTRA",
      location: "Cairo",
      requirements: ["R1", "R2", "R3", "R4"],
    },
    {
      title: "Senior DevOPs Specialist",
      company: "NTRA",
      location: "Cairo",
      requirements: ["R1", "R2", "R3", "R4"],
    },
    {
      title: "Senior DevOPs Specialist",
      company: "NTRA",
      location: "Cairo",
      requirements: ["R1", "R2", "R3", "R4"],
    },
    {
      title: "Senior DevOPs Specialist",
      company: "NTRA",
      location: "Cairo",
      requirements: ["R1", "R2", "R3", "R4"],
    },
    {
      title: "Senior DevOPs Specialist",
      company: "NTRA",
      location: "Cairo",
      requirements: ["R1", "R2", "R3", "R4"],
    },
    {
      title: "Senior DevOPs Specialist",
      company: "NTRA",
      location: "Cairo",
      requirements: ["R1", "R2", "R3", "R4"],
    },
    {
      title: "Senior DevOPs Specialist",
      company: "NTRA",
      location: "Cairo",
      requirements: ["R1", "R2", "R3", "R4"],
    },
    {
      title: "Senior DevOPs Specialist",
      company: "NTRA",
      location: "Cairo",
      requirements: ["R1", "R2", "R3", "R4"],
    },
    {
      title: "Senior DevOPs Specialist",
      company: "NTRA",
      location: "Cairo",
      requirements: ["R1", "R2", "R3", "R4"],
    },
  ];

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
            <FilterSection />
            <SearchBar />
            <button className="p-3 text-base text-rose-100 bg-orange-800 rounded-lg border border-solid border-[color:var(--sds-color-border-danger-secondary)]">
              Swipe Mode
            </button>
          </div>
        </section>
        <section className="grid gap-6 px-20 py-5 grid-cols-[repeat(2,1fr)] max-md:p-5 max-md:grid-cols-[1fr]">
          {jobListings.map((job, index) => (
            <JobCard
              key={index}
              title={job.title}
              company={job.company}
              location={job.location}
              requirements={job.requirements}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default JobSearchPageList;
