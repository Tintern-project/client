import React, { useState, useEffect } from "react";

interface FilterSectionProps {
  onResults: (jobs: any[]) => void; // Callback to pass filtered job results to the parent
}

const FilterSection: React.FC<FilterSectionProps> = ({ onResults }) => {
  // Static filters
  const staticFilters = {
    roles: ["Full-time", "Part-time", "Intern", "Volunteer"],
    types: ["On-site", "Remote", "Hybrid"],
  };

  // Dynamic filters (fetched from the API)
  const [filters, setFilters] = useState<{
    industries: string[];
    cities: string[];
  }>({
    industries: [],
    cities: [],
  });

  const [formData, setFormData] = useState({
    industry: "",
    city: "",
    role: "",
    type: "",
  }); // Store selected filters

  const [error, setError] = useState<string | null>(null);

  // Fetch dynamic filters from the API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/jobs/unique-filters");
        if (!res.ok) {
          throw new Error("Failed to fetch filters");
        }
        const data = await res.json();
        setFilters(data); // Set the dynamic filters in state
      } catch (error: any) {
        console.error("Error fetching filters:", error.message);
        setError("Failed to load filters. Please try again.");
      }
    };

    fetchFilters();
  }, []);

  // Handle chip click (toggle selection)
  const handleFilterClick = async (filterName: keyof typeof formData, value: string) => {
    const updatedFilters = {
      ...formData,
      [filterName]: formData[filterName] === value ? "" : value, // Toggle the filter
    };
    setFormData(updatedFilters);

    try {
      const res = await fetch("http://localhost:3000/api/v1/jobs/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFilters),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch jobs");
      }

      const data = await res.json();
      onResults(data); // Pass results to parent
    } catch (error: any) {
      console.error("Error fetching jobs:", error.message);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Filters Container */}
      <div className="flex gap-4">
        {/* Industries (Dynamic) */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-white">Industries</h4>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide rounded-lg py-2" style={{ maxWidth: "300px" }}>
            {filters.industries.map((industry, idx) => (
              <button
                key={idx}
                onClick={() => handleFilterClick("industry", industry)}
                className={`px-8 py-2 rounded-lg ${
                  formData.industry === industry
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-neutral-800"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        {/* Roles (Static) */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-white">Roles</h4>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide rounded-lg py-2" style={{ maxWidth: "300px" }}>
            {staticFilters.roles.map((role, idx) => (
              <button
                key={idx}
                onClick={() => handleFilterClick("role", role)}
                className={`px-8 py-2 rounded-lg ${
                  formData.role === role
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-neutral-800"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Types (Static) */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-white">Types</h4>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide rounded-lg py-2" style={{ maxWidth: "300px" }}>
            {staticFilters.types.map((type, idx) => (
              <button
                key={idx}
                onClick={() => handleFilterClick("type", type)}
                className={`px-6 py-2 rounded-lg ${
                  formData.type === type
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-neutral-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Cities (Dynamic) */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-white">Cities</h4>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide rounded-lg py-2" style={{ maxWidth: "300px" }}>
            {filters.cities.map((city, idx) => (
              <button
                key={idx}
                onClick={() => handleFilterClick("city", city)}
                className={`px-4 py-2 rounded-lg ${
                  formData.city === city
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-neutral-800"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;