// src/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
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

export default api;
