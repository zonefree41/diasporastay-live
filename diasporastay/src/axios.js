// src/axios.js
import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000", // ✅ safe fallback
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach correct token depending on who is logged in
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

export default api;

