import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_API_URL_DEV;
console.log(baseURL);

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true, 
});

export default instance;
