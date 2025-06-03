import api from "./axios";

export const fetchReels = async () => {
  const { data } = await api.get("/media/getAllReels");
  return data.reels;
};

export const getReelLikes = async (reelId) => {
  const res = await api.get(`/media/${reelId}/likes`);
  return res.data.totalLikes;
};

export const likeReel = async (reelId) => {
  await api.post("/media/like", { reelId });
};

export const getReelComments = async (reelId) => {
  const res = await api.get(`/media/${reelId}/comments`);
  return res.data.comments;
};

export const addCommentToReel = async (reelId, text) => {
  const res = await api.post("/media/comment", { reelId, text });
  return res.data.updatedUser.comment;
};

export const unLikeReel = async (reelId) => {
  await api.post("/media/unlike", { reelId });
};