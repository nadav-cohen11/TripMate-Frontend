import { motion } from "motion/react";  

const TypewriterText = ({ text, speed = 0.04 }) => {
  const letters = text.split("");

  const container = {
    hidden:   { opacity: 0 },
    visible:  {
      opacity: 1,
      transition: {                           
        staggerChildren: speed,
        delayChildren:   speed,
      },
    },
  };

 
  const letter = {
    hidden:  { clipPath: "inset(0 100% 0 0)" },    
    visible: { clipPath: "inset(0 0% 0 0)" },        
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className="relative inline-block whitespace-nowrap"
      aria-label={text}
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          variants={letter}
          className="inline-block"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}

      <span className="inline-block w-[1ch] bg-current animate-blink ml-0.5" />
    </motion.span>
  );
};

export default TypewriterText;
