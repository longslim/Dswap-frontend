import axios from "axios";

const api = axios.create({
  baseURL: "https://dswap-backend.onrender.com/api/v1",
  withCredentials: true,
  timeout: 30000
});

export default api;

