import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_API_URL_DEV

const instance = axios.create({
  baseURL: `${URL}`, 
  withCredentials: true, 
});

export default instance;
