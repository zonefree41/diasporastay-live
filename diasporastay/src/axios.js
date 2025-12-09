// src/axios.js
import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
    baseURL: API,
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
