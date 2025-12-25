// src/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// IMPORTANT: OWNER FIRST
api.interceptors.request.use((config) => {
    const ownerToken = localStorage.getItem("ownerToken");
    const guestToken = localStorage.getItem("guestToken");

    if (ownerToken) {
        config.headers.Authorization = `Bearer ${ownerToken}`;
    } else if (guestToken) {
        config.headers.Authorization = `Bearer ${guestToken}`;
    }

    return config;
});

export default api;
