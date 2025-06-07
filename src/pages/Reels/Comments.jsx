
import { useEffect, useState, memo, useCallback } from "react";
import { getReelComments, addCommentToReel } from "../../api/reelsApi";
import { toast } from "react-toastify";
import { extractBackendError } from "@/utils/errorUtils";
import { Link } from "react-router-dom"; 
const Comments = ({ reelId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const data = await getReelComments(reelId);
      setComments(data);
    } catch (error) {
      toast.error(extractBackendError(error));
    }
  }, [reelId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await addCommentToReel(reelId, newComment);
      setComments((prev) => [res, ...prev]);
      setNewComment("");
    } catch (error) {
      toast.error(extractBackendError(error));
    }
  };


const renderCommentText = (text) => {
  const urlRegex = /(http:\/\/localhost:5173\/profile\/[a-zA-Z0-9]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, idx) => {
    if (urlRegex.test(part)) {
      const userId = part.split("/profile/")[1];
      return (
        <Link
          key={idx}
          to={`/profile/${userId}`}
          className="text-blue-400 hover:underline"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
};
  return (
    <div className="w-full mt-2 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-md">
      <div className="max-h-32 overflow-y-auto space-y-2 text-white text-sm pr-2 custom-scroll">
        {comments.map((comment, idx) => (
          <p key={idx} className="break-words">
            <strong>{comment.userId.fullName}:</strong> {renderCommentText(comment.text)}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          className="flex-1 bg-white/10 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          onClick={handleAddComment}
          className="text-blue-400 font-semibold hover:underline"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default memo(Comments);