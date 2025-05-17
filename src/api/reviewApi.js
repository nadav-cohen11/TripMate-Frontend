import api from "./axios";

export const getUserReviews = async (userId) => {
    try {
        const response = await api.get(`reviews/userReviews/${userId}`);
        return response.data;
    } catch (error) {
        throw error
    }
};