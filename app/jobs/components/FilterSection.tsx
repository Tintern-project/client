const FilterSection: React.FC = () => {
  return (
    <>
      <div>
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
      </div>
      <div className="flex gap-2 px-0 py-2">
        <button className="px-4 py-1.5 h-8 text-sm text-white rounded-lg border border-white border-solid">
          Position
        </button>
        <button className="px-4 py-1.5 h-8 text-sm text-white rounded-lg border border-white border-solid">
          Cairo
        </button>
      </div>
    </>
  );
};

export default FilterSection;
