export const FilterSelector = ({ activeFilter, setFilter, filterIcons = [] }) => {
  return (

    <div className="flex flex-wrap gap-3 mb-4">
      {Object.entries(filterIcons).map(([label, Icon]) => {
        const isActive = activeFilter === label;
        return (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow transition

              ${isActive ? "bg-indigo-600 text-white" : "bg-white text-gray-800 hover:bg-gray-100"}`}
          >
            <Icon />
            <span className="text-sm font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
