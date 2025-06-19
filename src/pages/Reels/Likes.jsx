import { useState, useMemo, memo } from "react";
import { Heart } from "lucide-react";
import { likeReel, unLikeReel } from "../../api/reelsApi";
import { toast } from "react-toastify";
import { extractBackendError } from "@/utils/errorUtils";

const Likes = ({ reel }) => {
  const [likesCount, setLikesCount] = useState(reel.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async () => {
    try {
      if (hasLiked) {
        await unLikeReel(reel._id);
        setLikesCount((prev) => Math.max(prev - 1, 0));
        setHasLiked(false);
      } else {
        await likeReel(reel._id);
        setLikesCount((prev) => prev + 1);
        setHasLiked(true);
      }
    } catch (error) {
      toast.error(extractBackendError(error) || "Failed to update like status");
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={handleLike}
        className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur bg-white/10 hover:bg-white/20 transition"
        aria-label="Like reel"
      >
        <Heart
          className="w-5 h-5"
          color={hasLiked ? "#FF0000" : "#4a90e2"}
          fill={hasLiked ? "#FF0000" : "none"}
        />
        <span className="text-sm text-white font-medium">{likesCount}</span>
      </button>
    </div>
  );
};

export default memo(Likes);
