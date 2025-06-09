import { motion } from "framer-motion";

export const FilterSelector = ({ activeFilter, setFilter, filterIcons = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap justify-center gap-3 mb-4"
    >
      {Object.entries(filterIcons).map(([label, Icon]) => {
        const isActive = activeFilter === label;
        return (
          <motion.button
            key={label}
            onClick={() => setFilter(label)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full 
              transition-all duration-200 ease-in-out
              ${isActive 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" 
                : "bg-white text-gray-800 hover:bg-gray-50 shadow-md hover:shadow-lg"
              }
            `}
          >
            <Icon className={`text-xl ${isActive ? "text-white" : "text-blue-600"}`} />
            <span className="text-sm font-medium">{label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
