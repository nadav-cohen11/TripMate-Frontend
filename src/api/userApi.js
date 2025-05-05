import api from "./axios";


export const login = async (email, password) => {
    try {
        const response = await api.post("/login", { email, password });
        return response;
    } catch (error) {
        throw error
    }
};

export const register = (userData) => {
    return api.post("/register", userData);
};


export const getUser = async (userId) => {
    try {
        const response = await api.get(`/getUser/${userId}`);
        return response.data
    } catch (error) {

    }
};

export const getUserLoggedIn = async () => {
    try {
        const response = await api.get(`/getUserLoggedIn`);
        return response.data
    } catch (error) { }
};

export const updateUser = (userId, userData) => {
    return api.put("/updateUser", { userId, userData });
};

export const deleteUser = (userId) => {
    return api.delete("/deleteUser", { data: { userId } });
};

export const getAllUsers = async () => {
    return await api.get("/getAllUsers");
};