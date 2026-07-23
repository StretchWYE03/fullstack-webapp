import axios from "axios";
import { getAccessToken } from "../../auth/supabaseConfig";

const apiClient = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
    "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(async (config) => {
    const token = getAccessToken();
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { apiClient };