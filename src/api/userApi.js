import api from "/src/api/axios.js";

export const login = async (email, password,location) => {
    try {
        const response = await api.post("/users/login", { email, password, location });
        return response.data.id;
    } catch (error) {
        throw error
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post("/users/register", userData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUser = async () => {
    try {
        const response = await api.get(`/users/getUser`);
        return response.data
    } catch (error) {
        throw error
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await api.put("/users/updateUser", { userData });
        return response.data
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete("/users/deleteUser", { data: { userId } });
        return response.data
    } catch (error) {
        throw error;
    }
};

export const getUserLocation = async () => {
    try {
        const response = await api.get('/users/location');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUsersLocations = async () => {
    try {
        const response = await api.get('/users/usersLocations');
        return response.data;
    } catch (error) {
        throw error;
    }
}