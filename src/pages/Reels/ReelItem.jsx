import { memo } from "react";
import { useNavigate } from "react-router-dom";

const ReelItem = ({ reel, children }) => {
  const navigate = useNavigate(); 

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
      <div className="absolute top-4 right-4 z-10 flex items-center bg-black bg-opacity-40 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-white text-black text-xl font-bold focus:outline-none focus:ring-2"
          title="Add Reel"
          onClick={() => navigate('/photos')}
        >
          +
        </button>
      </div>
      <div className="absolute top-4 left-4 z-10 flex items-center bg-black bg-opacity-40 backdrop-blur-sm px-3 py-1.5 rounded-full space-x-2">
        {reel.userProfilePhotoUrl ? (
          <img
            src={reel.userProfilePhotoUrl}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border border-white"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-300 border border-white" />
        )}
        <a href={`/profile/${reel.userId}`} className="text-white font-semibold text-sm truncate max-w-[10rem]">
          {reel.userFullName}
        </a>
      </div>
      {children}
    </div>
  );
};

export default memo(ReelItem);
