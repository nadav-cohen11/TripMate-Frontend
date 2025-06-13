import { motion } from "framer-motion";

export const RadiusSlider = ({ radius, setRadius }) => {
  return (
    <motion.div
      className="p-2 bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-[#eaf4fd] w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <label htmlFor="radius" className="block text-[#4a90e2] font-semibold mb-1 text-center">
        <span className="text-xs font-bold">Search Radius:</span> <span className="text-xs font-semibold tracking-wide">{radius} meters</span>
      </label>
      <motion.input
        type="range"
        min="100"
        max="2000"
        step="100"
        value={radius}
        onChange={(e) => setRadius(parseInt(e.target.value))}
        className="w-full h-2 rounded-full bg-[#d2eafd] appearance-none cursor-pointer accent-[#4a90e2]"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      />
      <div className="text-center text-xs text-gray-600 mt-1 italic">
        Adjust to expand or narrow search area
      </div>
    </motion.div>
  );
};
