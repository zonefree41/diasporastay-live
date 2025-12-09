import { useState } from "react";
import api from "../axios";

export default function OwnerLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const API = import.meta.env.VITE_API_BASE;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/api/owner/auth/login`, {
                email,
                password,
            });

            localStorage.setItem("ownerToken", res.data.token);
            localStorage.setItem("ownerId", res.data.owner.id);   // ⭐ FIXED
            localStorage.setItem("ownerEmail", res.data.owner.email); // ⭐ FIXED


            window.location.href = "/owner/dashboard";
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="auth-container">
            <h2>Hotel Owner Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}
