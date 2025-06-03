import api from "./axios";

export const getUserReviews = async (userId) => {
    try {
        const response = await api.get(`reviews/userReviews/${userId}`);
        return response.data;
    } catch (error) {
        throw error
    }
};

export const publishReview = async (revieweeId, comment,rating) => {
    try {
        const response = await api.post(`reviews/createReview`, { revieweeId, comment,rating });
        return response.data;
    } catch (error) {
        throw error
    }

}