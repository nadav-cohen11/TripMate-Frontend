import { memo } from "react";

const ReelItem = ({ reel, children }) => (
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
      <span className="text-white font-semibold text-sm truncate max-w-[10rem]">
        {reel.userFullName}
      </span>
    </div>

    {children}
  </div>
);

export default memo(ReelItem);
