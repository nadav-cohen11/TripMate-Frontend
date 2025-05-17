import { motion } from 'framer-motion';

const SwipeStatus = ({ swipeInfo, userId }) => {
  if (swipeInfo.id !== userId || !swipeInfo.direction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`absolute top-8 left-8 text-4xl font-bold ${swipeInfo.direction === 'left' ? 'text-red-500' : 'text-green-500'}`}
    >
      {swipeInfo.direction === 'left' ? 'NOPE' : 'LIKE'}
    </motion.div>
  );
};

export default SwipeStatus;