import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "https://backend-flame-kappa-58.vercel.app/api",
});

export default api;