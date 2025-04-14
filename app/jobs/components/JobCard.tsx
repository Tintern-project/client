import React from "react";
import { useRouter } from "next/navigation";

interface JobCardProps {
  _id: string;
  title: string;
  company: string;
  role: string;
  city: string;
  country: string;
  industry: string;
  location?: string;
  onAddToFavorites?: (jobId: string) => Promise<void>;
}

const JobCard: React.FC<JobCardProps> = ({
  _id,
  title,
  company,
  country,
  city,
  location = `${city}, ${country}`,
  industry,
  role,
  onAddToFavorites,
}) => {
  const router = useRouter();

  // Create a handler for the Star button
  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the star button
    if (onAddToFavorites) {
      try {
        await onAddToFavorites(_id);
      } catch (error) {
        console.error("Error saving job:", error);
      }
    }
  };

  // Navigate to job detail page
  const navigateToJobDetail = () => {
    router.push(`/jobs/${_id}`);
  };

  return (
    <article 
      className="flex justify-between p-5 rounded-3xl transition-all cursor-pointer bg-zinc-300 duration-[0.3s] ease-[ease] h-[213px] max-sm:h-auto"
      onClick={navigateToJobDetail}
    >
      <div className="flex flex-col gap-2.5">
        <h2 className="text-sm font-bold text-black">{title} - {company}</h2>
        <p className="text-base text-black">
          {industry} - {location} - {role}
        </p>
        <div className="text-sm leading-5 text-black">
          <p className="text-sm font-bold">Click to Find More</p>
        </div>
      </div>
      <div className="flex flex-col gap-3.5 px-0 py-5 max-sm:px-0 max-sm:py-2.5">
        <button 
          className="p-3 text-base rounded-lg transition-all cursor-pointer bg-neutral-800 border-[none] duration-[0.2s] ease-[ease] text-neutral-100 w-[122px]" 
          onClick={handleSaveClick}
        >
          Star
        </button>
        <button 
          className="p-3 text-base bg-orange-800 rounded-lg transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] text-neutral-100 w-[122px]"
          onClick={(e) => {
            e.stopPropagation();
            // Apply functionality would go here
          }}
        >
          Apply
        </button>
      </div>
    </article>
  );
};

export default JobCard;