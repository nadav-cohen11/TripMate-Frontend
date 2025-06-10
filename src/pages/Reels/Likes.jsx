import { useState, useEffect, memo } from "react";
import { Heart } from "lucide-react";
import { getReelLikes, likeReel, unLikeReel } from "../../api/reelsApi";
import { toast } from "react-toastify";
import { extractBackendError } from "@/utils/errorUtils";

const Likes = ({ reelId, reel }) => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await getReelLikes(reelId);
        if (response) {
          const { count = 0, userHasLiked = false } = response;
          setLikes(count);
          setHasLiked(userHasLiked);
        } else {
          throw new Error("Invalid response from getReelLikes");
        }
      } catch (error) {
        toast.error("Failed to fetch likes");
      }
    };

    fetchLikes();
  }, [reelId]);

  const handleLike = async () => {
    try {
      if (hasLiked) {
        await unLikeReel(reelId);
        setLikes((prev) => Math.max(prev - 1, 0));
        setHasLiked(false);
      } else {
        await likeReel(reelId);
        setLikes((prev) => prev + 1);
        setHasLiked(true);
      }
    } catch (error) {
      toast.error(extractBackendError(error) || "Failed to update like status");
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur bg-white/10">
        {reel?.userProfilePhotoUrl ? (
          <img
            src={reel.userProfilePhotoUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-white"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 border border-white" />
        )}
        <a href={`/profile/${reel?.userId}`} className="text-white font-semibold text-sm truncate max-w-[10rem]">
          {reel?.userFullName}
        </a>
      </div>
      <button
        onClick={handleLike}
        className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur bg-white/10 hover:bg-white/20 transition"
        aria-label="Like reel"
      >
        <Heart
          className="w-5 h-5"
          color={hasLiked ? "#FF0000" : "rgba(255,255,255,0.7)"}
          fill={hasLiked ? "#FF0000" : "none"}
        />
        <span className="text-sm text-white font-medium">{likes}</span>
      </button>
    </div>
  );
};

export default memo(Likes);