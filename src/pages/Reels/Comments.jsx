import { useState, memo } from "react";
import { addCommentToReel } from "../../api/reelsApi";
import { toast } from "react-toastify";
import { extractBackendError } from "@/utils/errorUtils";

const Comments = ({ reel }) => {
  const [comments, setComments] = useState(reel.comments || []);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await addCommentToReel(reel._id, newComment);
      setComments((prev) => [res, ...prev]);
      setNewComment("");
    } catch (error) {
      toast.error(extractBackendError(error));
    }
  };

  return (
    <div className="w-full mt-2 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-md">
      <div className="max-h-32 overflow-y-auto space-y-2 text-white text-sm pr-2 custom-scroll">
        {comments.map((comment, idx) => (
          <p key={idx} className="break-words">
            <strong>{comment.userFullName || "User"}:</strong> {comment.text}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          className="flex-1 bg-white/10 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#4a90e2]/50"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          onClick={handleAddComment}
          className="text-[#4a90e2] font-semibold hover:text-[#4a90e2]/80 transition-colors"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default memo(Comments);
