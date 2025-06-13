import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";

const ReelItem = ({ reel, children }) => {
  const navigate = useNavigate();

  const getTimeElapsed = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const uploaded = new Date(timestamp);
    const diffInSeconds = Math.floor((now - uploaded) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {reel.type === "video" ? (
        <video
          src={reel.url}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-contain"
        />
      ) : (
        <img
          src={reel.url}
          alt="reel"
          className="h-full w-full object-contain"
        />
      )}
      <div className="absolute top-4 right-4 z-10 flex items-center bg-white bg-opacity-40 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          title="Create New Reel"
          onClick={() => navigate('/photos')}
        >
          <Camera className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="absolute top-4 left-4 z-10 flex items-center bg-blue-500 bg-opacity-40 backdrop-blur-sm px-3 py-1.5 rounded-full space-x-2">
        <span className="text-white text-sm font-medium">
          {getTimeElapsed(reel.createdAt)}
        </span>
      </div>
      {children}
    </div>
  );
};

export default memo(ReelItem);
