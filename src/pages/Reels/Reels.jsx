import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchReels } from "../../api/reelsApi";
import ReelItem from "./ReelItem";
import Likes from "./Likes";
import Comments from "./Comments";

const Reels = () => {
  const {
    data: reels = [],
    isLoading,
    error,
  } = useQuery({ queryKey: ["reels"], queryFn: fetchReels });

  const [index, setIndex] = useState(0);

  const paginate = useCallback(
    (direction) => {
      setIndex((prev) => {
        const next = prev + direction;
        return next < 0 || next >= reels.length ? prev : next;
      });
    },
    [reels.length]
  );

  if (isLoading) {
    return <div className="text-white text-center p-10">Loading reels...</div>;
  }

  if (error) {
    return <div className="text-white text-center p-10">Error loading reels</div>;
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative touch-none bg-black">
      <motion.div
        className="h-full w-full"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y > 100 || velocity.y > 500) paginate(-1);
          else if (offset.y < -100 || velocity.y < -500) paginate(1);
        }}
      >
        <motion.div
          className="flex flex-col transition-transform duration-500 ease-out"
          animate={{ y: `-${index * 100}vh` }}
        >
          {reels.map((reel, i) => (
            <div
              key={reel._id || i}
              className="h-screen w-screen flex-shrink-0 relative"
            >
              <ReelItem reel={reel}>
                <div className="absolute bottom-24 z-10 space-y-4 w-full px-4">
                  <Likes reel={reel} />
                  <Comments reel={reel} />

                </div>
              </ReelItem>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Reels;