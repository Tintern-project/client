import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";

interface SearchBarProps {
  onResults: (jobs: any[]) => void; // Callback to pass search results to the parent
}

const SearchBar: React.FC<SearchBarProps> = ({ onResults }) => {
  const { showToast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/v1/jobs/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }), // Send only the keyword
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch jobs");
      }

      const data = await res.json();
      onResults(data); // Pass results to parent
      showToast("Search results loaded!", "success");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch jobs";
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(); // Trigger search on Enter key press
    }
  };

  return (
    <div className="flex items-center px-4 py-1 h-14 rounded-3xl bg-neutral-100 w-[618px] max-md:w-full">
      <input
        type="text"
        placeholder="Search For Jobs..."
        className="flex-1 text-base border-[none] text-neutral-800 bg-transparent outline-none"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button aria-label="Search" onClick={handleSearchSubmit} disabled={isLoading}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="search-icon"
        >
          <path
            d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
            fill="#212121"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;