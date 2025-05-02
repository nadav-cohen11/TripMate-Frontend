import api from "/src/api/axios.js";
import { handleApiError } from "../utils/errorUtils";

export const login = async (email, password) => {
    try {
        const { data } = await api.post("/users/login", { email, password });
        return data;
    } catch (error) {
        handleApiError(error, "Login failed");
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const { data } = await api.post("/users/register", userData);
        return data;
    } catch (error) {
        handleApiError(error, "Registration failed");
        throw error;
    }
};

export const updateUser = async (userData) => {
    try {
        const { data } = await api.put("/users/updateUser", userData);
        return data;
    } catch (error) {
        handleApiError(error, "Update failed");
        throw error;
    }
};

export const getUser = async (userId) => {
    try {
        const { data } = await api.get(`/users/getUser/${userId}`);
        return data;
    } catch (error) {
        handleApiError(error, "Failed to fetch user");
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const { data } = await api.delete("/users/deleteUser", {
            data: { userId },
        });
        return data;
    } catch (error) {
        handleApiError(error, "Delete user failed");
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const data = await api.get("users/");
        return data;
    } catch (error) {
        handleApiError(error, "Failed to load users");
        throw error;
    }
};