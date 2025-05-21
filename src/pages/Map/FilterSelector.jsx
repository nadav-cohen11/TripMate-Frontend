import { FILTER_ICONS } from "@/constants/filters";

export const FilterSelector = ({ activeFilter, setFilter }) => (
  <div className="flex flex-wrap gap-3 mb-4">
    {Object.entries(FILTER_ICONS).map(([label, Icon]) => (
      <button
        key={label}
        onClick={() => setFilter(label)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow transition
          ${activeFilter === label ? "bg-indigo-600 text-white" : "bg-white text-gray-800 hover:bg-gray-100"}`}
      >
        <Icon />
        <span className="text-sm font-medium">{label}</span>
      </button>
    ))}
  </div>
);
