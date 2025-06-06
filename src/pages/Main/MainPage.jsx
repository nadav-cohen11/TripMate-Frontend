import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200">
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute z-30 flex flex-col items-center"
        >
          <h1 className="text-5xl font-bold text-[#2575FC] tracking-wide" style={{ fontFamily: "'Raleway', sans-serif" }}>
            TripMate
          </h1>

          <motion.div className="w-full mt-4">
            {[500, 400, 300].map((shade, index) => (
              <motion.div
                key={index}
                className={`line h-1 bg-blue-${shade} mb-4 rounded-full`}
                initial={{ width: "0%", opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ duration: 1.5, delay: index * 0.2, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ clipPath: "inset(0% 50% 0% 50%)", backgroundColor: "#A0C4FF" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", backgroundColor: "transparent" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-b from-[#A0C4FF] to-[#D2E8FF] z-20"
        />
      </div>
    </div>
  );
};

export default LoadingPage;