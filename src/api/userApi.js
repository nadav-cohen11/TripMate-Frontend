import api from "/src/api/axios.js";

export const login = async (email, password) => {
    try {
        const response = await api.post("/login", { email, password });
        return response.data;
    } catch (error) {
        throw error
    }
};

export const register = (userData) => {
    try {
        const response = api.post("/register", userData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUser = async (userId) => {
    try {
        const response = await api.get(`/getUser/${userId}`);
        return response.data
    } catch (error) {
        throw error
    }
};

export const getUserLoggedIn = async () => {
    try {
        const response = await api.get(`/getUserLoggedIn`);
        return response.data
    } catch (error) {
        throw error
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put("/updateUser", { userId, userData });
        return response.data
    } catch (error) {
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        return await api.get("/getAllUsers");
    } catch (error) {
        throw error
    }

}

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete("/users/deleteUser", { data: { userId } });
        return response.data
    } catch (error) {
        throw error;
    }
};