import api from "/src/api/axios.js";

export const getUserTrips = async () => {
    try {
        const response = await api.get('/trips/getAllTripsForUser');
        return response.data
    } catch (error) {
        throw error
    }
};