export const HomeFilterSelector = ({
  setFilter,
  filters = [],
  filter
}) => {

  return (
    <div className="flex flex-wrap gap-6 justify-center text-center">
      {filters && Object.entries(filters).map(([filterName, filterArray]) => (
        <div key={filterName} className="flex flex-col min-w-[180px]">
          <h4 className="mb-2 text-lg font-semibold text-gray-700">{filterName}</h4>
          <select
            className="px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={filter[filterName]?.query || ''}
            onChange={e => {
              const selected = filterArray.find(f => f.query === e.target.value);
                setFilter(prev => ({
                ...prev,
                [filterName]: selected || { query: '', label: '' }
                }));
            }}
          >
            <option value="">Select {filterName}</option>
            {filterArray.map((f, idx) => (
              <option key={idx} value={f.query}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
