import { motion } from 'framer-motion';
import React from 'react';

const Typewriter = ({ text, className }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{ display: "inline-block", overflow: "hidden", whiteSpace: "nowrap" }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

export default Typewriter; 