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
            }
        }
    };

    // Navigate to job detail page
    const navigateToJobDetail = () => {
        router.push(`/jobs/${_id}`);
    };

    const handleApplyClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigateToJobDetail();
    };

    return (
        <article
        className="flex flex-col sm:flex-row justify-between p-6 rounded-3xl transition-all cursor-pointer bg-zinc-300 hover:bg-zinc-200 duration-300 ease-in-out shadow-md hover:shadow-lg h-auto border-l-4 border-orange-800 w-full"            onClick={navigateToJobDetail}
        >
            <div className="flex flex-col gap-3 flex-1">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-orange-800">{industry}</span>
                    <h2 className="text-lg font-bold text-black mt-1">{title}</h2>
                    <h3 className="text-md font-medium text-neutral-700">{company}</h3>
                </div>

                <div className="flex items-center text-sm text-neutral-600 mt-1">
                    <span className="inline-block bg-zinc-400 h-1 w-1 rounded-full mr-2"></span>
                    <span>{location}</span>
                    <span className="inline-block bg-zinc-400 h-1 w-1 rounded-full mx-2"></span>
                    <span>{role}</span>
                </div>

                <div className="mt-2">
                    <p className="text-sm font-medium text-black relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-800">
                        Click to Find More
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:items-end sm:justify-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">                <button
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-all bg-orange-800 hover:bg-orange-900 text-neutral-100 w-full sm:w-32"
                    onClick={handleSaveClick}
                >
                    Star
                </button>
                <button
                    className="px-4 py-3 text-sm font-medium rounded-lg transition-all bg-neutral-800 hover:bg-neutral-900 text-neutral-100 w-full sm:w-32"
                    onClick={handleApplyClick}
                >
                    Details
                </button>
            </div>
        </article>
    );
};

export default JobCard;