import { motion } from "framer-motion";

export const RadiusSlider = ({ radius, setRadius }) => {
  return (
    <motion.div
      className='mb-6 p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-[#00BFFF]/10 max-w-md mx-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label
        htmlFor='radius'
        className='block text-gray-700 font-semibold mb-2 text-center'
      >
        <span className='text-base font-bold text-[#00BFFF]'>
          Search Radius:
        </span>{' '}
        <span className='text-base text-[#00BFFF] font-semibold tracking-wide'>
          {radius} meters
        </span>
      </label>
      <motion.input
        type='range'
        min='100'
        max='2000'
        step='100'
        value={radius}
        onChange={(e) => setRadius(parseInt(e.target.value))}
        className='w-full h-2 rounded-full bg-[#d2eafd] appearance-none cursor-pointer accent-[#00BFFF]'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      />
      <div className='text-center text-xs text-gray-500 mt-1 italic'>
        Adjust to expand or narrow search area
      </div>
    </motion.div>
  );
};
