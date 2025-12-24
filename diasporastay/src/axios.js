// src/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const guestToken = localStorage.getItem("guestToken");
    const ownerToken = localStorage.getItem("ownerToken");

    if (guestToken) {
        config.headers.Authorization = `Bearer ${guestToken}`;
    } else if (ownerToken) {
        config.headers.Authorization = `Bearer ${ownerToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            typeof error?.response?.data === "string" &&
            error.response.data.startsWith("<!doctype")
        ) {
            console.error("HTML RESPONSE RECEIVED (WRONG ROUTE)");
        }
        return Promise.reject(error);
    }
);


export default api;
