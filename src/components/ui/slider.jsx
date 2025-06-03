import { motion } from "framer-motion";

export const RadiusSlider = ({ radius, setRadius }) => {
  return (
    <motion.div
      className="mb-6 p-4 bg-white rounded-xl shadow-md max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label htmlFor="radius" className="block text-gray-700 font-semibold mb-2 text-center">
        Search Radius: <span className="text-blue-600">{radius} meters</span>
      </label>
      <motion.input
        type="range"
        min="100"
        max="2000"
        step="100"
        value={radius}
        onChange={(e) => setRadius(parseInt(e.target.value))}
        className="w-full accent-blue-600"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      />
      <div className="text-center text-xs text-gray-500 mt-1">
        Adjust to expand or narrow search area
      </div>
    </motion.div>
  );
};
