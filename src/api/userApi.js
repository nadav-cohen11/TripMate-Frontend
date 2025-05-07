import api from "./axios";

export const login = async (email, password) => {
    try {
        const response = await api.post("/users/login", { email, password });
        return response;
    } catch (error) {
        throw error
    }
};

export const register = (userData) => {
    try {
        const response = api.post("/users/register", userData);
        return response;
    } catch (error) {
        throw error;
    }
};


export const getUser = async (userId) => {
    try {
        const response = await api.get(`/users/getUser/${userId}`);
        return response.data
    } catch (error) {

    }
};

export const updateUser = (userId, userData) => {
    return api.put("/users/updateUser", { userId, userData });
};

export const deleteUser = (userId) => {
    return api.delete("/users/deleteUser", { data: { userId } });
};

export const getAllUsers = async () => {
    return await api.get("/users/");
};