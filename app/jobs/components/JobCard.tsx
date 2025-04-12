"use client";
import { apiClient } from "@/lib/api-client";
interface JobCardProps {
  _id: string;
  title: string;
  company: string;
  location: string;
  requirements: string[];
}
const saveJob = async (jobId: string) => {
  try {
    const response = await apiClient("jobs/save/{jobId}", {
      method: "POST",
      data: { jobId },
    });

    if (response.status === 200) {
      alert("Job saved successfully!");
    } else {
      throw new Error("Failed to save job");
    }
  } catch (error: any) {
    console.log(jobId);
    console.error("Error saving job:", error.message);
    alert("Failed to save job. Please try again.");
  }
};
const JobCard: React.FC<JobCardProps> = ({
  _id,
  title,
  company,
  location,
  requirements,
}) => {
  return (
    <article className="flex justify-between p-5 rounded-3xl transition-all cursor-pointer bg-zinc-300 duration-[0.3s] ease-[ease] h-[213px] max-sm:h-auto">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-sm font-bold text-black">{title}</h2>
        <p className="text-base text-black">
          {company} - {location}
        </p>
        <div className="text-sm leading-5 text-black">
          <p className="mb-2 underline">Requirements:</p>
          <ul className="p-0 m-0">
            {requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-3.5 px-0 py-5 max-sm:px-0 max-sm:py-2.5">
        <button className="p-3 text-base rounded-lg transition-all cursor-pointer bg-neutral-800 border-[none] duration-[0.2s] ease-[ease] text-neutral-100 w-[122px]" onClick={() => saveJob(_id)}>
          Star
        </button>
        <button className="p-3 text-base bg-orange-800 rounded-lg transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] text-neutral-100 w-[122px]">
          Apply
        </button>
      </div>
    </article>
  );
};

export default JobCard;
