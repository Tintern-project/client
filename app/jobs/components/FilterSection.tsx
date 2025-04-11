import React, { useState, useEffect } from "react";


  interface FilterSectionProps {
    onResults: (jobs: any[]) => void; }
  
  const FilterSection: React.FC<FilterSectionProps> = ({ onResults }) => {
    const [formData, setFormData] = useState({
      location: "",
      role: "",
    });
  
        const handleFilterClick = async (filterName: keyof typeof formData, value: string) => {
        const updatedFilters = {
        ...formData,
        [filterName]: formData[filterName] === value ? "" : value,
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
        console.error("Error fetching jobs:", error);
      }
    };

    return (
      <div>
        <div className="flex gap-2 mb-4">
          {["Cairo", "Berlin", "Dubai"].map((loc, idx) => (
            <button
              key={idx}
              onClick={() => handleFilterClick("location", loc)}
              className={`px-4 py-2 rounded-lg ${
                formData.location === loc ? "bg-blue-600 text-white" : "bg-white border border-gray-300"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    );
  };


export default FilterSection;