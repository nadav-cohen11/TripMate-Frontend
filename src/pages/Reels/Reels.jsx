import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../api/axios";

const fetchReels = async () => {
  const { data } = await api.get("/media/getAllReels");
  return data.reels;
};

export default function InstagramGridUI() {
  const { data: reels, isLoading, error } = useQuery({
    queryKey: ["reels"],
    queryFn: fetchReels,
  });

  const [selectedReel, setSelectedReel] = useState(null);
  const [durations, setDurations] = useState({});
  const videoRefs = useRef({});

  const handleLoadedMetadata = (e, id) => {
    const duration = e.currentTarget.duration;
    setDurations((prev) => ({ ...prev, [id]: duration }));
  };

  const formatDuration = (sec = 0) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return <div className="text-white p-10 text-center">Loading reels...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-10 text-center">Failed to load reels.</div>;
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-200 overflow-hidden">
      <div className="absolute top-6 left-6 text-4xl text-black font-bold z-20 tracking-wide" style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 140 }}>
        TripMate
      </div>
      {reels?.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reels.map((reel, idx) => (
              <div key={reel.public_id || reel.url || idx} className="relative group">
                <video
                  ref={(el) => (videoRefs.current[reel.public_id] = el)}
                  src={reel.url}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  className="rounded-lg w-full aspect-video bg-black cursor-pointer"
                  poster={reel.url?.replace("/upload/", "/upload/so_1/").replace(".mp4", ".jpg")}
                  onLoadedMetadata={(e) => handleLoadedMetadata(e, reel.public_id)}
                  onClick={() => setSelectedReel(reel)}
                  crossOrigin="anonymous"
                />
                {durations[reel.public_id] && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-xs px-2 py-1 rounded text-white">
                    {formatDuration(durations[reel.public_id])}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <AnimatePresence>
        {selectedReel && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReel(null)}
          >
            <motion.div
              className="relative bg-black rounded-lg p-2 max-w-3xl w-full aspect-video"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selectedReel.url}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              />
              <button
                onClick={() => setSelectedReel(null)}
                className="absolute top-2 right-2 text-white hover:text-red-500"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
