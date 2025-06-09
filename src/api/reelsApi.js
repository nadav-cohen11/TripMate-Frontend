import api from "./axios";

export const fetchReels = async () => {
  const { data } = await api.get("/media/getAllReels");
  return data.reels;
};

export const getReelLikes = async (reelId) => {
  try {
    const response = await api.get(`/media/${reelId}/likes`);
    return {
      count: response.data.likesCount || 0,
      userHasLiked: response.data.userHasLiked || false,
    };
  } catch (error) {
    throw error;
  }
};


export const likeReel = async (reelId) => {
  try {
    const response = await api.post(`/media/like`, { reelId });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const unLikeReel = async (reelId) => {
  try {
    const response = await api.post(`/media/unlike`, { reelId });
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const getReelComments = async (reelId) => {
  try {
    const response = await api.get(`/media/${reelId}/comments`);
    return response.data.comments;
  } catch (error) {
    throw error;
  }
};


export const addCommentToReel = async (reelId, text) => {
  try {
    const response = await api.post(`/media/comment`, { reelId, text });
    return response.data.updatedUser.comment;
  } catch (error) {
    throw error;
  }
};