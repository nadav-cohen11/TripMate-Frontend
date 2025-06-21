import { motion } from "framer-motion";

export const FilterSelector = ({ activeFilter, setFilter, filterIcons = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-1 mb-4 overflow-y-auto max-h-48 p-1 rounded-xl border border-gray-200 shadow-inner max-w-xs mx-auto"
    >
      {Object.entries(filterIcons).map(([label, Icon]) => {
        const isActive = activeFilter === label;
        return (
          <motion.button
            key={label}
            onClick={() => setFilter(label)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`
              flex items-center justify-center gap-1 px-2 py-1 rounded-xl w-full
              transition-all duration-200 ease-in-out shadow-sm
              ${
                isActive
                  ? 'bg-[#00BFFF] text-white border border-[#00BFFF] shadow-lg'
                  : 'bg-white text-[#00BFFF] border border-gray-300 hover:bg-[#eaf4fd] hover:text-[#4a90e2]'
              }
            `}
          >
            <Icon
              className={`text-base ${
                isActive ? 'text-white' : 'text-[#00BFFF]'
              }`}
            />
            <span className='text-xs font-semibold tracking-wide'>{label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
