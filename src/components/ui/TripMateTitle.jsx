import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TripMateTitle = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="absolute top-0 left-4 z-20 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => navigate('/home')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src="/assets/images/logo-no-background.png"
        alt="TripMate Logo"
        className="h-24 w-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default TripMateTitle; 