import { motion } from "framer-motion";

export const FilterSelector = ({ activeFilter, setFilter, filterIcons = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 p-1 rounded-xl bg-white/50 backdrop-blur-sm border border-[#eaf4fd] shadow-inner w-full"
    >
      {Object.entries(filterIcons).map(([label, Icon]) => {
        const isActive = activeFilter === label;
        return (
          <motion.button
            key={label}
            onClick={() => setFilter(label)}
            whileHover={{ scale: 1.03, backgroundColor: "#e0f2fe" }}
            whileTap={{ scale: 0.97 }}
            className={`
              flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg w-full
              transition-all duration-200 ease-in-out
              ${isActive 
                ? "bg-[#4a90e2] text-white shadow-md" 
                : "bg-white text-[#4a90e2] hover:bg-[#eaf4fd]"
              }
            `}
          >
            <Icon className={`text-base ${isActive ? "text-white" : "text-[#4a90e2]"}`} />
            <span className="text-xs font-medium tracking-wide text-center mt-0.5">{label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
