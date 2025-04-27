import api from "./axios";


export const login = async(email, password) => {
    try{
        console.log("DSFSDF")
        const response = await api.post("/login", { email, password });
        console.log(response)
    }catch(error){

    }
};

export const register = (userData) => {
    return api.post("/register", userData);
};


export const getUser = async(userId) => {
    try{
        const response = await api.get(`/getUser/${userId}`);
        return response.data
    }catch(error){

    }
};

export const updateUser = (userId, userData) => {
    return api.put("/updateUser", { userId, userData });
};

export const deleteUser = (userId) => {
    return api.delete("/deleteUser", { data: { userId } });
};

export const getAllUsers = async() => {
    return await api.get("/getAllUsers");
};