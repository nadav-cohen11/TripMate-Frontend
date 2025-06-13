import { useEffect, useState, memo, useCallback } from "react";
import { getReelComments, addCommentToReel } from "../../api/reelsApi";
import { toast } from "react-toastify";
import { extractBackendError } from "@/utils/errorUtils";

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

  return (
    <div className="w-full mt-2 bg-blue-100/30 rounded-xl px-4 py-3 backdrop-blur-md">
      <div className="max-h-32 overflow-y-auto space-y-2 text-blue-800 text-sm pr-2 custom-scroll">
        {comments.map((comment, idx) => (
          <p key={idx} className="break-words">
            <strong>{comment.userId.fullName}:</strong> {comment.text}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          className="flex-1 bg-blue-200/50 text-blue-900 text-sm rounded-lg px-3 py-2 placeholder-blue-400 outline-none focus:ring-2 focus:ring-blue-600"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          onClick={handleAddComment}
          className="text-blue-600 font-semibold hover:text-blue-800"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default memo(Comments);