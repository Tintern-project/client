import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";

interface FilterSectionProps {
  onResults: (jobs: any[]) => void; // Callback to pass filtered job results to the parent
}

const FilterSection: React.FC<FilterSectionProps> = ({ onResults }) => {
  const { showToast } = useToast();
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
        const res = await fetch(
          "https://tintern-server.fly.dev/api/v1/jobs/unique-filters"
        );
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
  const handleFilterClick = async (
    filterName: keyof typeof formData,
    value: string
  ) => {
    const updatedFilters = {
      ...formData,
      [filterName]: formData[filterName] === value ? "" : value, // Toggle the filter
    };
    setFormData(updatedFilters);

    try {
      const res = await fetch(
        "https://tintern-server.fly.dev/api/v1/jobs/filter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFilters),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch jobs");
      }

      const data = await res.json();
      onResults(data); // Pass results to parent
      showToast("Jobs filtered successfully!", "success");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to filter jobs";
      showToast(errorMessage, "error");
      console.error("Error fetching jobs:", error.message);
    }
  };

  return (
    <div className="flex flex-col w-full sm:w-45 space-y-6 p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {/* Filters Container */}
      <div className="flex flex-col space-y-6">
        {/* Industries (Dynamic) */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-white">Industries</h4>
          <select
            value={formData.industry}
            onChange={(e) => handleFilterClick("industry", e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-neutral-800"
          >
            <option value="">All Industries</option>
            {filters.industries.map((industry, idx) => (
              <option key={idx} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Roles (Static) */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-white">Roles</h4>
          <select
            value={formData.role}
            onChange={(e) => handleFilterClick("role", e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-neutral-800"
          >
            <option value="">All Roles</option>
            {staticFilters.roles.map((role, idx) => (
              <option key={idx} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Types (Static) */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-white">Types</h4>
          <select
            value={formData.type}
            onChange={(e) => handleFilterClick("type", e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-neutral-800"
          >
            <option value="">All Types</option>
            {staticFilters.types.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Cities (Dynamic) */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2 text-white">Cities</h4>
          <select
            value={formData.city}
            onChange={(e) => handleFilterClick("city", e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-neutral-800"
          >
            <option value="">All Cities</option>
            {filters.cities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
