import api from "/src/api/axios.js";
import axios from "axios";

export const login = async (email, password, location) => {
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


export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUserWithReviews = async () => {
    try {
        const response = await api.get(`/users/getUserWithReviews`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllTripsForUser = async () => {
    try {
        const response = await api.get('/trips/getAllTripsForUser')
        return response.data
    } catch (error) {
        throw error
    }
}


export const getAllGroups = async () => {
    try {
        const response = await api.get('/users/getGroupChats')
        return response.data
    } catch (error) {
        throw error
    }
}

export const getQrCodeByUserId = async (userId) => {
    try {
        const { data } = await api.get(`/qr/${userId}`);
        return data.qrCode;

    } catch (error) {
        throw error
    }
}


export const getUserByEmail = async (email) => {
    try {
        const response = await api.get(`/users/getUserByEmail`, { params: { email } });
        return response.data
    } catch (error) {
        throw error
    }
};


export const translate = async (prompt) => {
    try {
        const user = await getUser();
        const toLang = user.languagesSpoken[0];
        const detectRes = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: prompt,
                langpair: 'auto|en'
            }
        });
        const fromLang = detectRes.data.responseData.detectedSourceLanguage || 'en';

        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: prompt,
                langpair: `${fromLang}|${toLang}`
            }
        });


        return response.data.responseData.translatedText;
    } catch (error) {
        throw error;
    }
}